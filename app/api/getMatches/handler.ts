// app/api/getMatches/handler.ts
import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerIdParam = searchParams.get('playerId');

  if (!playerIdParam) {
    return NextResponse.json(
      { error: 'playerId query parameter is required' },
      { status: 400 }
    );
  }

  const playerId = parseInt(playerIdParam, 10);
  if (isNaN(playerId)) {
    return NextResponse.json(
      { error: 'playerId must be a valid integer' },
      { status: 400 }
    );
  }

  try {
    const matches = await prisma.match.findMany({
      where: {
        playerMatches: {
          some: { playerId },
        },
      },
      orderBy: { date: 'desc' },
      include: {
        playerMatches: {
          where: { playerId },
          include: {
            // include only the “other” slots
            playerTwo: {
              select: { firstName: true, lastName: true },
            },
            opponent: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ matches });
  } catch (err) {
    console.error('Error in GET /api/getMatches:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



