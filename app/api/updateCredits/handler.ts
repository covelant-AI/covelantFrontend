// /app/api/getMatchTags/route.ts
import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, usedCredits } = body;

    if (!email || typeof usedCredits !== 'number') {
      return NextResponse.json({ message: 'Missing or invalid fields' }, { status: 400 });
    }

    // Try updating player
    const player = await prisma.player.findFirst({ where: { email } });
    if (player) {
      const updated = await prisma.player.update({
        where: { id: player.id },
        data: { credits: Math.max(0, player.credits - usedCredits) },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // If not a player, try coach
    const coach = await prisma.coach.findFirst({ where: { email } });
    if (coach) {
      const updated = await prisma.coach.update({
        where: { id: coach.id },
        data: { credits: Math.max(0, coach.credits - usedCredits) },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  } catch (err) {
    console.error('Error updating credits:', err);
    return NextResponse.json({ message: 'Server error', error: String(err) }, { status: 500 });
  }
}

