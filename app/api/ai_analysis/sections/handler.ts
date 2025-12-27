// /app/api/ai/sections/route.ts  (or your actual path)
import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function mapPlayerWonPoint(value: any): "TOP" | "BOTTOM" | null {
  if (value === "top") return "TOP";
  if (value === "bottom") return "BOTTOM";
  return null;
}

function mapPlayerHit(value: any): "TOP" | "BOTTOM" {
  return value === "top" ? "TOP" : "BOTTOM";
}

function mapBounceState(value: any): "VALID" | "OUT_OF_BOUNDS" | "NET_HIT" | null {
  if (value === "valid") return "VALID";
  if (value === "out_of_bounds") return "OUT_OF_BOUNDS";
  if (value === "net_hit") return "NET_HIT";
  return null;
}

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

    // Transaction: wipe existing sections for this match → insert new ones
    await prisma.$transaction(async (tx) => {
      // Delete existing sections (cascade will delete summaries and strokes)
      await tx.videoSection.deleteMany({ where: { matchId } });

      // Process each section
      for (const sec of sections) {
        if (!sec?.start || !sec?.end) {
          throw new Error(`Section is missing start/end`);
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
          throw new Error(`Invalid start/end format in section`);
        }

        // Create VideoSection
        const videoSection = await tx.videoSection.create({
          data: {
            matchId,
            startIndex,
            startTime,
            endIndex,
            endTime,
          },
        });

        // Create SectionSummary if provided
        if (summary && typeof summary === "object") {
          const playerWonPoint = mapPlayerWonPoint(summary.player_won_point);
          const rallySize = typeof summary.rally_size === "number" ? summary.rally_size : 0;
          const validRally = typeof summary.valid_rally === "boolean" ? summary.valid_rally : false;

          await tx.sectionSummary.create({
            data: {
              videoSectionId: videoSection.id,
              playerWonPoint,
              rallySize,
              validRally: validRally,
            },
          });
        }

        // Create Stroke records if provided
        if (Array.isArray(strokes)) {
          const strokeRecords = strokes.map((stroke: any) => {
            const start = typeof stroke.start === "number" ? stroke.start : 0;
            const playerHit = mapPlayerHit(stroke.player_hit);

            // Extract coordinates from arrays or objects
            const topPlayerLocation = stroke.top_player_location;
            const bottomPlayerLocation = stroke.bottom_player_location;
            const bounceLocation = stroke.bounce?.location;
            const bounceStart = stroke.bounce?.start;

            return {
              videoSectionId: videoSection.id,
              start,
              playerHit,
              topPlayerLocationX: Array.isArray(topPlayerLocation) && topPlayerLocation.length >= 1 ? topPlayerLocation[0] : null,
              topPlayerLocationY: Array.isArray(topPlayerLocation) && topPlayerLocation.length >= 2 ? topPlayerLocation[1] : null,
              bottomPlayerLocationX: Array.isArray(bottomPlayerLocation) && bottomPlayerLocation.length >= 1 ? bottomPlayerLocation[0] : null,
              bottomPlayerLocationY: Array.isArray(bottomPlayerLocation) && bottomPlayerLocation.length >= 2 ? bottomPlayerLocation[1] : null,
              bounceLocationX: Array.isArray(bounceLocation) && bounceLocation.length >= 1 ? bounceLocation[0] : null,
              bounceLocationY: Array.isArray(bounceLocation) && bounceLocation.length >= 2 ? bounceLocation[1] : null,
              bounceState: stroke.bounce?.state ? mapBounceState(stroke.bounce.state) : null,
              bounceStartIndex: bounceStart?.index ?? null,
              bounceStartTime: bounceStart?.time ?? null,
              ballSpeed: typeof stroke.ball_speed === "number" ? stroke.ball_speed : null,
            };
          });

          if (strokeRecords.length > 0) {
            await tx.stroke.createMany({
              data: strokeRecords,
            });
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: `Stored ${sections.length} sections for match ${matchId}`,
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
