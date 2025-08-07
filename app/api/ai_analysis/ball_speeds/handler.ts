import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { video_id, time_step, data } = body;

    if (!video_id || !time_step || !Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Invalid payload. video_id, time_step, and data are required.' },
        { status: 400 }
      );
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json(
        { message: 'Invalid video_id. Must be a number.' },
        { status: 400 }
      );
    }

    // ✅ Fetch playerId from PlayerMatch (playerOne)
    const playerMatch = await prisma.playerMatch.findFirst({
      where: {
        matchId,
        playerId: {
          not: null,
        },
      },
      select: {
        playerId: true,
      },
    });

    if (!playerMatch || !playerMatch.playerId) {
      return NextResponse.json(
        { message: `No Player One found for match ID ${matchId}` },
        { status: 404 }
      );
    }

    const playerId = playerMatch.playerId;

    const metrics = [];

    for (const section of data) {
      const startTime = section.section?.start?.time;
      const speeds = section.speeds;

      if (typeof startTime !== 'number' || !Array.isArray(speeds)) {
        return NextResponse.json(
          { message: 'Invalid section format: missing start time or speeds' },
          { status: 400 }
        );
      }

      for (let i = 0; i < speeds.length; i++) {
        const value = speeds[i];

        if (typeof value !== 'number') continue;

        const eventTimeSeconds = startTime + i * time_step;

        metrics.push({
          matchId,
          metricType: 'BALL_SPEED',
          value,
          eventTimeSeconds,
          playerId,
          createdAt: new Date(),
        });
      }
    }

    if (metrics.length > 0) {
      await prisma.matchMetric.createMany({
        data: metrics,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      { message: 'Ball speed data stored successfully', count: metrics.length },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error storing ball speed data', error: msg },
      { status: 500 }
    );
  }
}
