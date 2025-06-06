// prisma/seeds/07_matchEvents.ts

import { PrismaClient, EventCategory, MatchEventType, TacticEventType, FoulsEventType, PhysicalEventType, ConditionType } from "../../generated/prisma";

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

    // --- Example 1: a MATCH category event (e.g. First Serve at 10s, condition = FOCUSED)
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.MATCH,
        matchType: MatchEventType.FIRST_SERVE,
        condition: ConditionType.FOCUSED,
        eventTimeSeconds: 10.0,
      },
    });

    // --- Example 2: a TACTIC category event (e.g. Baseline Rally at 25s, condition = CONFIDENT)
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.TACTIC,
        tacticType: TacticEventType.BASELINE_RALLY,
        condition: ConditionType.CONFIDENT,
        eventTimeSeconds: 25.0,
      },
    });

    // --- Example 3: a FOULS category event (e.g. Net Touch at 37.5s, condition = UNDER_PRESSURE)
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.FOULS,
        foulType: FoulsEventType.NET_TOUCH,
        condition: ConditionType.UNDER_PRESSURE,
        eventTimeSeconds: 37.5,
      },
    });

    // --- Example 4: a PHYSICAL category event (e.g. Fatigue Sign at 52.2s, condition = FATIGUE_SIGNS)
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.PHYSICAL,
        physicalType: PhysicalEventType.FATIGUE_SIGN,
        condition: ConditionType.FATIGUE_SIGNS,
        eventTimeSeconds: 52.2,
      },
    });

    // --- Example 5: a COMMENT category event (free‐text comment at 45s)
    await prisma.matchEvent.create({
      data: {
        matchId,
        category: EventCategory.COMMENT,
        commentText: "Great rally here!",
        eventTimeSeconds: 45.0,
      },
    });
  }

  console.log("MatchEvent seeding completed.");
}
