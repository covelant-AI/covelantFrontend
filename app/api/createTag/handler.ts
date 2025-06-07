import { PrismaClient, EventCategory } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 1) Parse incoming JSON
    const data = await req.json();

    const {
      matchId,
      category,
      matchType,
      tacticType,
      foulType,
      physicalType,
      comment,
      commentText,
      condition,
      eventTimeSeconds,
    } = data;

    // Basic validation: matchId and category are required
    if (typeof matchId !== 'number' || !category) {
      return NextResponse.json(
        { message: 'matchId and category are required' },
        { status: 400 }
      );
    }

    // 2) Build the create payload for Prisma based on category
    const payload: any = {
      matchId,
      category,
      eventTimeSeconds: Number(eventTimeSeconds) || 0,
      comment: comment || null,
      condition: condition || null,
    };

    switch (category) {
      case EventCategory.MATCH:
        if (!matchType) {
          return NextResponse.json(
            { message: 'matchType is required when category is MATCH' },
            { status: 400 }
          );
        }
        payload.matchType = matchType;
        break;

      case EventCategory.TACTIC:
        if (!tacticType) {
          return NextResponse.json(
            { message: 'tacticType is required when category is TACTIC' },
            { status: 400 }
          );
        }
        payload.tacticType = tacticType;
        break;

      case EventCategory.FOULS:
        if (!foulType) {
          return NextResponse.json(
            { message: 'foulType is required when category is FOULS' },
            { status: 400 }
          );
        }
        payload.foulType = foulType;
        break;

      case EventCategory.PHYSICAL:
        if (!physicalType) {
          return NextResponse.json(
            { message: 'physicalType is required when category is PHYSICAL' },
            { status: 400 }
          );
        }
        payload.physicalType = physicalType;
        break;

      case EventCategory.COMMENT:
        // For COMMENTS, use commentText if provided, otherwise fallback to comment
        if (!comment && !commentText) {
          return NextResponse.json(
            { message: 'commentText (or comment) is required when category is COMMENT' },
            { status: 400 }
          );
        }
        payload.commentText = commentText || comment;
        break;

      default:
        return NextResponse.json(
          { message: `Invalid category: ${category}` },
          { status: 400 }
        );
    }

    // 3) Create the MatchEvent in the database
    const newEvent = await prisma.matchEvent.create({
      data: payload,
    });

    // 4) Return the newly created event
    return NextResponse.json(
      { message: 'MatchEvent created', event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating MatchEvent:', error);
    return NextResponse.json(
      { message: 'Error creating MatchEvent', error: (error as Error).message },
      { status: 500 }
    );
  }
}
