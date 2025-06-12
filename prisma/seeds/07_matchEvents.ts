// prisma/seeds/07_matchEvents.ts

import {
  PrismaClient,
  EventCategory,
  MatchEventType,
  TacticEventType,
  FoulsEventType,
  PhysicalEventType,
  NoteEventType,
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
      comment: "great Job",
      eventTimeSeconds: 10.0,
    }});

    // TACTIC event: BASELINE_RALLY
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.TACTIC,
      tacticType: TacticEventType.BASELINE_RALLY,
      condition: ConditionType.CONFIDENT,
      comment: "great Job2",
      eventTimeSeconds: 14.0,
    }});

    // FOULS event: NET_TOUCH
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.FOULS,
      foulType: FoulsEventType.NET_TOUCH,
      condition: ConditionType.UNDER_PRESSURE,
      comment: "great Job3",
      eventTimeSeconds: 46.5,
    }});

    // PHYSICAL event: FATIGUE_SIGN
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.PHYSICAL,
      physicalType: PhysicalEventType.FATIGUE_SIGN,
      condition: ConditionType.FATIGUE_SIGNS,
      comment: "great Job4",      
      eventTimeSeconds: 110.2,
    }});

    // NOTE event: GENERAL
    await prisma.matchEvent.create({ data: {
      matchId,
      category: EventCategory.NOTE,
      noteType: NoteEventType.GENERAL,
      condition: ConditionType.FOCUSED,
      comment: "great Job5",      
      eventTimeSeconds: 105.0,
    }});
  }

  console.log("MatchEvent seeding completed.");
}


