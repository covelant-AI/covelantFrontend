import { PrismaClient } from '../../../generated/prisma';  
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {

  const url = new URL(req.url);
  const emailParam = url.searchParams.get('email');
  const nameParam  = url.searchParams.get('name');

  try{
  // require at least one
  if (!emailParam && !nameParam) {
    return NextResponse.json(
      { message: 'Either `email` or `name` query-param is required' },
      { status: 400 }
    );
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
    const opponnent = await prisma.opponent.findMany({
      where: nameFilter,
      take: 3,
    })


    let player = await prisma.player.findMany({
      where: nameFilter,
      take: 3,
    })

    const combinedData = [...player, ...opponnent];
    const uniqueData = [];
    const seen = new Set();

    for (const item of combinedData) {
      if (!seen.has(item.id)) { // Check if this item is unique by its 'id'
        seen.add(item.id);
        uniqueData.push(item);
      }
      if (uniqueData.length === 3) break; // Stop when we have 3 unique items
    }

    // Return combined response
    return NextResponse.json({ data: uniqueData, message: 'Player and Opponent Data' });


  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user', error },
      { status: 500 }
    )
  } 
}


export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
      await prisma.opponent.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      })
      return NextResponse.json({ message: 'opponent created' });

    } 
  catch (error) {
    return NextResponse.json({ message: 'Error creating opponent', error }, { status: 500 });
  }
}