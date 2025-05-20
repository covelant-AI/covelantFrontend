// app/api/getMatchOutcome/handler.ts
import { PrismaClient } from '../../../generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

type PlayerMatchResult = {
  id: number
  result: string
  match: {
    id: number
    videoUrl?: string | null
    imageUrl?: string | null
    date: string
    videoType: string
  }
}

export async function GET(req: NextRequest) {
const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  
  if (!emailParam) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }
  const email = emailParam;

  try {
    const player = await prisma.player.findFirst({
      where: { email },
    })

    if (!player) {
      return NextResponse.json({ success: false, message: 'Player not found' }, { status: 400 })
    }

    const playerMatches = await prisma.playerMatch.findMany({
      where: { playerId: player.id },
      orderBy: {
        match: {
          date: 'desc',
        },
      },
      take: 4,
      include: {
        match: true,
      },
    })

    const results: PlayerMatchResult[] = playerMatches.map((pm) => ({
      id: pm.id,
      result: pm.result,
      match: {
        id: pm.match.id,
        videoUrl: pm.match.videoUrl,
        imageUrl: pm.match.imageUrl,
        date: pm.match.date.toISOString(),
        videoType: pm.match.videoType,
      },
    }))
    
    return NextResponse.json({ success: true, data: results }, { status: 200 })
  } catch (error) {
    console.error('Error fetching player matches:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
