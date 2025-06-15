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
  let i = 0

    // new function to push all metric types
    function pushMetrics(
      intervals: {
        time: number;
        ballSpeed: number;
        playerSpeed: number;
        longestRally: number;
        strikesEff: number;
      }[]
    ) {
      for (const { time, ballSpeed, playerSpeed, longestRally, strikesEff } of intervals) {
        rows.push({
          metricType: MetricType.BALL_SPEED,
          value: parseFloat(ballSpeed.toFixed(1)),
          eventTimeSeconds: time,
        });
      
        rows.push({
          metricType: MetricType.PLAYER_SPEED,
          value: parseFloat(playerSpeed.toFixed(1)),
          eventTimeSeconds: time,
        });
      
        rows.push({
          metricType: MetricType.LONGEST_RALLY,
          value: parseFloat(longestRally.toFixed(1)),
          eventTimeSeconds: time,
        });
      
        rows.push({
          metricType: MetricType.STRIKES_EFF,
          value: parseFloat(strikesEff.toFixed(1)),
          eventTimeSeconds: time,
        });
      }
    }

        // Example intervals with manual values for ball speed and player speed
    const intervalsArray = [[
      { time: 6, ballSpeed: 193.4, playerSpeed: 0.2, longestRally: 1, strikesEff: 70}, 
      { time: 7, ballSpeed: 32.7, playerSpeed: 1.4, longestRally: 2, strikesEff: 81.9 }, 
      { time: 8, ballSpeed: 29.6, playerSpeed: 12, longestRally: 2, strikesEff: 63 }, 
      { time: 9, ballSpeed: 68.3, playerSpeed: 4, longestRally: 2, strikesEff: 42.8 }, 
      { time: 10, ballSpeed: 88.7, playerSpeed: 3.2, longestRally: 3, strikesEff: 77.4 }, 
      { time: 11, ballSpeed: 72.2, playerSpeed: 7.3, longestRally: 4, strikesEff: 1.2  }, 
      { time: 13, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 30, ballSpeed: 184.7, playerSpeed: 0.1, longestRally: 1, strikesEff: 74.5  }, 
      { time: 31, ballSpeed: 43.1, playerSpeed: 4.3, longestRally: 2, strikesEff: 88.9 }, 
      { time: 33, ballSpeed: 86.2, playerSpeed: 2.4, longestRally: 3, strikesEff: 55.7 }, 
      { time: 34, ballSpeed: 51.5, playerSpeed: 9.7, longestRally: 4, strikesEff: 40.3 }, 
      { time: 37, ballSpeed: 88.4, playerSpeed: 2.1, longestRally: 5, strikesEff: 57.1 }, 
      { time: 40, ballSpeed: 68.7, playerSpeed: 0.8, longestRally: 5, strikesEff: 49.6 }, 
      { time: 41, ballSpeed: 178.2, playerSpeed: 8.9, longestRally: 6, strikesEff: 22.7 }, 
      { time: 42, ballSpeed: 115.1, playerSpeed: 4.4, longestRally: 7, strikesEff: 27.4 }, 
      { time: 43, ballSpeed: 88.4, playerSpeed: 6.9, longestRally: 8, strikesEff: 12.2 }, 
      { time: 44, ballSpeed: 42.1, playerSpeed: 13.1, longestRally: 9, strikesEff: 2.2 },
      { time: 46, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0  },  
      { time: 70, ballSpeed: 175, playerSpeed: 0.2, longestRally: 1, strikesEff: 77.5  }, 
      { time: 72, ballSpeed: 39.2, playerSpeed: 8.4, longestRally: 2, strikesEff: 75.2  }, 
      { time: 74, ballSpeed: 53.1, playerSpeed: 2.1, longestRally: 3, strikesEff: 88.9  }, 
      { time: 75, ballSpeed: 77, playerSpeed: 8.4, longestRally: 4, strikesEff: 42.7  },
      { time: 77, ballSpeed: 61.2, playerSpeed: 6.6, longestRally: 5, strikesEff: 91.5  },
      { time: 79, ballSpeed: 28.1, playerSpeed: 10.2, longestRally: 5, strikesEff: 97.9  },
      { time: 80, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0  }, 
      { time: 106, ballSpeed: 195.1, playerSpeed: 0.2, longestRally: 1, strikesEff: 82.7  }, 
      { time: 107, ballSpeed: 142.5, playerSpeed: 0.3, longestRally: 2, strikesEff: 79.2  }, 
      { time: 108, ballSpeed: 88.4, playerSpeed: 0.6, longestRally: 3, strikesEff: 77.4  }, 
      { time: 109, ballSpeed: 45.1, playerSpeed: 4.7, longestRally: 4, strikesEff: 78.5  }, 
      { time: 110, ballSpeed: 83.3, playerSpeed: 1.2, longestRally: 5, strikesEff: 75.2  }, 
      { time: 111, ballSpeed: 22.3, playerSpeed: 8.7, longestRally: 6, strikesEff: 81.3  }, 
      { time: 113, ballSpeed: 66.9, playerSpeed: 6.6, longestRally: 7, strikesEff: 89.3  }, 
      { time: 116, ballSpeed: 111.3, playerSpeed: 1.2, longestRally: 8, strikesEff: 33.3  }, 
      { time: 117, ballSpeed: 47.9, playerSpeed: 0.8, longestRally: 9, strikesEff: 97.9  },
      { time: 119, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0  }, 
    ],
    [
      { time: 1, ballSpeed: 193.4, playerSpeed: 0.2, longestRally: 1, strikesEff: 70}, 
      { time: 2, ballSpeed: 32.7, playerSpeed: 1.4, longestRally: 2, strikesEff: 81.9 }, 
      { time: 3, ballSpeed: 29.6, playerSpeed: 12, longestRally: 2, strikesEff: 63 }, 
      { time: 4, ballSpeed: 68.3, playerSpeed: 4, longestRally: 2, strikesEff: 42.8 }, 
      { time: 5, ballSpeed: 88.7, playerSpeed: 3.2, longestRally: 3, strikesEff: 77.4 }, 
      { time: 6, ballSpeed: 72.2, playerSpeed: 7.3, longestRally: 4, strikesEff: 1.2  }, 
      { time: 6, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 30, ballSpeed: 184.7, playerSpeed: 0.1, longestRally: 1, strikesEff: 74.5  }, 
      { time: 31, ballSpeed: 43.1, playerSpeed: 4.3, longestRally: 2, strikesEff: 88.9 }, 
      { time: 33, ballSpeed: 86.2, playerSpeed: 2.4, longestRally: 3, strikesEff: 55.7 },
    ],
    [
      { time: 49, ballSpeed: 193.4, playerSpeed: 0.2, longestRally: 1, strikesEff: 70}, 
      { time: 48, ballSpeed: 32.7, playerSpeed: 1.4, longestRally: 2, strikesEff: 81.9 }, 
      { time: 47, ballSpeed: 29.6, playerSpeed: 12, longestRally: 2, strikesEff: 63 }, 
      { time: 46, ballSpeed: 68.3, playerSpeed: 4, longestRally: 2, strikesEff: 42.8 }, 
      { time: 40, ballSpeed: 88.7, playerSpeed: 3.2, longestRally: 3, strikesEff: 77.4 }, 
      { time: 41, ballSpeed: 72.2, playerSpeed: 7.3, longestRally: 4, strikesEff: 1.2  }, 
      { time: 43, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 40, ballSpeed: 184.7, playerSpeed: 0.1, longestRally: 1, strikesEff: 74.5  }, 
      { time: 41, ballSpeed: 43.1, playerSpeed: 4.3, longestRally: 2, strikesEff: 88.9 }, 
      { time: 43, ballSpeed: 86.2, playerSpeed: 2.4, longestRally: 3, strikesEff: 55.7 },
    ]
  
  ]

    const intervals = intervalsArray[i]

    if (!intervals) {
      console.warn(`No milestone array for match index ${i} — skipping.`);
      break;
    }


    // Use the intervals to set speeds
    pushMetrics(intervals);

    for (const row of rows) {
    await prisma.matchMetric.create({
      data: {
        matchId,
        playerId: row.playerId ?? null,
        metricType: row.metricType,
        value: row.value,
        eventTimeSeconds: row.eventTimeSeconds,
      },
    });
    i++
  }



    console.log(
      `✔️  Seeded ${rows.length} MatchMetric rows for match ${matchId}`
    );
  }

  console.log("🎾 MatchMetric seeding complete.");
}
