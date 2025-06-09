import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

function getRandomResult(): "win" | "loss" | "draw" {
  const results = ["win", "loss", "draw"];
  return results[Math.floor(Math.random() * results.length)] as
    | "win"
    | "loss"
}

function getRandomType(): "tournament" | "friendly" | "training" | "league" {
  const types = ["tournament", "friendly", "training", "league"];
  return types[
    Math.floor(Math.random() * types.length)
  ] as "tournament" | "friendly" | "training" | "league";
}

function getRandomCourt(): string {
  const countries = [
    "Hard Court",
    "Clay Court",
    "Grass Court",
    "Carpet Court",
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

export async function createMatch(player: any, opponentPlayer: any, videoUrl: string, imageUrl: string) {
  const match = await prisma.match.create({
    data: {
      videoUrl,
      imageUrl,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      videoType: getRandomType(),
      fieldType: getRandomCourt(),
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