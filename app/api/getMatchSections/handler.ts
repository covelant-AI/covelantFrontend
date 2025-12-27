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

function mapPlayerWonPoint(value: "TOP" | "BOTTOM" | null): PlayerWonPoint {
  if (value === "TOP") return "top";
  if (value === "BOTTOM") return "bottom";
  return null;
}

function mapPlayerHit(value: "TOP" | "BOTTOM"): "top" | "bottom" {
  return value === "TOP" ? "top" : "bottom";
}

function mapBounceState(value: "VALID" | "OUT_OF_BOUNDS" | "NET_HIT" | null): "valid" | "out_of_bounds" | "net_hit" | null {
  if (value === "VALID") return "valid";
  if (value === "OUT_OF_BOUNDS") return "out_of_bounds";
  if (value === "NET_HIT") return "net_hit";
  return null;
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
      include: {
        summary: true,
        strokes: {
          orderBy: { start: "asc" },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Transform the data to match the expected format
    const data = videoSections.map((s) => {
      // Transform summary
      const summary: SectionSummary = s.summary
        ? {
            player_won_point: mapPlayerWonPoint(s.summary.playerWonPoint),
            rally_size: s.summary.rallySize,
            valid_rally: s.summary.validRally,
          }
        : null;

      // Transform strokes
      const strokes = s.strokes.map((stroke) => {
        const topPlayerLocation: [number, number] | null =
          stroke.topPlayerLocationX !== null && stroke.topPlayerLocationY !== null
            ? [stroke.topPlayerLocationX, stroke.topPlayerLocationY]
            : null;

        const bottomPlayerLocation: [number, number] | null =
          stroke.bottomPlayerLocationX !== null && stroke.bottomPlayerLocationY !== null
            ? [stroke.bottomPlayerLocationX, stroke.bottomPlayerLocationY]
            : null;

        const bounceLocation: [number, number] | null =
          stroke.bounceLocationX !== null && stroke.bounceLocationY !== null
            ? [stroke.bounceLocationX, stroke.bounceLocationY]
            : null;

        const bounceStart =
          stroke.bounceStartIndex !== null && stroke.bounceStartTime !== null
            ? {
                index: stroke.bounceStartIndex,
                time: stroke.bounceStartTime,
              }
            : null;

        return {
          start: stroke.start,
          player_hit: mapPlayerHit(stroke.playerHit),
          top_player_location: topPlayerLocation,
          bottom_player_location: bottomPlayerLocation,
          bounce: {
            location: bounceLocation,
            state: mapBounceState(stroke.bounceState),
            start: bounceStart,
          },
          ball_speed: stroke.ballSpeed,
        };
      });

      return {
        id: s.id,
        matchId: s.matchId,
        start: {
          index: s.startIndex,
          time: s.startTime,
        },
        end: {
          index: s.endIndex,
          time: s.endTime,
        },
        summary,
        strokes,
      };
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video sections:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
