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
        strokes: {
          include: {
            bounces: true,
          },
          orderBy: { strokeOrder: "asc" },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Transform the data to match the expected format
    const data = videoSections.map((s) => {
      // Transform summary (fields are directly on VideoSection, not a relation)
      const summary: SectionSummary = {
        player_won_point: mapPlayerWonPoint(s.playerWonPoint as "TOP" | "BOTTOM" | null),
        rally_size: s.rallySize,
        valid_rally: s.validRally,
      };

      // Transform strokes
      const strokes = s.strokes.map((stroke) => {
        const topPlayerLocation: [number, number] | null =
          stroke.topPlayerX !== null && stroke.topPlayerY !== null
            ? [stroke.topPlayerX, stroke.topPlayerY]
            : null;

        const bottomPlayerLocation: [number, number] | null =
          stroke.bottomPlayerX !== null && stroke.bottomPlayerY !== null
            ? [stroke.bottomPlayerX, stroke.bottomPlayerY]
            : null;

        // Get bounce data from the bounces relation (take first bounce if exists)
        const firstBounce = stroke.bounces && stroke.bounces.length > 0 ? stroke.bounces[0] : null;
        const bounceLocation: [number, number] | null =
          firstBounce && firstBounce.locationX !== null && firstBounce.locationY !== null
            ? [firstBounce.locationX, firstBounce.locationY]
            : null;

        const bounceStart =
          firstBounce && firstBounce.startTime !== null
            ? {
                time: firstBounce.startTime,
              }
            : null;

        return {
          start: stroke.startTime ?? 0,
          player_hit: mapPlayerHit(stroke.playerHit as "TOP" | "BOTTOM"),
          top_player_location: topPlayerLocation,
          bottom_player_location: bottomPlayerLocation,
          bounce: {
            location: bounceLocation,
            state: mapBounceState(firstBounce?.state as "VALID" | "OUT_OF_BOUNDS" | "NET_HIT" | null),
            start: bounceStart,
          },
          ball_speed: stroke.ballSpeed,
        };
      });

      return {
        id: s.id,
        matchId: s.matchId,
        start: {
          time: s.startTime,
        },
        end: {
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
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}
