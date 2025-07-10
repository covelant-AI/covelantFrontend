import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { video_id, data: videoData } = body;

    // Validate top-level
    if (!video_id) {
      return NextResponse.json(
        { message: 'Missing video_id in request' },
        { status: 400 }
      );
    }
    if (
      !videoData ||
      typeof videoData.fps !== 'number' ||
      typeof videoData.width !== 'number' ||
      typeof videoData.height !== 'number' ||
      typeof videoData.total_frames !== 'number'
    ) {
      return NextResponse.json(
        { message: 'Invalid or incomplete video data' },
        { status: 400 }
      );
    }

    // Parse IDs & rename total_frames → totalFrames
    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json(
        { message: 'video_id must be a numeric string' },
        { status: 400 }
      );
    }

    // Update the Match row
    const updated = await prisma.match.update({
      where: { id: matchId },
      data: {
        fps: videoData.fps,
        width: videoData.width,
        height: videoData.height,
        totalFrames: videoData.total_frames,
      },
    });

    return NextResponse.json(
      { message: 'Video info stored', match: { id: updated.id } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing video info:', error);
    return NextResponse.json(
      { message: 'Error storing video info', error: (error as Error).message },
      { status: 500 }
    );
  }
}
