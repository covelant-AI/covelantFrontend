// /app/api/updateTag/route.ts
import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { id, comment } = await req.json();

    // Validate
    if (typeof id !== "number" || typeof comment !== "string") {
      return NextResponse.json(
        { message: "Payload must include numeric id and string comment" },
        { status: 400 }
      );
    }

    // Update the comment field on the MatchEvent
    const updatedEvent = await prisma.matchEvent.update({
      where: { id },
      data: { comment },
    });

    return NextResponse.json(
      {
        message: "Tag updated successfully",
        event: updatedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      {
        message: "Error updating tag",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
