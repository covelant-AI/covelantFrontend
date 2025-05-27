import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
      const res = await prisma.opponent.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      })
      return NextResponse.json({ message: 'opponent created', opponent: res }, { status: 201 });

    } 
  catch (error) {
    return NextResponse.json({ message: 'Error creating opponent', error }, { status: 500 });
  }
}