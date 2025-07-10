import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
import runpodSdk from "runpod-sdk";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { playerOne, playerTwo, date, fieldType, matchType, videoURL, thumbnail } = data;

  try {
    if (!playerOne || !playerTwo || !date || !fieldType || !matchType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    // Create Match record
    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        type: matchType,
        fieldType: fieldType,
        videoUrl: videoURL,
        imageUrl: thumbnail,
        videoType: "mp4" 
      },
    });

    // Find or create PlayerOne (always a Player)
    const playerOneRecord = await prisma.player.findFirst({
      where: { email: playerOne.email },
    });

    if (!playerOneRecord) {
      return NextResponse.json({ message: "something went wrong during query" }, { status: 501 });
    }

    // For playerTwo: determine if Player or Opponent
    let playerTwoRecord;
    let isOpponent = false;

    if (playerTwo.email) {
      // Try find Player by email
      playerTwoRecord = await prisma.player.findFirst({
        where: { email: playerTwo.email },
      });

    } else  {
      isOpponent = true;
      // Try find Opponent by name (or other unique criteria)
      playerTwoRecord = await prisma.opponent.findFirst({
        where: {
          firstName: playerTwo.firstName,
          lastName: playerTwo.lastName,
        },
      });

      if (!playerTwoRecord) {
        NextResponse.json({ message: "Something went wrong during query" }, { status: 501 });
      }
    }

    // Create PlayerMatch for playerOne
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: playerOneRecord.id,
        result: playerOne.result || "win",
      },
    });

    // Create PlayerMatch for playerTwo (Player or Opponent)
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: isOpponent ? null : playerTwoRecord?.id,
        opponentId: isOpponent ? playerTwoRecord?.id : null,
        result: playerTwo.result || "",
      },
    });

    if(process.env.ENVIRONMENT == "prod"){
    const runpod = runpodSdk(process.env.AI_SERVER_API_KEY);
    const endpoint = runpod.endpoint(process.env.ENDPOINT_ID);
    const result = await endpoint.run({
      "input": {
        "route": "analysis/process_video",
        "data": {
          "video_url": videoURL,
          "video_id": match.id
        }
      }
    });
    
    if(result.status == 'IN_QUEUE'){
      return NextResponse.json({ success:true, message: "Match and data analysis created successfully" });
    }
    }
    return NextResponse.json({ success:true, message: "Match and player matches created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating match', error: String(error) }, { status: 500 });
  }
}
