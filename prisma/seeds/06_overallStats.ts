import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAvgDuration(): number {
  return parseFloat((Math.random() * (60 - 10) + 10).toFixed(2));
}

export async function seedOverallStats(playerId: number) {
  await prisma.overallStats.upsert({
    where: { playerId },
    update: {
      wins: getRandomInt(0, 20),
      losses: getRandomInt(0, 20),
      setsWon: getRandomInt(0, 60),
      setsLost: getRandomInt(0, 60),
      totalMatches: getRandomInt(1, 40),
      avgMatchDuration: getRandomAvgDuration(),
    },
    create: {
      playerId,
      wins: getRandomInt(0, 20),
      losses: getRandomInt(0, 20),
      setsWon: getRandomInt(0, 60),
      setsLost: getRandomInt(0, 60),
      totalMatches: getRandomInt(1, 40),
      avgMatchDuration: getRandomAvgDuration(),
    },
  });
}