import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  const email = emailParam;
  
  try {
  const player = await prisma.player.findFirst({
    where: {  email: String(email)  },
    include: {
      coached: true, 
    },
  });

  if (player) {
    if (player.coachId) {
      return NextResponse.json({ message: 'found connection', connection: player.coached }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'no connection'}, { status: 200 });
    }
  }

  const coach = await prisma.coach.findFirst({
    where: {  email: String(email)  },
    include: {
      players: true, // include all players assigned to the coach
    },
  });
  
  console.log("MADE IT TO THE END");
  if (coach) {
    if (coach.players.length > 0) {
        return NextResponse.json({ message: 'found connection', connection: coach.players}, { status: 200 });
    } else {
        return NextResponse.json({ message: 'no connection'}, { status: 200 });
    }
    } 
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}