import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const { id } = await req.json();

    if (!email || !id) {
      return NextResponse.json(
        { message: "Email, coachId, and playerId are required" },
        { status: 400 }
      );
    }

    // 1. Check if the email belongs to a player or a coach
    const player = await prisma.player.findFirst({
      where: { email: email },
      include: {
        coaches: true, // Get the list of coaches associated with the player
      },
    });

    const coach = await prisma.coach.findFirst({
      where: { email: email },
      include: {
        players: true, // Get the list of players associated with the coach
      },
    });

    // 2. If email matches a player
    if (player) {
      // Disconnect the player from the coach
      const updatedPlayer = await prisma.player.update({
        where: { id: player.id },
        data: {
          coaches: {
            disconnect: {
              id: id,  // Disconnect the coach by coachId
            },
          },
        },
        include: {
          coaches: true, // Return the updated list of coaches
        },
      });

      return NextResponse.json(
        {
          message: "Player removed successfully",
          coaches: updatedPlayer.coaches, // Return the updated coach list
        },
        { status: 200 }
      );
    }

    // 3. If email matches a coach
    if (coach) {
      // Disconnect the coach from the player
      const updatedCoach = await prisma.coach.update({
        where: { id: coach.id },
        data: {
          players: {
            disconnect: {
              id: id,  // Disconnect the player by playerId
            },
          },
        },
        include: {
          players: true, // Return the updated list of players
        },
      });

      return NextResponse.json(
        {
          message: "Player removed successfully",
          players: updatedCoach.players, // Return the updated player list
        },
        { status: 200 }
      );
    }

    // If email does not match a player or coach
    return NextResponse.json(
      { message: "Email not found as player or coach" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error removing player from coach's list",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}


