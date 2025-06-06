import { seedCoaches } from './01_coaches';
import { seedPlayerData } from './02_players';
import { findOrCreateOpponent } from './03_opponents';
import { seedPlayerStats } from './04_stats';
import { createMatch } from './05_matches';
import { seedOverallStats } from './06_overallStats';
import { PrismaClient } from "../../generated/prisma";


const prisma = new PrismaClient();

async function main() {
  // Seed Coaches and Players
  const { coach1, coach2 } = await seedCoaches();
  const player1 = await seedPlayerData();

  // Seed Stats and Overall Stats
  const players = coach1.players; // Assumes coach1 has players
  for (const p of players) {
    await seedPlayerStats(p.id);
    await seedOverallStats(p.id);
  }

  // Seed Matches for Player1
  const videoUrl = "/testVideo/test.mp4";
  const imageUrl = "/testImages/test.jpg";

  for (const player of players) {
    const opponentPlayer = players.find((p) => p.id !== player.id) || players[0];
    await createMatch(player, opponentPlayer, videoUrl, imageUrl);
  }

  // Seed Opponents and Matches for Player1
  const knownOpponent = await findOrCreateOpponent("Master", "Opponent");
  await createMatch(player1, knownOpponent, videoUrl, imageUrl);

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
