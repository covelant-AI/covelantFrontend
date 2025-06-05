import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function findOrCreateOpponent(firstName: string, lastName: string) {
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