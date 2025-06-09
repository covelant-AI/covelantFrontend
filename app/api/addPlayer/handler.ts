import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const data = await req.json();
    const {email, player} = data
  if (!email || !player) {
     return NextResponse.json({ message: 'coachId and playerId are required' }, { status: 400 });
  }  
  try {
    const coach = await prisma.coach.findFirst({
        where: {email}
    })

    if(!coach) return NextResponse.json({ message: 'Error retrieving your data'}, { status: 500 });

    const updatedPlayer =await prisma.coach.update({
      where: { id: coach.id },
      data: {
        players: {
          connect: { id: player.id },
        },
      },
    })

    return NextResponse.json({ message: 'player added', connection: updatedPlayer}, { status: 201 });

    } 
  catch (error) {
    return NextResponse.json({ message: 'Error something went wrong', error }, { status: 500 });
  }
}