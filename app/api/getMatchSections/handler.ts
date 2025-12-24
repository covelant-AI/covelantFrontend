// app/api/getMatchSections/handler.ts
import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type PlayerWonPoint = "top" | "bottom" | null;

type SectionSummary = {
  player_won_point: PlayerWonPoint;
  rally_size: number;
  valid_rally: boolean;
} | null;

function normalizeSummary(summary: unknown): SectionSummary {
  if (!summary || typeof summary !== "object") return null;

  const s = summary as Record<string, unknown>;

  const player_won_point: PlayerWonPoint =
    s.player_won_point === "top" || s.player_won_point === "bottom"
      ? (s.player_won_point as "top" | "bottom")
      : null;

  const rally_size =
    typeof s.rally_size === "number" && Number.isFinite(s.rally_size)
      ? s.rally_size
      : 0;

  const valid_rally = typeof s.valid_rally === "boolean" ? s.valid_rally : false;

  return { player_won_point, rally_size, valid_rally };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const matchId = parseInt(url.searchParams.get("id") || "", 10);

    if (isNaN(matchId)) {
      return NextResponse.json({ message: "Invalid matchId" }, { status: 400 });
    }

    const videoSections = await prisma.videoSection.findMany({
      where: { matchId },
      select: {
        id: true,
        matchId: true,
        startIndex: true,
        startTime: true,
        endIndex: true,
        endTime: true,
        summary: true, // ✅ include summary from schema (Json?)
      },
      orderBy: { startTime: "asc" },
    });

    // Ensure the response ALWAYS has `summary` with the expected shape (or null)
    const data = videoSections.map((s) => ({
      ...s,
      summary: normalizeSummary(s.summary),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video sections:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
