// app/api/getMatchInfo/handler.ts
import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mid = url.searchParams.get('id');
    
    if (!mid) {
      return NextResponse.json({ message: 'Missing match id' }, { status: 400 });
    }
    
    const matchId = Number(mid);
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'Invalid match id' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        playerMatches: {
          include: {
            player: { 
              select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                avatar: true,
                email: true 
              } 
            },
            playerTwo: { 
              select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                avatar: true,
                email: true 
              } 
            },
            opponent: { 
              select: { 
                id: true, 
                firstName: true, 
                lastName: true,
                email: true 
              } 
            },
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    // Extract players from playerMatches
    const players = [];
    for (const pm of match.playerMatches) {
      if (pm.player) {
        players.push({
          id: pm.player.id,
          firstName: pm.player.firstName,
          lastName: pm.player.lastName,
          avatar: pm.player.avatar,
          email: pm.player.email,
        });
      }
      if (pm.playerTwo) {
        players.push({
          id: pm.playerTwo.id,
          firstName: pm.playerTwo.firstName,
          lastName: pm.playerTwo.lastName,
          avatar: pm.playerTwo.avatar,
          email: pm.playerTwo.email,
        });
      }
      if (pm.opponent) {
        players.push({
          id: pm.opponent.id,
          firstName: pm.opponent.firstName,
          lastName: pm.opponent.lastName,
          avatar: null,
          email: pm.opponent.email,
        });
      }
    }

    // Remove duplicates based on id
    const uniquePlayers = Array.from(
      new Map(players.map(p => [p.id, p])).values()
    );

    const matchInfo = {
      id: match.id,
      videoUrl: match.videoUrl,
      imageUrl: match.imageUrl,
      type: match.type,
      result: match.result,
      fieldType: match.fieldType,
      status: match.status,
      date: match.date,
      videoType: match.videoType,
      players: uniquePlayers,
    };

    return NextResponse.json({ 
      success: true, 
      data: matchInfo 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching match info:', error);
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 }
    );
  }
}

