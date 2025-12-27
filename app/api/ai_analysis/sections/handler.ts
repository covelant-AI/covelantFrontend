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
          start: { time: startTime },
          end: { time: endTime },
          summary,
          strokes,
        } = sec;

        if (
          typeof startTime !== "number" ||
          typeof endTime !== "number"
        ) {
          throw new Error(`Invalid start/end format in section`);
        }

        // Extract summary data (fields are directly on VideoSection, not a separate model)
        const playerWonPoint = summary && typeof summary === "object" 
          ? mapPlayerWonPoint(summary.player_won_point) 
          : null;
        const rallySize = summary && typeof summary === "object" && typeof summary.rally_size === "number" 
          ? summary.rally_size 
          : 0;
        const validRally = summary && typeof summary === "object" && typeof summary.valid_rally === "boolean" 
          ? summary.valid_rally 
          : false;

        // Create VideoSection with summary fields directly on it
        const videoSection = await tx.videoSection.create({
          data: {
            matchId,
            startTime,
            endTime,
            playerWonPoint,
            rallySize,
            validRally,
          },
        });

        // Create Stroke records if provided
        if (Array.isArray(strokes)) {
          for (let order = 0; order < strokes.length; order++) {
            const stroke = strokes[order];
            
            // Extract start time (can be a number or an object with time property)
            let startTime: number | null = null;
            if (typeof stroke.start === "number") {
              startTime = stroke.start;
            } else if (stroke.start && typeof stroke.start === "object" && typeof stroke.start.time === "number") {
              startTime = stroke.start.time;
            }

            const playerHit = mapPlayerHit(stroke.player_hit);

            // Extract coordinates from arrays
            const topPlayerLocation = stroke.top_player_location;
            const bottomPlayerLocation = stroke.bottom_player_location;

            // Create Stroke record
            const strokeRecord = await tx.stroke.create({
              data: {
                videoSectionId: videoSection.id,
                strokeOrder: order,
                startTime,
                playerHit,
                topPlayerX: Array.isArray(topPlayerLocation) && topPlayerLocation.length >= 1 ? topPlayerLocation[0] : null,
                topPlayerY: Array.isArray(topPlayerLocation) && topPlayerLocation.length >= 2 ? topPlayerLocation[1] : null,
                bottomPlayerX: Array.isArray(bottomPlayerLocation) && bottomPlayerLocation.length >= 1 ? bottomPlayerLocation[0] : null,
                bottomPlayerY: Array.isArray(bottomPlayerLocation) && bottomPlayerLocation.length >= 2 ? bottomPlayerLocation[1] : null,
                ballSpeed: typeof stroke.ball_speed === "number" ? stroke.ball_speed : null,
              },
            });

            // Create Bounce record if bounce data exists
            if (stroke.bounce && stroke.bounce !== null) {
              const bounceLocation = stroke.bounce.location;
              const bounceStart = stroke.bounce.start;
              
              await tx.bounce.create({
                data: {
                  strokeId: strokeRecord.id,
                  locationX: Array.isArray(bounceLocation) && bounceLocation.length >= 1 ? bounceLocation[0] : null,
                  locationY: Array.isArray(bounceLocation) && bounceLocation.length >= 2 ? bounceLocation[1] : null,
                  state: stroke.bounce.state ? mapBounceState(stroke.bounce.state) : null,
                  startTime: bounceStart && typeof bounceStart === "object" && typeof bounceStart.time === "number" 
                    ? bounceStart.time 
                    : (typeof bounceStart === "number" ? bounceStart : null),
                },
              });
            }
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
