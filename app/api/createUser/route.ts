import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { email, role } = data;
  try {
    if (role === 'player') {
      await prisma.player.create({
        data: {
          email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      })
      return NextResponse.json({ message: 'Player created' });
    } 
    else if (role === 'coach') {
      await prisma.coach.create({
        data: {
          email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      return NextResponse.json({ message: 'Coach created' });
    } 
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}
