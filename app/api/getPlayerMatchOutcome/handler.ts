import { NextRequest, NextResponse } from 'next/server'

import { PrismaClient } from '../../../generated/prisma'; // adjust path as needed
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const emailParam = url.searchParams.get('email');
  
    if (!emailParam) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    const email = emailParam;

    try {
      // 1. Find the coach by email
      const coach = await prisma.coach.findFirst({
        where: { email: email },
        include: {
          players: true, 
        },
      });

      if (!coach || coach.players.length === 0) {
        return NextResponse.json({ message: 'No players found for this coach' }, { status: 400 });
      }

      // 2. Extract player IDs
      const playerIds = coach.players.map((player) => player.id);

      // 3. Fetch PlayerMatch results for all players
      const playerMatchResults = await prisma.playerMatch.findMany({
        where: {
          playerId: { in: playerIds },
        },
        include: {
          match: true,
          player: true,
        },
      });

      // 4. Format the response
      const formattedResults = playerMatchResults.map(pm => ({
        playerId: pm.player?.id,
        playerName: `${pm.player?.firstName ?? ''} ${pm.player?.lastName ?? ''}`.trim(),
        result: pm.result,
        match: {
          id: pm.match.id,
          date: pm.match.date.toISOString(),
          videoUrl: pm.match.videoUrl,
          imageUrl: pm.match.imageUrl,
          videoType: pm.match.videoType,
        }
      }));
      return NextResponse.json({ message: 'players found', data: formattedResults, }, { status: 200 });

    } catch (error) {
      console.error('Error fetching player match outcomes:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

