// app/api/updateSection/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

type UpdateSectionBody = {
  id: number;
  startTime: number; // seconds (Float in DB)
  endTime: number;   // seconds (Float in DB)
};

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UpdateSectionBody>;
    const { id, startTime, endTime } = body;

    // Basic validation
    if (
      typeof id !== "number" ||
      typeof startTime !== "number" ||
      typeof endTime !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "id, startTime and endTime must be numbers" },
        { status: 400 }
      );
    }

    if (startTime < 0 || endTime < 0) {
      return NextResponse.json(
        { success: false, message: "Times must be non-negative" },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        {
          success: false,
          message: "endTime must be greater than startTime",
        },
        { status: 400 }
      );
    }

    // Update the VideoSection row
    const updatedSection = await prisma.videoSection.update({
      where: { id },
      data: {
        startTime,
        endTime,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "VideoSection updated successfully",
        data: updatedSection,
      },
      { status: 200 }
    );
  } catch (err: any) {
    // Prisma "record not found"
    if (err?.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "VideoSection not found" },
        { status: 404 }
      );
    }

    console.error("Error updating VideoSection:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while updating section",
        error: String(err),
      },
      { status: 500 }
    );
  } finally {
    // optional in serverless, but safe
    await prisma.$disconnect();
  }
}
