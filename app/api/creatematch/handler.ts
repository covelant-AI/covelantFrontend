import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';

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
        videoType: "unknown" // or set based on data if available
      },
    });

    // Find or create PlayerOne (always a Player)
    let playerOneRecord = await prisma.player.findFirst({
      where: { email: playerOne.email },
    });

    if (!playerOneRecord) {
      playerOneRecord = await prisma.player.create({
        data: {
          firstName: playerOne.firstName,
          lastName: playerOne.lastName,
          email: playerOne.email,
          avatar: playerOne.avatar || null,
        },
      });
    }

    // For playerTwo: determine if Player or Opponent
    let playerTwoRecord;
    let isOpponent = false;

    if (playerTwo.stats) {
      // Try find Player by email
      playerTwoRecord = await prisma.player.findFirst({
        where: { email: playerTwo.email },
      });

      if (!playerTwoRecord) {
        playerTwoRecord = await prisma.player.create({
          data: {
            firstName: playerTwo.firstName,
            lastName: playerTwo.lastName,
            email: playerTwo.email,
            avatar: playerTwo.avatar || null,
          },
        });
      }
    } else if (playerTwo.firstName && playerTwo.lastName) {
      isOpponent = true;
      // Try find Opponent by name (or other unique criteria)
      playerTwoRecord = await prisma.opponent.findFirst({
        where: {
          firstName: playerTwo.firstName,
          lastName: playerTwo.lastName,
        },
      });

      if (!playerTwoRecord) {
        playerTwoRecord = await prisma.opponent.create({
          data: {
            firstName: playerTwo.firstName,
            lastName: playerTwo.lastName,
          },
        });
      }
    } else {
      return NextResponse.json({ message: "Invalid playerTwo type" }, { status: 400 });
    }

    // Create PlayerMatch for playerOne
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: playerOneRecord.id,
        result: playerOne.result || "", // if you have this info
      },
    });

    // Create PlayerMatch for playerTwo (Player or Opponent)
    await prisma.playerMatch.create({
      data: {
        matchId: match.id,
        playerId: isOpponent ? null : playerTwoRecord.id,
        opponentId: isOpponent ? playerTwoRecord.id : null,
        result: playerTwo.result || "",
      },
    });

    return NextResponse.json({ success:true, message: "Match and player matches created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating match', error: String(error) }, { status: 500 });
  }
}
