import { seedCoaches } from './seeds/01_coaches';
import { seedPlayerStats } from './seeds/04_stats';
import { createMatch } from './seeds/05_matches';
import { seedOverallStats } from './seeds/06_overallStats';
import { seedMatchEvents } from './seeds/07_matchEvents'
import { seedScorePoints } from './seeds/08_scorePoints'
import {seedMatchMetrics} from './seeds/09_seedMatchMetrics'
import { seedMatchSections } from './seeds/10_seedMatchSections';

async function main() {
  console.log("Seeding database...");

  // Seed Coaches and Players
  const { coach1 } = await seedCoaches();


  // Seed Stats and Overall Stats for coach1 players
  const players = coach1.players;

  for (const p of players) {
    await seedPlayerStats(p.id);
    await seedOverallStats(p.id);
  }

  // Seed Matches for Player1 and opponents
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/videos%2Fvideoplayback%20(25).mp4?alt=media&token=41090c42-db4e-491e-8135-98835e45c160";
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/thumbnails%2Fundefined_1749818684964_videoplayback%20(25).mp4?alt=media&token=fa84f8b2-68a6-4f67-aaa2-cf536f82a4d2";

  const michaelLlodra = players.find(p => p.firstName === "Michael" && p.lastName === "Llodra");
  const andyMurray = players.find(p => p.firstName === "Andy" && p.lastName === "Murray");
  const rafaelNadal = players.find(p => p.firstName === "Rafael" && p.lastName === "Nadals");


  if (michaelLlodra && andyMurray && rafaelNadal) {
    // Match 1: Michael Llodra & Andy Murray (Original match logic remains)
    await createMatch(
      michaelLlodra,
      andyMurray,
      videoUrl, 
      imageUrl  
    );

    // Match 2: Andy Murray & Rafael Nadal
    await createMatch(
      andyMurray,
      rafaelNadal,
      "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/videos%2FRafael%20Nadal%20v%20Andy%20Murray%20Highlights%20-%20Men's%20Semi%20Final%202014%20-%20Roland-Garros.mp4?alt=media&token=71d3c355-e12f-403b-9ba7-757ff272b622",
      "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/thumbnails%2FRaphael%20nadal%20%26%20andy%20murray%20thumbnail.png?alt=media&token=ce2e8694-3e61-485c-9045-fa9d2088f213"
    );

    // Match 3: Rafael Nadal & Michael Llodra
    await createMatch(
      rafaelNadal,
      michaelLlodra,
      "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/videos%2FRafa%20Nadal%20vs%20M%20Llodra%20-%20Madrid%202011%20Quarter%20Final%20Last%20game.mp4?alt=media&token=8332058d-3351-49a5-8581-298b7c13015a",
      "https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/thumbnails%2Fnad%20%26%20llodra%20thumbnail.png?alt=media&token=9e9f47e1-29c5-466a-a71e-c265390d829c"
    );
  } else {
    console.error("One or more players not found. Check player names.");
  }


  // // Seed Opponents and Matches for Player1
  // const knownOpponent = await findOrCreateOpponent("Master", "Opponent");
  // await createMatch(player1, knownOpponent, videoUrl, imageUrl);

  // ←–– Finally, call the MatchEvent seeder
  await seedMatchEvents();
  await seedScorePoints();
  await seedMatchMetrics();
  await seedMatchSections();

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
