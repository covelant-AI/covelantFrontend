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

    // helper to push ball & player speed every 2s in a given window
    function pushSpeeds(
      start: number,
      end: number,
      ballRange: [number, number],
      playerRange: [number, number]
    ) {
      for (let t = start; t <= end; t += 2) {
        // random between min/max
        const bs =
          ballRange[0] + Math.random() * (ballRange[1] - ballRange[0]);
        const ps =
          playerRange[0] + Math.random() * (playerRange[1] - playerRange[0]);
        rows.push({
          metricType: MetricType.BALL_SPEED,
          value: parseFloat(bs.toFixed(1)),
          eventTimeSeconds: t,
        });
        rows.push({
          metricType: MetricType.PLAYER_SPEED,
          playerId: undefined, // if you want per‐player, assign actual id
          value: parseFloat(ps.toFixed(1)),
          eventTimeSeconds: t,
        });
      }
    }

    // windows as specified
    pushSpeeds(5, 10, [120, 130], [5, 7]);
    pushSpeeds(30, 45, [110, 125], [8, 10]);   // player higher at ~40s
    pushSpeeds(70, 89, [115, 135], [5, 7]);
    pushSpeeds(105, 117, [120, 140], [5, 7]);

    // longest rally: constant 12s at beginning of each window
    [5, 30, 70, 105].forEach((t) => {
      rows.push({
        metricType: MetricType.LONGEST_RALLY,
        value: 12,
        eventTimeSeconds: t,
      });
    });

    // strikes efficiency: constant 5 hits/rally at same points
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
