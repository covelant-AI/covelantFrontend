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
      firstName: "Demo",
      lastName: "Coach",
      age: 49,
      players: {
        create: [
          {
            firstName: "Michael",
            lastName: "Llodra",
            email: "micheal-llodra@covelant.com",
            avatar: "/testImages/michaelProfile.jpeg",
            winRate: 0.54,
          },
          {
            firstName: "Andy",
            lastName: "Murray",
            email: "andy-murray@covelant.com",
            avatar: "/testImages/AndyProfile.jpg",
            winRate: 0.74,
          },
          {
            firstName: "Rafael",
            lastName: "Nadals",
            email: "rafael-nadals@covelant.com",
            avatar: "/testImages/nadalProfile.jpg",
            winRate: 0.96,
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
      firstName: "Demo",
      lastName: "Coach 2",
      avatar: "/testImages/coach2.jpg",
      age: 32,
      players: {},
    },
  });

  return { coach1, coach2 };
}
