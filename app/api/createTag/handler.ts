// /app/api/createTag/route.ts
import {
  PrismaClient,
  Prisma,
  EventCategory,
  MatchEventType,
  TacticEventType,
  FoulsEventType,
  PhysicalEventType,
  NoteEventType,
  ConditionType,
} from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
type CreateMatchEventData = Prisma.MatchEventCreateArgs["data"];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      matchId,
      category,
      matchType,
      tacticType,
      foulType,
      physicalType,
      noteType,
      condition,
      comment,
      eventTimeSeconds,
    } = data as {
      matchId?: number;
      category?: string;
      matchType?: string;
      tacticType?: string;
      foulType?: string;
      physicalType?: string;
      noteType?: string;
      condition?: string;
      comment?: string;
      eventTimeSeconds?: number;
    };

    // Basic validation
    if (typeof matchId !== "number" || !category) {
      return NextResponse.json(
        { message: "matchId and category are required" },
        { status: 400 }
      );
    }
    if (typeof eventTimeSeconds !== "number") {
      return NextResponse.json(
        { message: "eventTimeSeconds must be a number" },
        { status: 400 }
      );
    }

    // Normalize & validate category
    if (!Object.values(EventCategory).includes(category as any)) {
      return NextResponse.json(
        { message: `Invalid category: ${category}` },
        { status: 400 }
      );
    }
    const cat = category as EventCategory;

    // Build the payload
    const payload: CreateMatchEventData = {
      matchId,
      category: cat,
      eventTimeSeconds,
      comment,
    };

    switch (cat) {
      case EventCategory.MATCH:
        if (!matchType || !Object.values(MatchEventType).includes(matchType as any)) {
          return NextResponse.json(
            { message: "A valid matchType is required for MATCH events" },
            { status: 400 }
          );
        }
        payload.matchType = matchType as MatchEventType;
        if (condition) {
          if (!Object.values(ConditionType).includes(condition as any)) {
            return NextResponse.json(
              { message: `Invalid condition: ${condition}` },
              { status: 400 }
            );
          }
          payload.condition = condition as ConditionType;
        }
        break;

      case EventCategory.TACTIC:
        if (!tacticType || !Object.values(TacticEventType).includes(tacticType as any)) {
          return NextResponse.json(
            { message: "A valid tacticType is required for TACTIC events" },
            { status: 400 }
          );
        }
        payload.tacticType = tacticType as TacticEventType;
        if (condition) {
          if (!Object.values(ConditionType).includes(condition as any)) {
            return NextResponse.json(
              { message: `Invalid condition: ${condition}` },
              { status: 400 }
            );
          }
          payload.condition = condition as ConditionType;
        }
        break;

      case EventCategory.FOULS:
        if (!foulType || !Object.values(FoulsEventType).includes(foulType as any)) {
          return NextResponse.json(
            { message: "A valid foulType is required for FOULS events" },
            { status: 400 }
          );
        }
        payload.foulType = foulType as FoulsEventType;
        if (condition) {
          if (!Object.values(ConditionType).includes(condition as any)) {
            return NextResponse.json(
              { message: `Invalid condition: ${condition}` },
              { status: 400 }
            );
          }
          payload.condition = condition as ConditionType;
        }
        break;

      case EventCategory.PHYSICAL:
        if (
          !physicalType ||
          !Object.values(PhysicalEventType).includes(physicalType as any)
        ) {
          return NextResponse.json(
            { message: "A valid physicalType is required for PHYSICAL events" },
            { status: 400 }
          );
        }
        payload.physicalType = physicalType as PhysicalEventType;
        if (condition) {
          if (!Object.values(ConditionType).includes(condition as any)) {
            return NextResponse.json(
              { message: `Invalid condition: ${condition}` },
              { status: 400 }
            );
          }
          payload.condition = condition as ConditionType;
        }
        break;

      case EventCategory.NOTE:
        // NOTE events use noteType instead of subtype + no condition
        if (!noteType || !Object.values(NoteEventType).includes(noteType as any)) {
          return NextResponse.json(
            { message: "A valid noteType is required for NOTE events" },
            { status: 400 }
          );
        }
        payload.noteType = noteType as NoteEventType;
        // explicitly clear any condition
        payload.condition = null;
        break;

      default:
        return NextResponse.json(
          { message: `Unhandled category: ${category}` },
          { status: 400 }
        );
    }

    // 4) Persist
    const newEvent = await prisma.matchEvent.create({ data: payload });

    // 5) Return
    return NextResponse.json(
      { message: "MatchEvent created", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating MatchEvent:", error);
    return NextResponse.json(
      { message: "Error creating MatchEvent", error: (error as Error).message },
      { status: 500 }
    );
  }
}
