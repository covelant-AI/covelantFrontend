import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, data: sections } = await req.json();

    // Validate
    if (!video_id) {
      return NextResponse.json({ message: 'Missing video_id' }, { status: 400 });
    }
    if (!Array.isArray(sections)) {
      return NextResponse.json({ message: 'data must be an array' }, { status: 400 });
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'video_id must be numeric' }, { status: 400 });
    }

    // Prepare records
    const records = sections.map((sec) => {
      const {
        start: { index: startIndex, time: startTime },
        end:   { index: endIndex,   time: endTime },
      } = sec;

      if (
        typeof startIndex !== 'number' ||
        typeof startTime  !== 'number' ||
        typeof endIndex   !== 'number' ||
        typeof endTime    !== 'number'
      ) {
        throw new Error('Invalid section format');
      }

      return {
        matchId,
        startIndex,
        startTime,
        endIndex,
        endTime,
      };
    });

    if (records.length === 0) {
      return NextResponse.json({ message: 'No sections to store' }, { status: 400 });
    }

    // Transaction: delete old + insert new
    await prisma.$transaction([
      prisma.videoSection.deleteMany({ where: { matchId } }),
      prisma.videoSection.createMany({
        data: records,
        skipDuplicates: true,
      }),
    ]);

    return NextResponse.json(
      { message: `Stored ${records.length} sections for match ${matchId}` },
      { status: 200 }
    );
    
  } catch (err) {
    console.error('Error storing video sections:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error storing video sections', error: msg },
      { status: 500 }
    );
  }
}
