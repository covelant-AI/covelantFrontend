// /app/api/getMatchData/route.ts
import { PrismaClient, MetricType } from '../../../generated/prisma';
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
            player:    { select: { id: true, firstName: true, lastName: true, avatar: true } },
            playerTwo: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            opponent:  { select: { id: true, firstName: true, lastName: true } },
          },
        },
        scorePoints: {
          include: {
            player:   { select: { id: true, firstName: true, lastName: true, avatar: true } },
            opponent: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { eventTimeSeconds: 'asc' },
        },
        matchMetrics: {
          orderBy: { eventTimeSeconds: 'asc' },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    // 1) Participants
    const participants = [];
    for (const pm of match.playerMatches) {
      if (pm.player) {
        participants.push({
          type:      'PLAYER' as const,
          id:         pm.player.id,
          firstName: pm.player.firstName,
          lastName:  pm.player.lastName,
          avatar:    pm.player.avatar,
        });
      }
      if (pm.playerTwo) {
        participants.push({
          type:      'PLAYER' as const,
          id:         pm.playerTwo.id,
          firstName: pm.playerTwo.firstName,
          lastName:  pm.playerTwo.lastName,
          avatar:    pm.playerTwo.avatar,
        });
      }
      if (pm.opponent) {
        participants.push({
          type:      'OPPONENT' as const,
          id:         pm.opponent.id,
          firstName: pm.opponent.firstName,
          lastName:  pm.opponent.lastName,
        });
      }
    }

    // 2) Score points (with gamePoint & matchPoint)
    const scorePoints = match.scorePoints.map(sp => ({
      setNumber:        sp.setNumber,
      gamePoint:        sp.gamePoint,
      matchPoint:       sp.matchPoint,
      eventTimeSeconds: sp.eventTimeSeconds,
      scorer: sp.player
        ? {
            type: 'PLAYER' as const,
            id: sp.player.id,
            firstName: sp.player.firstName,
            lastName: sp.player.lastName,
            avatar: sp.player.avatar,
          }
        : {
            type: 'OPPONENT' as const,
            id: sp.opponent!.id,
            firstName: sp.opponent!.firstName,
            lastName: sp.opponent!.lastName,
          },
    }));

    const ballSpeeds = match.matchMetrics
      .filter(m => m.metricType === MetricType.BALL_SPEED)
      .map(m => ({
        eventTimeSeconds: m.eventTimeSeconds,
        value: m.value,
      }));

    // player speeds
    const playerSpeeds = match.matchMetrics
      .filter(m => m.metricType === MetricType.PLAYER_SPEED)
      .map(m => ({
        playerId:         m.playerId!,
        eventTimeSeconds: m.eventTimeSeconds,
        value:            m.value,
      }));

    // longest rallies
    const longestRallies = match.matchMetrics
      .filter(m => m.metricType === MetricType.LONGEST_RALLY)
      .map(m => ({
        eventTimeSeconds: m.eventTimeSeconds,
        value:            m.value,
      }));

    // strikes efficiency
    const strikesEff = match.matchMetrics
      .filter(m => m.metricType === MetricType.STRIKES_EFF)
      .map(m => ({
        eventTimeSeconds: m.eventTimeSeconds,
        value:            m.value,
      }));

    // now include *all* of them in our response:
    const data = {
      participants,
      scorePoints,
      ballSpeeds,
      playerSpeeds,
      longestRallies,
      strikesEff,
    };

    return NextResponse.json(
      { message: 'MatchData fetched', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching MatchData:', error);
    return NextResponse.json(
      { message: 'Error fetching MatchData', error: (error as Error).message },
      { status: 500 }
    );
  }
}



