// /app/api/ai/sections/route.ts  (or your actual path)
import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { video_id, data: sections } = await req.json();

    // Basic validation
    if (!video_id) {
      return NextResponse.json({ message: "Missing video_id" }, { status: 400 });
    }
    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { message: "data must be an array" },
        { status: 400 }
      );
    }

    const matchId = parseInt(video_id, 10);
    if (Number.isNaN(matchId)) {
      return NextResponse.json(
        { message: "video_id must be numeric" },
        { status: 400 }
      );
    }

    // Map incoming sections → Prisma create data
    const records = sections.map((sec: any, idx: number) => {
      if (!sec?.start || !sec?.end) {
        throw new Error(`Section at index ${idx} is missing start/end`);
      }

      const {
        start: { index: startIndex, time: startTime },
        end: { index: endIndex, time: endTime },
        summary,
        strokes,
      } = sec;

      if (
        typeof startIndex !== "number" ||
        typeof startTime !== "number" ||
        typeof endIndex !== "number" ||
        typeof endTime !== "number"
      ) {
        throw new Error(`Invalid start/end format in section at index ${idx}`);
      }

      // Very light sanity checks; JSON can be nested as-is
      const safeSummary =
        summary && typeof summary === "object" ? summary : undefined;

      const safeStrokes = Array.isArray(strokes) ? strokes : undefined;

      return {
        matchId,
        startIndex,
        startTime,
        endIndex,
        endTime,
        summary: safeSummary,
        strokes: safeStrokes,
      };
    });

    if (records.length === 0) {
      return NextResponse.json(
        { message: "No sections to store" },
        { status: 400 }
      );
    }

    // Transaction: wipe existing sections for this match → insert new ones
    await prisma.$transaction([
      prisma.videoSection.deleteMany({ where: { matchId } }),
      prisma.videoSection.createMany({
        data: records,
        skipDuplicates: true,
      }),
    ]);

    return NextResponse.json(
      {
        message: `Stored ${records.length} sections for match ${matchId}`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error storing video sections:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Error storing video sections", error: msg },
      { status: 500 }
    );
  }
}
