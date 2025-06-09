// /app/api/getMatchTags/route.ts
import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mid = url.searchParams.get('id');
    if (!mid) {
      return NextResponse.json(
        { message: 'Missing matchId query parameter' },
        { status: 400 }
      );
    }
    const matchId = parseInt(mid, 10);
    if (isNaN(matchId)) {
      return NextResponse.json(
        { message: 'Invalid matchId parameter' },
        { status: 400 }
      );
    }

    // Fetch all MatchEvent rows for this match
    const tags = await prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: { eventTimeSeconds: 'asc' },
    }) 

    return NextResponse.json(
      { message: 'MatchEvents fetched', data: tags },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching MatchEvents:', error);
    return NextResponse.json(
      { message: 'Error fetching MatchEvents', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
