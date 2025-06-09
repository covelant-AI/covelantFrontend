import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function seedCoaches() {
  const coach1 = await prisma.coach.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: "coach1@covelant.com",
      team: "team1",
      avatar: "/testImages/coach1.jpg",
      firstName: "Master",
      lastName: "Coach",
      age: 49,
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
      age: 32,
      players: {},
    },
  });

  return { coach1, coach2 };
}
