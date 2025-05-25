import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    console.log('getUser handler called');
  const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  const nameParam  = url.searchParams.get('name');

  // require at least one
  if (!emailParam && !nameParam) {
    return NextResponse.json(
      { message: 'Either `email` or `name` query-param is required' },
      { status: 400 }
    );
  }

  try {
    if (emailParam) {
      const coach = await prisma.coach.findFirst({
        where: { email: String(emailParam) },
      });

      if (!coach) {
        const player = await prisma.player.findFirst({
          where: { email: String(emailParam) },
        });
        return NextResponse.json({ data: player, message: 'Player Data' });
      }

      return NextResponse.json({ data: coach, message: 'Coach Data' });
    }

    const raw = nameParam!.trim()
    const tokens = raw.split(/\s+/)

        // build a flexible "where" clause
    let nameFilter: any
    if (tokens.length >= 2) {
      const [t1, t2] = tokens
      nameFilter = {
        OR: [
          {
            AND: [
              { firstName: { contains: t1, mode: 'insensitive' } },
              { lastName:  { contains: t2, mode: 'insensitive' } },
            ],
          },
          {
            AND: [
              { firstName: { contains: t2, mode: 'insensitive' } },
              { lastName:  { contains: t1, mode: 'insensitive' } },
            ],
          },
        ],
      }
    } else {
      const t = tokens[0]
      nameFilter = {
        OR: [
          { firstName: { contains: t, mode: 'insensitive' } },
          { lastName:  { contains: t, mode: 'insensitive' } },
        ],
      }
    }

    // Query multiple players (limit 3 results)
    const players = await prisma.player.findMany({
      where: nameFilter,
      take: 3,
    })

    return NextResponse.json({ data: players, message: 'Player Data' })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user', error },
      { status: 500 }
    )
  } 
}
