import { stat } from 'fs';
import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  const email = String(emailParam);

  try {
    const player = await prisma.player.findFirst({
      where: { email },
      include: {
        coached: true,
      },
    });

    if (player) {
      // Fetch PlayerStats and assign to player.stats
      const stats = await prisma.playerStat.findMany({
        where: { playerId: player.id },
        select: {
          subject: true,
          value: true,
        },
      });

      const playerStats = [{ ...player, stats }]

      return NextResponse.json(
        {
          message: 'found player with stats',
          connection: playerStats,
        },
        { status: 200 }
      );
    }

    // If not player, try as coach
    const coach = await prisma.coach.findFirst({
      where: { email },
      include: {
        players: true,
      },
    });

    let playersWithStats: { stats: { subject: string; value: number; }[]; 
    email: string; id: number; firstName: string | null; lastName: string | null; avatar: string | null; coachId: number | null; }[] = [];

    if (coach) {
      playersWithStats = await Promise.all(
        coach.players.map(async (player) => {
          const stats = await prisma.playerStat.findMany({
            where: { playerId: player.id },
            select: {
              subject: true,
              value: true,
            },
          });
          return { ...player, stats };
        })
      );

      return NextResponse.json(
        {
          message: coach.players.length > 0 ? 'found connection' : 'no connection',
          connection: playersWithStats,
        },
        { status: 200 }
      );
    }




    return NextResponse.json({ message: 'no user found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
}
