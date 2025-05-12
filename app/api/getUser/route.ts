// pages/api/getUser.ts
import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  
  if (!emailParam) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }
  const email = emailParam;

  try {
    const coach = await prisma.coache.findFirst({
      where: { email: String(email) },
    });

    if(!coach) {
      const player = await prisma.player.findFirst({
        where: { email: String(email) }, 
      }
    );
      return NextResponse.json({ data: player, message: 'Player Data' });
    }

    return NextResponse.json({ data: coach, message: 'Coach Data' });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
  }
}
