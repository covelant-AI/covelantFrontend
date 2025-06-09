import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();
function getRandomStatValue(): number {
  return Math.floor(Math.random() * 101); // 0 to 100
}

export async function seedPlayerStats(playerId: number) {
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