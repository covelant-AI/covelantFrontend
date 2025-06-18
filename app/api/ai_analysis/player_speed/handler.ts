import { PrismaClient } from '../../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { video_id, player_speed_data } = data;
    console.log("Received player speed data:", player_speed_data);
    // If no player speed data is provided, handle the case
    if (!player_speed_data || player_speed_data.length === 0) {
      return NextResponse.json({ message: 'No player speed data provided' }, { status: 400 });
    }

    // Loop through the player_speed_data and insert it into the database
    for (let item of player_speed_data) {
      const { eventTimeSeconds, value, playerId } = item;

      // Handle the case where value or playerId might be null
      if (value == null || playerId == null) {
        return NextResponse.json({ message: 'Invalid data in player speed' }, { status: 400 });
      }

      // Create a new MatchMetric for each player speed event
      await prisma.matchMetric.create({
        data: {
          matchId: parseInt(video_id), // Match ID from video_id
          metricType: 'PLAYER_SPEED',
          value: value,
          eventTimeSeconds: eventTimeSeconds,
          playerId: playerId,
        },
      });
    }

    return NextResponse.json({ message: 'Player speed data stored successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error storing player speed data', error }, { status: 500 });
  }
}
