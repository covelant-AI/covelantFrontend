import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Delete the MatchEvent with the given ID
    const deletedTag = await prisma.matchEvent.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tag removed successfully", deletedTag },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing tag from match event:", error);
    return NextResponse.json(
      {
        message: "Error removing tag",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}



