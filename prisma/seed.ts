import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

function getRandomStatValue(): number {
  return Math.floor(Math.random() * 101); // 0 to 100
}

function getRandomResult(): "win" | "loss" | "draw" {
  const results = ["win", "loss", "draw"];
  return results[Math.floor(Math.random() * results.length)] as
    | "win"
    | "loss"
    | "draw";
}

function getRandomType(): "tournament" | "friendly" | "training" | "league" {
  const types = ["tournament", "friendly", "training", "league"];
  return types[
    Math.floor(Math.random() * types.length)
  ] as "tournament" | "friendly" | "training" | "league";
}

function getRandomCountry(): string {
  const countries = [
    "USA",
    "Japan",
    "Germany",
    "Brazil",
    "Kenya",
    "India",
    "France",
    "Canada",
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

async function seedPlayerStats(playerId: number) {
  const statSubjects = ["SRV", "RSV", "FRH", "BCH", "RLY"];
  const statEntries = statSubjects.map((subject) => ({
    subject,
    value: getRandomStatValue(),
    playerId,
  }));
  await prisma.playerStat.createMany({ data: statEntries });
}

async function main() {
  // Upsert coaches and their players
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
      firstName: "Lonely",
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
      winRate: 0.5,
    },
  });

  const players = coach1.players;

  // Seed stats for each player
  for (const p of players) {
    await seedPlayerStats(p.id);
  }

  // Helper: find or create an opponent
  async function findOrCreateOpponent(firstName: string, lastName: string) {
    let opp = await prisma.opponent.findFirst({
      where: { firstName, lastName },
    });
    if (!opp) {
      opp = await prisma.opponent.create({
        data: { firstName, lastName },
      });
    }
    return opp;
  }

  const videoUrl = "/testVideo/test.mp4";
  const imageUrl = "/testImages/test.jpg";

  // Create matches:
  //  • 2 vs players (each match => two rows with playerId+playerTwoId)
  //  • 1 vs a known opponent
  //  • 1 vs an unknown opponent
  for (const player of players) {
    // --- Player vs Player ---
    for (let i = 0; i < 2; i++) {
      const opponentPlayer =
        players.find((p) => p.id !== player.id) || players[0];

      const match = await prisma.match.create({
        data: {
          videoUrl,
          imageUrl,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          videoType: getRandomType(),
          fieldType: getRandomCountry(),
        },
      });

      await prisma.playerMatch.createMany({
        data: [
          {
            matchId: match.id,
            playerId: player.id,
            playerTwoId: opponentPlayer.id,
            result: getRandomResult(),
          },
          {
            matchId: match.id,
            playerId: opponentPlayer.id,
            playerTwoId: player.id,
            result: getRandomResult(),
          },
        ],
      });
    }

    // --- Player vs Known Opponent ---
    const knownOpponent = await findOrCreateOpponent(
      "Known",
      "Opponent"
    );
    const knownMatch = await prisma.match.create({
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
        matchId: knownMatch.id,
        playerId: player.id,
        opponentId: knownOpponent.id,
        result: getRandomResult(),
      },
    });

    // --- Player vs Unknown Opponent ---
    const unknownOpponent = await findOrCreateOpponent(
      "Unknown",
      "Opponent"
    );
    const unknownMatch = await prisma.match.create({
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
        matchId: unknownMatch.id,
        playerId: player.id,
        opponentId: unknownOpponent.id,
        result: getRandomResult(),
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
