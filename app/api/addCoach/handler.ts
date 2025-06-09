import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const data = await req.json();
    const {email, coach} = data
  if (!email || !coach) {
     return NextResponse.json({ message: 'coachId and playerId are required' }, { status: 400 });
  }  
  try {
    const player = await prisma.player.findFirst({
        where: {email}
    })
    console.log(email)
    if(!player) return NextResponse.json({ message: 'Error retrieving your data'}, { status: 500 });

    const updatedPlayer =await prisma.player.update({
      where: { id: player.id },
      data: {
        coaches: {
          connect: { id: coach.id },
        },
      },
    })
    console.log(updatedPlayer)
    return NextResponse.json({ message: 'player added', connection: updatedPlayer}, { status: 201 });

    } 
  catch (error) {
    return NextResponse.json({ message: 'Error something went wrong', error }, { status: 500 });
  }
}