import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

function getRandomStatValue(): number {
  return Math.floor(Math.random() * 101); // 0 to 100
}

function getRandomResult(): "win" | "loss" | "draw" {
  const results = ["win", "loss", "draw"];
  return results[Math.floor(Math.random() * results.length)] as "win" | "loss" | "draw";
}

function getRandomType(): "tournament" | "friendly" | "training" | "league" {
  const types = ["tournament", "friendly", "training", "league"];
  return types[Math.floor(Math.random() * types.length)] as "tournament" | "friendly" | "training" | "league";
}

function getRandomCountry(): string {
  const countries = ["USA", "Japan", "Germany", "Brazil", "Kenya", "India", "France", "Canada"];
  return countries[Math.floor(Math.random() * countries.length)];
}

async function seedPlayerStats(playerId: number) {
  const statSubjects = ["SRV", "RSV", "FRH", "BCH", "RLY"];

  const statEntries = statSubjects.map((subject) => ({
    subject,
    value: getRandomStatValue(),
    playerId,
  }));

  await prisma.playerStat.createMany({
    data: statEntries,
  });
}


async function main() {
  // Upsert coaches and players as before
  const coach1 = await prisma.coach.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: "coach1@covelant.com",
      team: "team1",
      avatar: "/testImages/coach1.jpg",
      firstName: "Master",
      lastName: "Coach",
      players: {
        create: [
          {
            firstName: "Terminator",
            lastName: "genesis",
            email: "savejhonconnor@covelant.com",
            avatar: "/testImages/player1.jpg",
            winRate: 0.75,
          },
          {
            firstName: "Avatar",
            lastName: "Aang",
            email: "mycagabages@covelant.com",
            avatar: "/testImages/player2.jpg",
            winRate: 0.85,
          },
          {
            firstName: "darth",
            lastName: "vader",
            email: "iamyourfather@covelant.com",
            avatar: "/testImages/player3.jpg",
            winRate: 0.65,
          },
          {
            firstName: "aragorn",
            lastName: "son of arathorn",
            email: "forFrodo@covelant.com",
            avatar: "/testImages/test.jpg",
            winRate: 0.57,
          },
        ],
      },
    },
    include: { players: true },
  });

  const coach2 = await prisma.coach.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: "coach2@covelant.com",
      team: "team2",
      firstName: "Master",
      lastName: "Coach",
      avatar: "/testImages/test.jpg",
      players: {},
    },
  });
  
  const player1 = await prisma.player.upsert({
    where: { id: 5 },
    update: {},
    create: {
            firstName: "single",
            lastName: "player",
            email: "single@covelant.com",
            avatar: "/testImages/test.jpg",
            winRate: 0.50,
          },
  });

  // Extract players from coach1 for use
  const players = coach1.players;

  
  // 🌟 NEW: Seed stats for each player
  for (const player of players) {
    await seedPlayerStats(player.id);
  }

  // Utility: create or find opponent by name
  async function findOrCreateOpponent(firstName: string, lastName: string) {
    let opponent = await prisma.opponent.findFirst({
      where: { firstName, lastName },
    });
    if (!opponent) {
      opponent = await prisma.opponent.create({
        data: { firstName, lastName },
      });
    }
    return opponent;
  }

  // Video location constant
  const videoUrl = "/testVideo/test.mp4";
  const imageUrl = "/testImages/test.jpg";

  // Create a few matches with mixed opponents:
  // For each player create 4 matches:
  // - 2 vs other players
  // - 2 vs opponents (some known, some unknown)
  for (const player of players) {
    // Matches vs other players
    for (let i = 0; i < 2; i++) {
      // Pick an opponent player different from current
      const opponentPlayer =
        players.find((p) => p.id !== player.id) || players[0]; // fallback first player if none

      // Create a match
      const match = await prisma.match.create({
        data: {
          videoUrl,
          imageUrl,
          date: new Date(Date.now() - i * 1000 * 60 * 60 * 24), // spaced days
          videoType: getRandomType(),
          fieldType: getRandomCountry(),
        },
      });

      // Create PlayerMatch entries for both players, results opposite
      await prisma.playerMatch.createMany({
        data: [
          {
            matchId: match.id,
            playerId: player.id,
            result: "win",
          },
          {
            matchId: match.id,
            playerId: opponentPlayer.id,
            result: "loss",
          },
        ],
      });
    }

    // Matches vs opponents (known and unknown)
    const knownOpponentName = { firstName: "Known", lastName: "Opponent" };
    const unknownOpponentName = { firstName: "Unknown", lastName: "Opponent" };

    // Create known opponent in DB (once)
    const knownOpponent = await findOrCreateOpponent(
      knownOpponentName.firstName,
      knownOpponentName.lastName
    );

    // Create two matches vs opponents: one known, one unknown
    // Known opponent match
    const knownOpponentMatch = await prisma.match.create({
      data: {
        videoUrl,
        imageUrl,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        videoType: getRandomType(),
        fieldType: getRandomCountry(),
      },
    });

    await prisma.playerMatch.create({
      data: {
        matchId: knownOpponentMatch.id,
        playerId: player.id,
        result: "loss",
      },
    });

    await prisma.playerMatch.create({
      data: {
        matchId: knownOpponentMatch.id,
        opponentId: knownOpponent.id,
        result: "win",
      },
    });

    // Unknown opponent match
    const unknownOpponent = await findOrCreateOpponent(
      unknownOpponentName.firstName,
      unknownOpponentName.lastName
    );

    const unknownOpponentMatch = await prisma.match.create({
      data: {
        videoUrl,
        imageUrl,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        videoType: getRandomType(),
        fieldType: getRandomCountry(),
      },
    });

    await prisma.playerMatch.create({
      data: {
        matchId: unknownOpponentMatch.id,
        playerId: player.id,
        result: "win",
      },
    });

    await prisma.playerMatch.create({
      data: {
        matchId: unknownOpponentMatch.id,
        opponentId: unknownOpponent.id,
        result: "loss",
      },
    });
  }

  console.log({ coach1, coach2, player1 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
