import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, time_step, data: sections, error_sections = [] } = await req.json();

    // 1) Basic validation
    if (!video_id) {
      return NextResponse.json(
        { message: 'Missing video_id in request', error_sections },
        { status: 400 }
      );
    }
    if (typeof time_step !== 'number' || time_step <= 0) {
      return NextResponse.json(
        { message: 'Invalid time_step; must be a positive number', error_sections },
        { status: 400 }
      );
    }
    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { message: 'data must be an array of sections', error_sections },
        { status: 400 }
      );
    }

    const matchId = Number(video_id);
    if (Number.isNaN(matchId)) {
      return NextResponse.json(
        { message: 'video_id must be numeric', error_sections },
        { status: 400 }
      );
    }

    // 2) Fetch the two PlayerMatch rows for this match
    const pmatches = await prisma.playerMatch.findMany({
      where: { matchId },
      orderBy: { id: 'asc' }, // first is P1, second is P2
      take: 2,
    });
    if (pmatches.length !== 2) {
      return NextResponse.json(
        { message: `Expected 2 playerMatches for match ${matchId}`, error_sections },
        { status: 500 }
      );
    }
    const [p1Match, p2Match] = pmatches;
    const p1Id = p1Match.playerId!;
    const p2Id =
      p2Match.opponentId ??
      p2Match.playerTwoId ??
      p2Match.playerId!;

    // 3) Build up all the new records
    type Rec = {
      matchId: number;
      playerId: number;
      metricType: 'PLAYER_SPEED';
      value: number;
      eventTimeSeconds: number;
    };
    const records: Rec[] = [];

    for (const sec of sections) {
      const { section, p1_speeds, p2_speeds } = sec as {
        section: { start: { time: number }; end: { time: number } };
        p1_speeds: number[];
        p2_speeds: number[];
      };

      if (
        !section?.start ||
        typeof section.start.time !== 'number' ||
        !Array.isArray(p1_speeds) ||
        !Array.isArray(p2_speeds) ||
        p1_speeds.length !== p2_speeds.length
      ) {
        return NextResponse.json(
          { message: 'Malformed section or mismatched speed arrays', error_sections },
          { status: 400 }
        );
      }

      const t0 = section.start.time;
      const N = p1_speeds.length;

      for (let i = 0; i < N; i++) {
        const ts = parseFloat((t0 + time_step * i).toFixed(3));
        const v1 = p1_speeds[i];
        const v2 = p2_speeds[i];
        if (typeof v1 === 'number') {
          records.push({
            matchId,
            playerId: p1Id,
            metricType: 'PLAYER_SPEED',
            value: v1,
            eventTimeSeconds: ts,
          });
        }
        if (typeof v2 === 'number') {
          records.push({
            matchId,
            playerId: p2Id,
            metricType: 'PLAYER_SPEED',
            value: v2,
            eventTimeSeconds: ts,
          });
        }
      }
    }

    if (records.length === 0) {
      return NextResponse.json(
        { message: 'No valid speed samples to store', error_sections },
        { status: 400 }
      );
    }

    // 4) Group by playerId → set of eventTimeSeconds
    const timesByPlayer = new Map<number, Set<number>>();
    for (const { playerId, eventTimeSeconds } of records) {
      if (!timesByPlayer.has(playerId)) {
        timesByPlayer.set(playerId, new Set());
      }
      timesByPlayer.get(playerId)!.add(eventTimeSeconds);
    }

    // 5) Build deleteMany ops to remove old at those timestamps
    const deletes = Array.from(timesByPlayer.entries()).map(
      ([playerId, tsSet]) =>
        prisma.matchMetric.deleteMany({
          where: {
            matchId,
            metricType: 'PLAYER_SPEED',
            playerId,
            eventTimeSeconds: { in: Array.from(tsSet) },
          },
        })
    );

    // 6) Run deletes + createMany in one transaction
    const txResults = await prisma.$transaction([
      ...deletes,
      prisma.matchMetric.createMany({
        data: records,
        skipDuplicates: true,
      }),
    ]);

    // 7) Summarize
    const deletedCounts = (txResults.slice(0, deletes.length) as { count: number }[])
      .map(r => r.count)
      .reduce((a, b) => a + b, 0);
    const createdCount = (txResults[txResults.length - 1] as { count: number }).count;

    return NextResponse.json(
      {
        message: `Replaced ${deletedCounts} and added ${createdCount} PLAYER_SPEED samples for match ${matchId}`,
        error_sections,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error storing player speed data:', err);
    return NextResponse.json(
      {
        message: 'Error storing player speed data',
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
