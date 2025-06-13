// prisma/seeds/08_scorePoints.ts
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function seedScorePoints() {
  console.log("Seeding ScorePoints…");

  // 1) Fetch every match + its two participants
  const matches = await prisma.match.findMany({
    include: { playerMatches: true },
  });
  if (matches.length === 0) {
    console.warn("No matches found—skipping.");
    return;
  }

  for (const m of matches) {
    const matchId = m.id;

    // 2) Identify the two competitors
    const [pm] = m.playerMatches;
    if (!pm) continue;
    const p1 = pm.playerId
      ? { playerId: pm.playerId }
      : { opponentId: pm.opponentId! };
    const p2 = pm.playerTwoId
      ? { playerId: pm.playerTwoId }
      : pm.opponentId
      ? { opponentId: pm.opponentId }
      : null;
    if (!p2) {
      console.warn(`Match ${matchId} has no second participant—skipping.`);
      continue;
    }

    // 3) Milestones and their R-scores (matchPoint)
    const milestones = [
      { t: 5,   matchPoints: [30,  0]  },
      { t: 13,  matchPoints: [30, 15]  },
      { t: 46,  matchPoints: [30, 30]  },
      { t: 70,  matchPoints: [40, 40]  },
      { t: 80,  matchPoints: [50, 40]  },
      { t: 107, matchPoints: [ 0,  0]  },
    ];

    // 4) The fixed gamePoint values per set:
    const gamePoints = {
      1: [6, 4],  // set 1: p1=6, p2=4
      2: [5, 2],
      3: [6, 2]  
    };

    // 5) Build a flat list of rows to create
    type SeedRow = {
      setNumber: number;
      gamePoint: number;
      matchPoint: number;
      eventTimeSeconds: number;
      playerId?: number;
      opponentId?: number;
    };
    const rows: SeedRow[] = [];

    for (const { t, matchPoints } of milestones) {
      const [mp1, mp2] = matchPoints;

      // for each set (1 & 2), push p1 and p2 rows
      for (const setNum of [1, 2] as const) {
        const [gp1, gp2] = gamePoints[setNum];
        rows.push({
          ...p1,
          setNumber: setNum,
          gamePoint: gp1,
          matchPoint: mp1,
          eventTimeSeconds: t,
        });
        rows.push({
          ...p2,
          setNumber: setNum,
          gamePoint: gp2,
          matchPoint: mp2,
          eventTimeSeconds: t,
        });
      }
    }

    // 6) Persist to the database
    for (const row of rows) {
      await prisma.scorePoint.create({
        data: {
          matchId,
          ...row,
        },
      });
    }

    console.log(`✔️  Seeded ${rows.length} ScorePoint rows for match ${matchId}`);
  }

  console.log("🎾 ScorePoints seeding complete.");
}

