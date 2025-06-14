import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { normalizedEmail, role } = data;

  try {
    // Check if user already exists as player or coach
    const existingPlayer = await prisma.player.findFirst({ where: { email: normalizedEmail } });
    const existingCoach = await prisma.coach.findFirst({ where: { email: normalizedEmail } });

    if (existingPlayer || existingCoach) {
      return NextResponse.json({ message: 'Player already exists' }, { status: 400 });
    }

    if (role === 'player') {
      await prisma.player.create({
        data: {
          email: normalizedEmail,
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar || '/images/default-avatar.png', 
        },
      });
      return NextResponse.json({ message: 'Player created' });
    } 
    
    if (role === 'coach') {
      await prisma.coach.create({
        data: {
          email: normalizedEmail,
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar || '/images/default-avatar.png', 
        },
      });
      return NextResponse.json({ message: 'Coach created' });
    }

    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}

