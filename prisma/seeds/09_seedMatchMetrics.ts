// prisma/seeds/09_matchMetrics.ts
import { PrismaClient, MetricType } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function seedMatchMetrics() {
  console.log("Seeding MatchMetrics…");
    let i = 0

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
    // Check if the values are valid numbers before adding to rows
    if (!isNaN(ballSpeed) && isFinite(ballSpeed)) {
      rows.push({
        metricType: MetricType.BALL_SPEED,
        value: parseFloat(ballSpeed.toFixed(1)),
        eventTimeSeconds: time,
      });
    }

    if (!isNaN(playerSpeed) && isFinite(playerSpeed)) {
      rows.push({
        metricType: MetricType.PLAYER_SPEED,
        value: parseFloat(playerSpeed.toFixed(1)),
        eventTimeSeconds: time,
      });
    }

    if (!isNaN(longestRally) && isFinite(longestRally)) {
      rows.push({
        metricType: MetricType.LONGEST_RALLY,
        value: parseFloat(longestRally.toFixed(1)),
        eventTimeSeconds: time,
      });
    }

    if (!isNaN(strikesEff) && isFinite(strikesEff)) {
      rows.push({
        metricType: MetricType.STRIKES_EFF,
        value: parseFloat(strikesEff.toFixed(1)),
        eventTimeSeconds: time,
      });
    }
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
      { time: 10, ballSpeed: 183.4, playerSpeed: 0.2, longestRally: 1, strikesEff: 0}, 
      { time: 11, ballSpeed: 132.1, playerSpeed: 1.2, longestRally: 2, strikesEff: 67.9 }, 
      { time: 12, ballSpeed: 149.6, playerSpeed: 1.8, longestRally: 3, strikesEff: 58.2 }, 
      { time: 14, ballSpeed: 128.3, playerSpeed: 0.6, longestRally: 4, strikesEff: 49.8 }, 
      { time: 15, ballSpeed: 134.5, playerSpeed: 1.2, longestRally: 5, strikesEff: 62.4 }, 
      { time: 17, ballSpeed: 142.2, playerSpeed: 0.8, longestRally: 6, strikesEff: 66.2  }, 
      { time: 18, ballSpeed: 135, playerSpeed: 3.6, longestRally: 7, strikesEff:  52.7}, 
      { time: 19, ballSpeed: 144.7, playerSpeed: 0.5, longestRally: 8, strikesEff: 74.5  }, 
      { time: 21, ballSpeed: 153.1, playerSpeed: 3.3, longestRally: 9, strikesEff: 58.9 }, 
      { time: 22, ballSpeed: 144.2, playerSpeed: 0.8, longestRally: 10, strikesEff: 65.7 },
      { time: 24, ballSpeed: 153.4, playerSpeed: 6.2, longestRally: 11, strikesEff: 42.1}, 
      { time: 25, ballSpeed: 142.7, playerSpeed: 1.4, longestRally: 12, strikesEff: 81.9 }, 
      { time: 26, ballSpeed: 129.6, playerSpeed: 1.2, longestRally: 13, strikesEff: 53 }, 
      { time: 28, ballSpeed: 118.3, playerSpeed: 0.9, longestRally: 14, strikesEff: 42.8 }, 
      { time: 29, ballSpeed: 144.5, playerSpeed: 1.2, longestRally: 15, strikesEff: 77.4 }, 
      { time: 31, ballSpeed: 144.2, playerSpeed: 1.5, longestRally: 16, strikesEff: 88.2  }, 
      { time: 32, ballSpeed: 153, playerSpeed: 1.5, longestRally: 17, strikesEff: 73 }, 
      { time: 33, ballSpeed: 134.7, playerSpeed: 0.4, longestRally: 18, strikesEff: 84.5  }, 
      { time: 35, ballSpeed: 143.1, playerSpeed: 0.4, longestRally: 19, strikesEff: 83.9 }, 
      { time: 36, ballSpeed: 146.2, playerSpeed: 0.4, longestRally: 20, strikesEff: 77.7 },
      { time: 37, ballSpeed: 133.4, playerSpeed: 1.2, longestRally: 21, strikesEff: 71}, 
      { time: 39, ballSpeed: 143, playerSpeed: 1.4, longestRally: 22, strikesEff: 96.9 }, 
      { time: 41, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 42, ballSpeed: 168.3, playerSpeed: 0.1, longestRally: 1, strikesEff: 62.8 }, 
      { time: 43, ballSpeed: 148.7, playerSpeed: 1.2, longestRally: 2, strikesEff: 57.4 }, 
      { time: 44, ballSpeed: 132.2, playerSpeed: 1.3, longestRally: 3, strikesEff: 59.2  }, 
      { time: 46, ballSpeed: 163, playerSpeed: 0.3, longestRally: 4, strikesEff: 7 }, 
      { time: 50, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0  }, 
      { time: 52, ballSpeed: 193.1, playerSpeed: 0.3, longestRally: 1, strikesEff: 48.9 }, 
      { time: 54, ballSpeed: 156.2, playerSpeed: 1.4, longestRally: 2, strikesEff: 75.7 },
      { time: 55, ballSpeed: 133.3, playerSpeed: 0.2, longestRally: 3, strikesEff: 92.8 }, 
      { time: 58, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 62, ballSpeed: 172.2, playerSpeed: 0.3, longestRally: 1, strikesEff: 59.2  },
      { time: 63, ballSpeed: 148.3, playerSpeed: 2.1, longestRally: 2, strikesEff: 62.8 }, 
      { time: 64, ballSpeed: 142.7, playerSpeed: 0.8, longestRally: 3, strikesEff: 57.4 }, 
      { time: 65, ballSpeed: 162.2, playerSpeed: 7.3, longestRally: 4, strikesEff: 59.2  }, 
      { time: 67, ballSpeed: 158.3, playerSpeed: 5.1, longestRally: 5, strikesEff: 32.8 }, 
      { time: 68, ballSpeed: 133.7, playerSpeed: 6.2, longestRally: 6, strikesEff: 17.4 }, 
      { time: 69, ballSpeed: 172, playerSpeed: 1.3, longestRally: 7, strikesEff: 2  }, 
      { time: 79, ballSpeed: 201.3, playerSpeed: 3.4, longestRally: 1, strikesEff: 32.8 }, 
      { time: 80, ballSpeed: 108.7, playerSpeed: 1.2, longestRally: 2, strikesEff: 27.4 }, 
      { time: 82, ballSpeed: 172.2, playerSpeed: 2.3, longestRally: 3, strikesEff: 32.2  },
      { time: 83, ballSpeed: 153.4, playerSpeed: 1.3, longestRally: 4, strikesEff: 35}, 
      { time: 84, ballSpeed: 172.1, playerSpeed: 7.2, longestRally: 5, strikesEff: 27.9 }, 
      { time: 86, ballSpeed: 129.6, playerSpeed: 1.8, longestRally: 6, strikesEff: 38.2 }, 
      { time: 87, ballSpeed: 158.3, playerSpeed: 7.6, longestRally: 7, strikesEff: 32.8 }, 
      { time: 88, ballSpeed: 144.5, playerSpeed: 1.2, longestRally: 8, strikesEff: 39.4 }, 
      { time: 90, ballSpeed: 152.2, playerSpeed: 1.1, longestRally: 9, strikesEff: 29.2  },
      { time: 91, ballSpeed: 153.4, playerSpeed: 0.2, longestRally: 10, strikesEff: 35}, 
      { time: 93, ballSpeed: 152.1, playerSpeed: 2.2, longestRally: 11, strikesEff: 27.9 }, 
      { time: 94, ballSpeed: 159.6, playerSpeed: 1.1, longestRally: 12, strikesEff: 48.2 }, 
      { time: 95, ballSpeed: 158.3, playerSpeed: 2.6, longestRally: 13, strikesEff: 39.8 }, 
      { time: 96, ballSpeed: 134.5, playerSpeed: 1.2, longestRally: 14, strikesEff: 42.4 }, 
      { time: 98, ballSpeed: 152.2, playerSpeed: 1.4, longestRally: 15, strikesEff: 37.2  },
      { time: 99, ballSpeed: 157.4, playerSpeed: 0.7, longestRally: 16, strikesEff: 31}, 
      { time: 100, ballSpeed: 162.1, playerSpeed: 4.2, longestRally: 17, strikesEff: 7.9 }, 
      { time: 102, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 104, ballSpeed: 197.3, playerSpeed: 0.9, longestRally: 1, strikesEff: 39.8 }, 
      { time: 105, ballSpeed: 164.5, playerSpeed: 1.2, longestRally: 2, strikesEff: 11.4 }, 
      { time: 106, ballSpeed: 176.2, playerSpeed: 2.8, longestRally: 3, strikesEff: 8.2  },
      { time: 110, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0}, 
      { time: 111, ballSpeed: 198.1, playerSpeed: 0.2, longestRally: 1, strikesEff: 67.9 }, 
      { time: 112, ballSpeed: 179.6, playerSpeed: 4.8, longestRally: 2, strikesEff: 88.2 }, 
      { time: 114, ballSpeed: 134.7, playerSpeed: 2.6, longestRally: 3, strikesEff: 98.8 }, 
      { time: 119, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 120, ballSpeed: 142.2, playerSpeed: 0.8, longestRally: 6, strikesEff: 66.2  },
      { time: 121, ballSpeed: 183.4, playerSpeed: 0.2, longestRally: 1, strikesEff: 42.4}, 
      { time: 122, ballSpeed: 139.1, playerSpeed: 1.2, longestRally: 2, strikesEff: 47.9 }, 
      { time: 124, ballSpeed: 142.6, playerSpeed: 0.8, longestRally: 3, strikesEff: 48.2 }, 
      { time: 125, ballSpeed: 158.3, playerSpeed: 5.6, longestRally: 4, strikesEff: 39.8 }, 
      { time: 126, ballSpeed: 144.5, playerSpeed: 1.2, longestRally: 5, strikesEff: 42.4 }, 
      { time: 128, ballSpeed: 122.2, playerSpeed: 4.8, longestRally: 6, strikesEff: 46.2  },
      { time: 129, ballSpeed: 152.2, playerSpeed: 1.8, longestRally: 7, strikesEff: 57.4  },
      { time: 131, ballSpeed: 155.4, playerSpeed: 5.2, longestRally: 8, strikesEff: 62.4}, 
      { time: 133, ballSpeed: 159.1, playerSpeed: 4.2, longestRally: 9, strikesEff: 47.9 }, 
      { time: 135, ballSpeed: 149.6, playerSpeed: 1.8, longestRally: 10, strikesEff: 28.2 }, 
      { time: 136, ballSpeed: 158.3, playerSpeed: 5.6, longestRally: 11, strikesEff: 24.8 }, 
      { time: 138, ballSpeed: 144.5, playerSpeed: 1.2, longestRally: 12, strikesEff: 38.4 },
      { time: 140, ballSpeed: 148.2, playerSpeed: 7.8, longestRally: 13, strikesEff: 26.2  },
      { time: 141, ballSpeed: 153.4, playerSpeed: 6.2, longestRally: 14, strikesEff: 22.4}, 
      { time: 142, ballSpeed: 158.1, playerSpeed: 7.2, longestRally: 15, strikesEff: 17.9 }, 
      { time: 144, ballSpeed: 155.6, playerSpeed: 5.8, longestRally: 16, strikesEff: 28.2 }, 
      { time: 145, ballSpeed: 148.3, playerSpeed: 8.6, longestRally: 17, strikesEff: 9.8 }, 
      { time: 149, ballSpeed: 88, playerSpeed: 9.2, longestRally: 18, strikesEff: 6.4 }, 
      { time: 151, ballSpeed: 70.2, playerSpeed: 7.8, longestRally: 19, strikesEff: 10.2  },
      { time: 152, ballSpeed: 99.2, playerSpeed: 5.8, longestRally: 20, strikesEff: 15.5  },
      { time: 153, ballSpeed: 120.4, playerSpeed: 2.2, longestRally: 21, strikesEff: 20.4}, 
      { time: 154, ballSpeed: 139.1, playerSpeed: 1.2, longestRally: 22, strikesEff: 17.9 }, 
      { time: 155, ballSpeed: 32.6, playerSpeed: 0.8, longestRally: 23, strikesEff: 28.2 }, 
      { time: 157, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 },
      { time: 160, ballSpeed: 188, playerSpeed: 0.2, longestRally: 1, strikesEff: 56.4 }, 
      { time: 161, ballSpeed: 160.2, playerSpeed: 2.8, longestRally: 2, strikesEff: 52.2  },
      { time: 163, ballSpeed: 172.2, playerSpeed: 1.8, longestRally: 3, strikesEff: 52.5  },
      { time: 164, ballSpeed: 160.4, playerSpeed: 3.2, longestRally: 4, strikesEff: 52.1}, 
      { time: 156, ballSpeed: 159.1, playerSpeed: 1.2, longestRally: 5, strikesEff: 41.9 }, 
      { time: 157, ballSpeed: 171.6, playerSpeed: 9.8, longestRally: 6, strikesEff: 24.2 }, 
      { time: 159, ballSpeed: 122.5, playerSpeed: 11.2, longestRally: 7, strikesEff: 16.4 }, 
      { time: 161, ballSpeed: 188.2, playerSpeed: 9.8, longestRally: 8, strikesEff: 1.2  },
      { time: 162, ballSpeed: 176.2, playerSpeed: 12.8, longestRally: 9, strikesEff: 0 },
      { time: 165, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0},         
    ],
              [
      { time: 18, ballSpeed: 202.4, playerSpeed: 0.1, longestRally: 1, strikesEff: 12.4}, 
      { time: 19, ballSpeed: 166.2, playerSpeed: 0.1, longestRally: 2, strikesEff: 5.2}, 
      { time: 19, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0}, 
      { time: 31, ballSpeed: 182.3, playerSpeed: 0.2, longestRally: 1, strikesEff: 81.9 }, 
      { time: 33, ballSpeed: 82.4, playerSpeed: 0.6, longestRally: 2, strikesEff: 63 }, 
      { time: 46, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 59, ballSpeed: 209.2, playerSpeed: 0.2, longestRally: 1, strikesEff: 66.4 }, 
      { time: 61, ballSpeed: 142.4, playerSpeed: 1.8, longestRally: 2, strikesEff: 81.4  }, 
      { time: 63, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 }, 
      { time: 84, ballSpeed: 211.7, playerSpeed: 0.1, longestRally: 1, strikesEff: 14.5  }, 
      { time: 86, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0},
      { time: 94, ballSpeed: 178.1, playerSpeed: 0.3, longestRally: 1, strikesEff: 75.9 }, 
      { time: 95, ballSpeed: 122.1, playerSpeed: 4.9, longestRally: 2, strikesEff: 79.1 }, 
      { time: 96, ballSpeed: 141.2, playerSpeed: 2.4, longestRally: 3, strikesEff: 92.7 },
      { time: 98, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 },
      { time: 127, ballSpeed: 197.3, playerSpeed: 0.2, longestRally: 1, strikesEff: 12.8 },
      { time: 129, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 },
      { time: 137, ballSpeed: 177.7, playerSpeed: 0.1, longestRally: 1, strikesEff: 88.5 },
      { time: 138, ballSpeed: 147.9, playerSpeed: 7.6, longestRally: 2, strikesEff: 68.5 },
      { time: 139, ballSpeed: 151.6, playerSpeed: 4.7, longestRally: 3, strikesEff: 9.1 },
      { time: 141, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 },
      { time: 170, ballSpeed: 199.9, playerSpeed: 0.3, longestRally: 1, strikesEff: 88.1 },
      { time: 171, ballSpeed: 142.8, playerSpeed: 3.2, longestRally: 2, strikesEff: 76.2 },
      { time: 173, ballSpeed: 151.7, playerSpeed: 1.5, longestRally: 3, strikesEff: 66.2 },
      { time: 175, ballSpeed: 131.7, playerSpeed: 1.7, longestRally: 4, strikesEff: 31.7 },
      { time: 176, ballSpeed: 182.4, playerSpeed: 2.0, longestRally: 5, strikesEff: 1.7 },
      { time: 179, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 0 },
      { time: 210, ballSpeed: 214.6, playerSpeed: 0.5, longestRally: 1, strikesEff: 82.7 },
      { time: 211, ballSpeed: 166.5, playerSpeed: 5.8, longestRally: 2, strikesEff: 85.2 },
      { time: 213, ballSpeed: 188.2, playerSpeed: 2.8, longestRally: 3, strikesEff: 92.5 },
      { time: 215, ballSpeed: 145.1, playerSpeed: 3.1, longestRally: 4, strikesEff: 94.5 },
      { time: 217, ballSpeed: 168.4, playerSpeed: 1.3, longestRally: 5, strikesEff: 97.5 },
      { time: 218, ballSpeed: 133.3, playerSpeed: 4.8, longestRally: 6, strikesEff: 96.7 },
      { time: 220, ballSpeed: 179.0, playerSpeed: 1.8, longestRally: 7, strikesEff: 99.5 },
      { time: 222, ballSpeed: 169.6, playerSpeed: 7.8, longestRally: 8, strikesEff: 99.4 },
      { time: 223, ballSpeed: 0, playerSpeed: 0, longestRally: 0, strikesEff: 100 },
    ]
  ]

    const intervals = intervalsArray[i]

    if (!intervals) {
      console.warn(`No milestone array for match index ${i} — skipping.`);
      break;
    }


    // Use the intervals to set speeds
    pushMetrics(intervals);
    i= i+1
    for (const row of rows) {
    await prisma.matchMetric.create({
      data: {
        matchId,
        playerId: row.playerId ?? null,
        metricType: row.metricType,
        value: !isNaN(row.value) && isFinite(row.value) ? row.value : 0,  // Handle invalid values
        eventTimeSeconds: row.eventTimeSeconds,
      },
    });

  }
    console.log(
      `✔️  Seeded ${rows.length} MatchMetric rows for match ${matchId}`
    );
  }
  console.log("🎾 MatchMetric seeding complete.");
}
