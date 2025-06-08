import { seedCoaches } from './seeds/01_coaches';
import { seedPlayerData } from './seeds/02_players';
import { findOrCreateOpponent } from './seeds/03_opponents';
import { seedPlayerStats } from './seeds/04_stats';
import { createMatch } from './seeds/05_matches';
import { seedOverallStats } from './seeds/06_overallStats';
import { seedMatchEvents } from './seeds/07_matchEvents'
import { seedScorePoints } from './seeds/08_scorePoints'

async function main() {
  console.log("Seeding database...");

  // Seed Coaches and Players
  const { coach1, coach2 } = await seedCoaches();
  const player1 = await seedPlayerData();

  // Seed Stats and Overall Stats for coach1 players
  const players = coach1.players;
  for (const p of players) {
    await seedPlayerStats(p.id);
    await seedOverallStats(p.id);
  }

  // Seed Matches for Player1 and opponents
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/videos%2Fvideoplayback%20(25).mp4?alt=media&token=41090c42-db4e-491e-8135-98835e45c160";
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/thumbnails%2Fundefined_1749246733891_videoplayback%20(25).mp4?alt=media&token=8ff9b209-3ad3-4d77-85bf-dab5c8c585fe";

  for (const player of players) {
    const opponentPlayer = players.find((p) => p.id !== player.id) || players[0];
    await createMatch(player, opponentPlayer, videoUrl, imageUrl);
  }

  // Seed Opponents and Matches for Player1
  const knownOpponent = await findOrCreateOpponent("Master", "Opponent");
  await createMatch(player1, knownOpponent, videoUrl, imageUrl);

  // ←–– Finally, call the MatchEvent seeder
  await seedMatchEvents();

  await seedScorePoints();

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
