import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();
export async function seedPlayerData() {
  const player1 = await prisma.player.upsert({
    where: { id: 5 },
    update: {},
    create: {
      firstName: "single",
      lastName: "player",
      email: "single@covelant.com",
      avatar: "/testImages/test.jpg",
      age: 29,
      winRate: 0.5,
    },
  });

  return player1;
}
