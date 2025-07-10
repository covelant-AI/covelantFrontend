import { PrismaClient } from '../../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { video_id, player_speed_data } = data;

    return NextResponse.json({ message: 'Player speed data stored successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error storing player speed data', error }, { status: 500 });
  }
}
