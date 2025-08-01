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

  // Fetch all existing matches
  const matches = await prisma.match.findMany();

  if (matches.length === 0) {
    console.warn("No matches found. Skipping MatchEvent seeding.");
    return;
  }

  for (const m of matches) {
    const matchId = m.id;

    // MATCH event: FIRST_SERVE
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.MATCH,
      matchType: MatchEventType.FIRST_SERVE,
      condition: ConditionType.FOCUSED,
      comment: "AI: Excellent start to the game",
      eventTimeSeconds: 10.0,
    }});

    // TACTIC event: BASELINE_RALLY
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.TACTIC,
      tacticType: TacticEventType.DROP_SHOT,
      condition: ConditionType.CONFIDENT,
      comment: "AI: Your opponent's positioning and superior sprinting ability allow him to reach the ball in time.",
      eventTimeSeconds: 14.0,
    }});

    // FOULS event: NET_TOUCH
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.FOULS,
      foulType: FoulsEventType.NET_TOUCH,
      condition: ConditionType.UNDER_PRESSURE,
      comment: "AI: You attempted to drop shot the ball in a similar manner as before but failed due to improper positioning. Advise to avoid sharp angle drop shots against this opponent",
      eventTimeSeconds: 46.5,
    }});

    // PHYSICAL event: FATIGUE_SIGN
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.PHYSICAL,
      physicalType: PhysicalEventType.FATIGUE_SIGN,
      condition: ConditionType.CLUTCH_PLAY,
      comment: "AI: You seem to exhibit signs of injury",      
      eventTimeSeconds: 117.2,
    }});

    // NOTE event with customCondition
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.NOTE,
      noteType: "Inconsistant",  // Custom note type
      customCondition: "Player needs to focus more on consistency",
      comment: "AI: Focus on keeping the ball in play and reducing errors.",
      eventTimeSeconds: 150.0,
    }});

  }

  console.log("MatchEvent seeding completed.");
}
