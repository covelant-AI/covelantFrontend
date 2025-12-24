// app/api/getMatchOutcome/handler.ts
import { PrismaClient } from '../../../generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const videoId = url.searchParams.get('id');
    console.log(videoId)
  
  if (!videoId) {
    return NextResponse.json({ message: 'missing video data' }, { status: 400 });
  }
 
  try {
    const match = await prisma.match.findUnique({
      where: { id: Number(videoId) },
      include: {
        playerMatches: {
          include: {
            opponent: true,
            player: true,
            playerTwo: true,
          },
        },
        analysisStatus: true,
      },
    })

    if (!match) {
      return NextResponse.json({ success: false, message: 'video not found' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: match }, { status: 200 })
  } catch (error) {
    console.error('Error fetching player matches:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}

