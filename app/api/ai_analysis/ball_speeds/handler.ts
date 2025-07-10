import { PrismaClient, MetricType } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, time_step, data: sections } = await req.json();

    if (!video_id) {
      return NextResponse.json({ message: 'Missing video_id' }, { status: 400 });
    }
    if (typeof time_step !== 'number' || time_step <= 0) {
      return NextResponse.json({ message: 'Invalid time_step; must be > 0' }, { status: 400 });
    }
    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ message: 'No data sections provided' }, { status: 400 });
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'video_id must be numeric' }, { status: 400 });
    }

    const records: Array<{
      matchId: number;
      metricType: MetricType;
      value: number;
      eventTimeSeconds: number;
    }> = [];

    for (const sectionItem of sections) {
      const { section, speeds } = sectionItem;
      if (!section?.start || typeof section.start.time !== 'number' || !Array.isArray(speeds)) {
        return NextResponse.json({ message: 'Malformed section object' }, { status: 400 });
      }

      const startTime = section.start.time;
      speeds.forEach((value: number, idx: number) => {
        if (typeof value !== 'number') return;
        const eventTimeSeconds = parseFloat((startTime + idx * time_step).toFixed(3));
        records.push({
          matchId,
          metricType: MetricType.BALL_SPEED,
          value,
          eventTimeSeconds,
        });
      });
    }

    if (records.length === 0) {
      return NextResponse.json({ message: 'No valid speed samples to store' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.matchMetric.deleteMany({
        where: { matchId, metricType: MetricType.BALL_SPEED },
      }),
      prisma.matchMetric.createMany({ data: records }),
    ]);

    return NextResponse.json(
      { message: `Stored ${records.length} ball-speed samples for match ${matchId}` },
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
