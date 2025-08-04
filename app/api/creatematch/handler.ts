import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
import runpodSdk from "runpod-sdk";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { playerOne, playerTwo, date, fieldType, matchType, videoURL, thumbnail, winnerId } = data;

  try {
    if (!playerOne || !playerTwo || !date || !fieldType || !matchType || !winnerId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create Match record
    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        type: matchType,
        fieldType,
        videoUrl: videoURL,
        imageUrl: thumbnail,
        videoType: "mp4"
      },
    });

    // Find PlayerOne
    const playerOneRecord = await prisma.player.findFirst({
      where: { email: playerOne.email },
    });

    if (!playerOneRecord) {
      return NextResponse.json({ message: "PlayerOne not found" }, { status: 404 });
    }

    // Determine if PlayerTwo is Opponent
    let playerTwoRecord;
    let isOpponent = false;

    if (playerTwo.email) {
      playerTwoRecord = await prisma.player.findFirst({
        where: { email: playerTwo.email },
      });
    } else {
      isOpponent = true;
      playerTwoRecord = await prisma.opponent.findFirst({
        where: {
          firstName: playerTwo.firstName,
          lastName: playerTwo.lastName,
        },
      });

      if (!playerTwoRecord) {
        return NextResponse.json({ message: "Opponent not found" }, { status: 404 });
      }
    }

    const isPlayerOneWinner = winnerId === playerOneRecord.id;
    const isPlayerTwoWinner = !isPlayerOneWinner;

    // Create PlayerMatch for playerOne
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: playerOneRecord.id,
        playerTwoId: playerTwoRecord.id,
        result: isPlayerOneWinner ? "win" : "lose",
      },
    });

    // Create PlayerMatch for playerTwo
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: isOpponent ? null : playerTwoRecord?.id,
        playerTwoId: isOpponent ? null : playerOneRecord?.id,
        opponentId: isOpponent ? playerTwoRecord?.id : null,
        result: isPlayerTwoWinner ? "win" : "lose",
      },
    });

    const runpod = runpodSdk(process.env.AI_SERVER_API_KEY);
    const endpoint = runpod.endpoint(process.env.ENDPOINT_ID);
    const result = await endpoint.run({
       "input": {
         "route": "analysis/process_video",
         "data": {
           "video_url": videoURL,
           "video_id": match.id,
           "features": data.features || ["Dead time Detection"],
         }
       }
     });

     if(result.status == 'IN_QUEUE'){
       return NextResponse.json({ success:true, message: "Match and data analysis created successfully" });
     }

    return NextResponse.json({ success: true, message: "Match and player matches created successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating match', error: String(error) }, { status: 500 });
  }
}
