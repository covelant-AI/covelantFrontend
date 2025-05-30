import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'wrong method used' });
    }

  const { type, firstName, lastName, dominantHand, age, height, email, avatar } = await req.json();
    console.log(type, email)
  if (!type && !email) {
     return NextResponse.json({ message: 'Missing required fields: type or email' });
  }
    try {
    if (type === 'player') {
      const playerID = await prisma.player.findFirst({
        where : {email},
      })

      if(!playerID) return NextResponse.json({ message: 'Something went wrong: cannot find email entry' });
      
      const updatedPlayer = await prisma.player.update({
        where: { id: playerID.id },
        data: {
          firstName,
          lastName,
          avatar,
          dominantHand,
          age: Number(age),
          height: Number(height),
        },
      })
      return NextResponse.json({ message: 'Player updated successfully', data: updatedPlayer });
    } else if (type === 'coach') {
      const coachID = await prisma.coach.findFirst({
        where : {email},
      })

      if(!coachID) return NextResponse.json({ message: 'Something went wrong: cannot find email entry' });

      const updatedCoach = await prisma.coach.update({
        where: { id: coachID.id },
        data: {
          firstName,
          lastName,
          age,
          avatar,
        },
      })
       return NextResponse.json({ message: 'Coach updated successfully', data: updatedCoach });
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}