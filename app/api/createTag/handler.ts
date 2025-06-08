// /app/api/createTag/route.ts
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

    // Basic validation
    if (typeof matchId !== 'number' || !category) {
      return NextResponse.json(
        { message: 'matchId and category are required' },
        { status: 400 }
      );
    }

    // 2) Build the common payload
    const payload: any = {
      matchId,
      category:
        category === 'note' || category === EventCategory.COMMENT
          ? EventCategory.COMMENT
          : category,
      eventTimeSeconds: Number(eventTimeSeconds) || 0,
    };

    // 3) Branch by category
    switch (payload.category) {
      case EventCategory.MATCH:
        if (!matchType) {
          return NextResponse.json(
            { message: 'matchType is required when category is MATCH' },
            { status: 400 }
          );
        }
        payload.matchType = matchType;
        payload.condition = condition || null;
        break;

      case EventCategory.TACTIC:
        if (!tacticType) {
          return NextResponse.json(
            { message: 'tacticType is required when category is TACTIC' },
            { status: 400 }
          );
        }
        payload.tacticType = tacticType;
        payload.condition = condition || null;
        break;

      case EventCategory.FOULS:
        if (!foulType) {
          return NextResponse.json(
            { message: 'foulType is required when category is FOULS' },
            { status: 400 }
          );
        }
        payload.foulType = foulType;
        payload.condition = condition || null;
        break;

      case EventCategory.PHYSICAL:
        if (!physicalType) {
          return NextResponse.json(
            { message: 'physicalType is required when category is PHYSICAL' },
            { status: 400 }
          );
        }
        payload.physicalType = physicalType;
        payload.condition = condition || null;
        break;
          
      case EventCategory.COMMENT:
        // NOTE/NOCOMMENT tags: no type or condition, only free text
        // copy the incoming `comment` into both `comment` + `commentText`
        const noteText = commentText ?? comment;
        if (!noteText) {
          return NextResponse.json(
            { message: 'commentText is required for note tags' },
            { status: 400 }
          );
        }
        payload.comment = noteText;
        payload.commentText = noteText;
        // ensure we store an empty string rather than `null`
        payload.condition = null;
        break;

      default:
        return NextResponse.json(
          { message: `Invalid category: ${category}` },
          { status: 400 }
        );
    }

    // 4) Persist
    const newEvent = await prisma.matchEvent.create({
      data: payload,
    });

    // 5) Return
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
