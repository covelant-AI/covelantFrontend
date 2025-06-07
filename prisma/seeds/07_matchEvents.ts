// prisma/seeds/07_matchEvents.ts

import {
  PrismaClient,
  EventCategory,
  MatchEventType,
  TacticEventType,
  FoulsEventType,
  PhysicalEventType,
  ConditionType,
} from "../../generated/prisma";

const prisma = new PrismaClient();

export async function seedMatchEvents() {
  console.log("Seeding MatchEvent data...");

  // 1) Fetch all existing matches
  const matches = await prisma.match.findMany();

  if (matches.length === 0) {
    console.warn("No matches found. Skipping MatchEvent seeding.");
    return;
  }

  // 2) For each match, create one event of each category as an example
  for (const m of matches) {
    const matchId = m.id;

    // --- Example 1: a MATCH category event
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.MATCH,
        matchType: MatchEventType.FIRST_SERVE,
        condition: ConditionType.FOCUSED,
        eventTimeSeconds: 10.0,
        comment: "First Serve executed smoothly", // new top‐level comment
      },
    });

    // --- Example 2: a TACTIC category event
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.TACTIC,
        tacticType: TacticEventType.BASELINE_RALLY,
        condition: ConditionType.CONFIDENT,
        eventTimeSeconds: 25.0,
        comment: "Baseline rally went 15 strokes", // new top‐level comment
      },
    });

    // --- Example 3: a FOULS category event
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.FOULS,
        foulType: FoulsEventType.NET_TOUCH,
        condition: ConditionType.UNDER_PRESSURE,
        eventTimeSeconds: 37.5,
        comment: "Player grazed the net", // new top‐level comment
      },
    });

    // --- Example 4: a PHYSICAL category event
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.PHYSICAL,
        physicalType: PhysicalEventType.FATIGUE_SIGN,
        condition: ConditionType.FATIGUE_SIGNS,
        eventTimeSeconds: 52.2,
        comment: "Noticeable drop in foot speed", // new top‐level comment
      },
    });

    // --- Example 5: a COMMENT category event
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.COMMENT,
        comment: "Great rally here!",      // new top‐level comment
        commentText: "Great rally here!",  // existing commentText field
        eventTimeSeconds: 45.0,
      },
    });
  }

  console.log("MatchEvent seeding completed.");
}

