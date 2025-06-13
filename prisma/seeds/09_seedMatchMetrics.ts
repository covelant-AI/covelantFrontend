// prisma/seeds/09_matchMetrics.ts
import { PrismaClient, MetricType } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function seedMatchMetrics() {
  console.log("Seeding MatchMetrics…");

  // 1) Fetch every match
  const matches = await prisma.match.findMany();
  if (matches.length === 0) {
    console.warn("No matches found—skipping MatchMetric seeding.");
    return;
  }

  for (const m of matches) {
    const matchId = m.id;

    const rows: Array<{
      metricType: MetricType;
      playerId?: number;
      value: number;
      eventTimeSeconds: number;
    }> = [];

    // helper to push ball & player speed at specific intervals with manual values
    function pushSpeeds(
      intervals: { time: number; ballSpeed: number; playerSpeed: number }[]
    ) {
      for (const interval of intervals) {
        const { time, ballSpeed, playerSpeed } = interval;

        rows.push({
          metricType: MetricType.BALL_SPEED,
          value: parseFloat(ballSpeed.toFixed(1)),
          eventTimeSeconds: time,
        });

        rows.push({
          metricType: MetricType.PLAYER_SPEED,
          playerId: undefined, // if you want per‐player, assign actual id
          value: parseFloat(playerSpeed.toFixed(1)),
          eventTimeSeconds: time,
        });
      }
    }

    // Example intervals with manual values for ball speed and player speed
    const intervals = [
      { time: 5, ballSpeed: 193.4, playerSpeed: 0.2 }, 
      { time: 7, ballSpeed: 32.7, playerSpeed: 1.4 }, 
      { time: 8, ballSpeed: 29.6, playerSpeed: 12 }, 
      { time: 9, ballSpeed: 68.3, playerSpeed: 4 }, 
      { time: 10, ballSpeed: 102.7, playerSpeed: 11.2 }, 
      { time: 12, ballSpeed: 43.2, playerSpeed: 4.3 }, 
      { time: 30, ballSpeed: 184.7, playerSpeed: 0.1 }, 
      { time: 32, ballSpeed: 43.1, playerSpeed: 4.3 }, 
      { time: 33, ballSpeed: 86.2, playerSpeed: 2.4 }, 
      { time: 34, ballSpeed: 51.5, playerSpeed: 9.7 }, 
      { time: 37, ballSpeed: 88.4, playerSpeed: 2.1 }, 
      { time: 40, ballSpeed: 68.7, playerSpeed: 0.8 }, 
      { time: 41, ballSpeed: 148.2, playerSpeed: 8.9}, 
      { time: 42, ballSpeed: 115.1, playerSpeed: 4.4}, 
      { time: 43, ballSpeed: 88.4, playerSpeed: 6.9}, 
      { time: 44, ballSpeed: 42.1, playerSpeed: 13.1}, 
      { time: 70, ballSpeed: 175, playerSpeed: 0.2 }, 
      { time: 72, ballSpeed: 39.2, playerSpeed: 8.4 }, 
      { time: 74, ballSpeed: 53.1, playerSpeed: 2.1 }, 
      { time: 75, ballSpeed: 77, playerSpeed: 8.4 },
      { time: 77, ballSpeed: 61.2, playerSpeed: 10.6 },
      { time: 79, ballSpeed: 28.1, playerSpeed: 10.2 },
      { time: 106, ballSpeed: 195.1, playerSpeed: 0.2 }, 
      { time: 107, ballSpeed: 142.5, playerSpeed: 0.3 }, 
      { time: 108, ballSpeed: 88.4, playerSpeed: 0.6 }, 
      { time: 109, ballSpeed: 45.1, playerSpeed: 4.7 }, 
      { time: 110, ballSpeed: 83.3, playerSpeed: 1.2 }, 
      { time: 111, ballSpeed: 22.3, playerSpeed: 7.7 }, 
      { time: 113, ballSpeed: 66.9, playerSpeed: 6.6 }, 
      { time: 116, ballSpeed: 111.3, playerSpeed: 1.2 }, 
      { time: 117, ballSpeed: 47.9, playerSpeed: 0.8 },
    ];

    // Use the intervals to set speeds
    pushSpeeds(intervals);

    // longest rally: constant 12s at beginning of each window
    [5, 30, 70, 105].forEach((t) => {
      rows.push({
        metricType: MetricType.LONGEST_RALLY,
        value: 12,
        eventTimeSeconds: t,
      });
    });

    // strikes efficiency: constant 5 hits/rally at the same points
    [5, 30, 70, 105].forEach((t) => {
      rows.push({
        metricType: MetricType.STRIKES_EFF,
        value: 5,
        eventTimeSeconds: t,
      });
    });

    // 3) Persist
    for (const r of rows) {
      await prisma.matchMetric.create({
        data: {
          matchId,
          playerId: r.playerId, // omit for ball/longest/strikes metrics
          metricType: r.metricType,
          value: r.value,
          eventTimeSeconds: r.eventTimeSeconds,
        },
      });
    }

    console.log(
      `✔️  Seeded ${rows.length} MatchMetric rows for match ${matchId}`
    );
  }

  console.log("🎾 MatchMetric seeding complete.");
}
