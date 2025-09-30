// app/api/getMatchSections/handler.ts
import { PrismaClient } from '../../../generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Extract matchId from the query parameters
    const url = new URL(req.url)
    const matchId = parseInt(url.searchParams.get('id') || '', 10)
    
    // Ensure matchId is valid
    if (isNaN(matchId)) {
      return NextResponse.json({ message: 'Invalid matchId' }, { status: 400 })
    }

    // Fetch VideoSections from the database
    const videoSections = await prisma.videoSection.findMany({
      where: { matchId },
      select: {
        id: true,
        matchId: true,
        startIndex: true,
        startTime: true,
        endIndex: true,
        endTime: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    // Return the fetched data as JSON
    return NextResponse.json({ success: true, data: videoSections }, { status: 200 })
  } catch (error) {
    console.error('Error fetching video sections:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
