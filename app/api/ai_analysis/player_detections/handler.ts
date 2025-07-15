import { PrismaClient } from '../../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, data: payload } = await req.json();

    // 1) Validate
    if (!video_id) {
      return NextResponse.json({ message: 'Missing video_id' }, { status: 400 });
    }
    if (!Array.isArray(payload)) {
      return NextResponse.json({ message: 'data must be an array' }, { status: 400 });
    }

    const matchId = parseInt(video_id, 10);
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'video_id must be numeric' }, { status: 400 });
    }

    // 2) Delete any old and insert the new blob
    await prisma.$transaction([
      prisma.playerDetection.deleteMany({ where: { matchId } }),
      prisma.playerDetection.create({
        data: {
          matchId,
          payload,
        },
      }),
    ]);

    return NextResponse.json(
      { message: `Stored player detection payload for match ${matchId}` },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error storing player detection payload:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error storing player detection payload', error: msg },
      { status: 500 }
    );
  }
}

