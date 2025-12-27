import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import runpodSdk from 'runpod-sdk';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { playerOne, playerTwo, date, fieldType, matchType, videoURL, thumbnail, duration, winnerId, features } = data;

  try {
    if (!playerOne || !playerTwo || !date || !fieldType || !matchType || winnerId === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Resolve Player One (must exist)
    const playerOneRecord = await prisma.player.findFirst({
      where: { email: playerOne.email },
    });
    if (!playerOneRecord) {
      return NextResponse.json({ message: 'PlayerOne not found' }, { status: 404 });
    }

    // Resolve Player Two: Player by email OR Opponent by name (and create if missing)
    const playerTwoIsPlayer =
      typeof playerTwo?.email === 'string' && playerTwo.email.trim() !== '';

    let playerTwoPlayer: { id: number } | null = null;
    let opponent: { id: number } | null = null;

    if (playerTwoIsPlayer) {
      playerTwoPlayer = await prisma.player.findFirst({
        where: { email: playerTwo.email },
      });
      if (!playerTwoPlayer) {
        return NextResponse.json({ message: 'PlayerTwo not found' }, { status: 404 });
      }
    } else {
      const firstName = (playerTwo.firstName ?? '').trim();
      const lastName = (playerTwo.lastName ?? '').trim();
      if (!firstName || !lastName) {
        return NextResponse.json({ message: 'Opponent firstName & lastName required' }, { status: 400 });
      }
      // find or create opponent
      const existing = await prisma.opponent.findFirst({
        where: { firstName, lastName },
      });
      opponent = existing ?? (await prisma.opponent.create({ data: { firstName, lastName } }));
    }

    // Winner logic: frontend sends playerOne.id if P1 wins; if P2 wins and it's an Opponent, it sends a sentinel (e.g., -1)
    const isPlayerOneWinner = winnerId === playerOneRecord.id;
    const isPlayerTwoWinner = !isPlayerOneWinner;

    // Do DB writes atomically
    const resultPayload = await prisma.$transaction(async (tx) => {
      const match = await tx.match.create({
        data: {
          date: new Date(date),
          type: matchType,
          fieldType,
          videoUrl: videoURL,
          imageUrl: thumbnail,
          videoType: 'mp4',
          duration: duration ? Number(duration) : null,
        },
      });

      // PlayerMatch row from Player One's perspective
      await tx.playerMatch.create({
        data: {
          matchId: match.id,
          playerId: playerOneRecord.id,
          ...(playerTwoPlayer
            ? { playerTwoId: playerTwoPlayer.id } // <-- reference Player.id
            : { opponentId: opponent!.id }        // <-- reference Opponent.id
          ),
          result: isPlayerOneWinner ? 'win' : 'lose',
        },
      });

      // PlayerMatch row for the other side
      await tx.playerMatch.create({
        data: {
          matchId: match.id,
          ...(playerTwoPlayer
            ? {
                playerId: playerTwoPlayer.id,     // P2 as Player
                playerTwoId: playerOneRecord.id,  // P1 as the "other" player
              }
            : {
                opponentId: opponent!.id,         // Only opponent id (no playerId)
              }
          ),
          result: isPlayerTwoWinner ? 'win' : 'lose',
        },
      });

      return { matchId: match.id };
    });

    // Optional: kick off analysis on Runpod (unchanged)
    if (process.env.CONNECT_AI !== 'false') {
      const runpod = runpodSdk(process.env.AI_SERVER_API_KEY);
      const endpoint = runpod.endpoint(process.env.ENDPOINT_ID);
      const rp = await endpoint.run({
        input: {
          route: 'analysis/process_video',
          data: {
            video_url: videoURL,
            video_id: resultPayload.matchId,
            features: features || ['Dead time Detection'],
          },
        },
      });

      // Create AnalysisStatus record
      await prisma.analysisStatus.create({
        data: {
          matchId: resultPayload.matchId,
          server: 'runpod',
          serverId: process.env.ENDPOINT_ID || 'unknown',
          requestId: rp.id,
          status: rp.status as 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Match and player matches created successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating match', error: String(error) }, { status: 500 });
  }
}
