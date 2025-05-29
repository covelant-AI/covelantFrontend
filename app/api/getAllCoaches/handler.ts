import { PrismaClient } from '../../../generated/prisma';  
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET() {

  try {
    const players = await prisma.coach.findMany({
      take: 10,
      skip: 0,
    })
    return NextResponse.json({ data: players, message: 'Player Data' })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user', error },
      { status: 500 }
    )
  } 
}
