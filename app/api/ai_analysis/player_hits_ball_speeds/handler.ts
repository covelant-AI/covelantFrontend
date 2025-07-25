import { PrismaClient, MetricType } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, data: sections } = await req.json();

    if (!video_id || !Array.isArray(sections)) {
      return NextResponse.json({ message: 'Missing or malformed input' }, { status: 400 });
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'video_id must be numeric' }, { status: 400 });
    }

    // Get the match and players/opponent
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        playerMatches: {
          include: {
            player: true,
            playerTwo: true,
            opponent: true,
          },
        },
      },
    });

    if (!match || !match.playerMatches.length) {
      return NextResponse.json({ message: 'Match not found or has no players' }, { status: 404 });
    }

    // Extract player and opponent IDs
    const { player, playerTwo, opponent } = match.playerMatches[0];
    const playerId = player?.id;
    const playerTwoId = playerTwo?.id;
    const opponentId = opponent?.id;

    const records: any[] = [];

    for (const sectionItem of sections) {
      const { section, p1, p2 } = sectionItem;
      const startTime = section?.start?.time;
      if (typeof startTime !== 'number') continue;

      // Handle P1 samples (current user)
      for (const sample of p1 || []) {
        if (typeof sample.speed !== 'number' || typeof sample.seconds !== 'number') continue;

        records.push({
          matchId,
          playerId: playerId ?? null,
          metricType: MetricType.BALL_SPEED,
          value: sample.speed,
          eventTimeSeconds: parseFloat((startTime + sample.seconds).toFixed(3)),
        });
      }

      // Handle P2 samples (opponent or playerTwo)
      for (const sample of p2 || []) {
        if (typeof sample.speed !== 'number' || typeof sample.seconds !== 'number') continue;

        const targetId = opponentId ?? playerTwoId;

        records.push({
          matchId,
          playerId: targetId ?? null,
          metricType: MetricType.BALL_SPEED,
          value: sample.speed,
          eventTimeSeconds: parseFloat((startTime + sample.seconds).toFixed(3)),
        });
      }
    }

    if (records.length === 0) {
      return NextResponse.json({ message: 'No valid ball speed samples to store' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.matchMetric.deleteMany({ where: { matchId, metricType: MetricType.BALL_SPEED } }),
      prisma.matchMetric.createMany({ data: records }),
    ]);

    return NextResponse.json(
      { message: `Stored ${records.length} ball speed samples for match ${matchId}` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error storing ball speed data', error: (error as Error).message },
      { status: 500 }
    );
  }
}
