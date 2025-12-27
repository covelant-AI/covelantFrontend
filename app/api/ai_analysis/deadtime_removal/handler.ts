import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { video_id, data } = body;

    if (!video_id || !Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Invalid payload. `video_id` and `data` are required.' },
        { status: 400 }
      );
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json(
        { message: '`video_id` must be a valid integer.' },
        { status: 400 }
      );
    }

    // Optional: Delete existing VideoSections for this matchId
    await prisma.videoSection.deleteMany({
      where: { matchId }
    });

    // Prepare and create video sections
    const sections = data.map((section: any) => ({
      matchId,
      startTime: section.start.time,
      endTime: section.end.time,
      rallySize: 0, // Default value required by schema
      validRally: false, // Default value required by schema
    }));

    await prisma.videoSection.createMany({
      data: sections,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: `Deadtime stored for match ${matchId}`, count: sections.length },
      { status: 200 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error storing deadtime', error: msg },
      { status: 500 }
    );
  }
}


