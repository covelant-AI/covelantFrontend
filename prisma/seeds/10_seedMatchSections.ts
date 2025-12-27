import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const rand = (min: number, max: number) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

const randPick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randBool = () => Math.random() > 0.5;

function generateAIFormattedSections(matchId: number, totalTime: number = 300) {
  const num = Math.floor(Math.random() * 6) + 5; // 5–10 sections
  const sections: Array<{
    matchId: number;
    startIndex: number;
    startTime: number;
    endIndex: number;
    endTime: number;
    summary: any;
    strokes: any;
  }> = [];

  const interval = totalTime / num;

  for (let i = 0; i < num; i++) {
    const startT = rand(i * interval, (i + 1) * interval - 5);
    const endT = startT + rand(4, 12);

    const summary = {
      player_won_point: randPick(["top", "bottom", null]),
      rally_size: Math.floor(Math.random() * 8) + 1,
      valid_rally: randBool(),
    };

    const strokeCount = Math.floor(Math.random() * 3) + 1;
    const strokes = Array.from({ length: strokeCount }, () => {
      const st = rand(startT, endT - 1);
      const bounceEnabled = randBool();
      return {
        start: st, // float, not an object
        player_hit: randPick(["top", "bottom"]),
        top_player_location: randBool()
          ? [rand(-10, 10), rand(5, 12)]
          : null,
        bottom_player_location: randBool()
          ? [rand(-10, 10), rand(-14, -5)]
          : null,
        bounce: bounceEnabled
          ? {
              location: [rand(-8, 8), rand(-12, 12)],
              state: randPick(["valid", "out_of_bounds", "net_hit"]),
              start: {
                index: Math.floor(st * 100 + 20),
                time: st + 0.4,
              },
            }
          : null,
        ball_speed: randBool() ? rand(40, 130) : null,
      };
    });

    sections.push({
      matchId,
      startIndex: i,
      startTime: startT,
      endIndex: i,
      endTime: endT,
      summary,
      strokes,
    });
  }

  return sections;
}

export async function seedMatchSections() {
  try {
    const matchIds = [1, 2, 3];

    for (const matchId of matchIds) {
      const sections = generateAIFormattedSections(matchId);

      for (const section of sections) {
        // Create VideoSection with required fields
        const playerWonPoint = section.summary?.player_won_point || null;
        const rallySize = section.summary?.rally_size || 1;
        const validRally = section.summary?.valid_rally ?? true;

        const videoSection = await prisma.videoSection.create({
          data: {
            matchId: section.matchId,
            startIndex: section.startIndex,
            startTime: section.startTime,
            endIndex: section.endIndex,
            endTime: section.endTime,
            playerWonPoint,
            rallySize,
            validRally,
          },
        });

        // Create Stroke records if strokes exist
        if (section.strokes && section.strokes.length > 0) {
          for (let i = 0; i < section.strokes.length; i++) {
            const stroke = section.strokes[i];
            const playerHit = stroke.player_hit || "top";

            // Create Stroke
            const strokeRecord = await prisma.stroke.create({
              data: {
                videoSectionId: videoSection.id,
                strokeOrder: i + 1,
                startTime: stroke.start ?? null,
                playerHit,
                topPlayerX: Array.isArray(stroke.top_player_location) && stroke.top_player_location.length >= 1
                  ? stroke.top_player_location[0]
                  : null,
                topPlayerY: Array.isArray(stroke.top_player_location) && stroke.top_player_location.length >= 2
                  ? stroke.top_player_location[1]
                  : null,
                bottomPlayerX: Array.isArray(stroke.bottom_player_location) && stroke.bottom_player_location.length >= 1
                  ? stroke.bottom_player_location[0]
                  : null,
                bottomPlayerY: Array.isArray(stroke.bottom_player_location) && stroke.bottom_player_location.length >= 2
                  ? stroke.bottom_player_location[1]
                  : null,
                ballSpeed: stroke.ball_speed ?? null,
              },
            });

            // Create Bounce if it exists
            if (stroke.bounce) {
              await prisma.bounce.create({
                data: {
                  strokeId: strokeRecord.id,
                  locationX: Array.isArray(stroke.bounce.location) && stroke.bounce.location.length >= 1
                    ? stroke.bounce.location[0]
                    : null,
                  locationY: Array.isArray(stroke.bounce.location) && stroke.bounce.location.length >= 2
                    ? stroke.bounce.location[1]
                    : null,
                  state: stroke.bounce.state || null,
                  startTime: stroke.bounce.start?.time ?? null,
                },
              });
            }
          }
        }
      }
    }

    console.log("🔥 VideoSection AI-format seed generation complete");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
