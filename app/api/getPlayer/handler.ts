// app/api/getPlayerWithStats/handler.ts
import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('playerId');
    console.log(idParam)
  if (!idParam) {
    return NextResponse.json(
      { error: 'playerId query parameter is required' },
      { status: 400 }
    );
  }

  const playerId = parseInt(idParam, 10);
  if (isNaN(playerId)) {
    return NextResponse.json(
      { error: 'playerId must be a valid integer' },
      { status: 400 }
    );
  }

  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true, // fetch all related PlayerStat rows
      },
    });

    if (!player) {
      return NextResponse.json(
        { error: `Player with id ${playerId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error in GET /api/getPlayerWithStats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
