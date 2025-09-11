import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// 1) Hardcode your sections here (per matchId)
const MANUAL_SECTIONS_BY_MATCH: Record<number, Array<{ start: number; end: number }>> = {
  1: [
    { start: 18, end: 24 },
    { start: 31, end: 38 },
    { start: 59, end: 66 },
    { start: 83, end: 89 },
  ],
  2: [
    { start: 93, end: 98 },
    { start: 127, end: 129 },
    { start: 136, end: 141 },
  ],
  3: [
    { start: 18, end: 21.8 },
    { start: 31, end: 35 },
    { start: 60, end: 65 },
    { start: 83.4, end: 87 },
    { start: 93.5, end: 98 },
    { start: 127, end: 129 },
    { start: 136.6, end: 141 },
    { start: 169, end: 181 },
    { start: 209, end: 222.5 },
  ],
};

// (kept for fallback/random mode when a matchId isn't in MANUAL_SECTIONS_BY_MATCH)
const getRandomFloat = (min: number, max: number) =>
  (Math.random() * (max - min) + min).toFixed(2);

const generateRandomSections = (matchId: number, totalTime: number = 300) => {
  const numSections = Math.floor(Math.random() * 6) + 5; // 5–10
  const sections = [];
  const GAP = 20;
  const availableTimeForSections = totalTime - (numSections - 1) * GAP;
  const timeInterval = availableTimeForSections / numSections;

  for (let i = 0; i < numSections; i++) {
    const startTime = parseFloat(
      getRandomFloat(i * timeInterval, (i + 1) * timeInterval - GAP)
    );
    const sectionDuration = Math.min(GAP, totalTime - startTime);
    const endTime = startTime + sectionDuration;

    sections.push({
      matchId,
      startIndex: i,
      startTime,
      endIndex: i,
      endTime,
    });
  }

  return sections;
};

// NEW: Build sections from the hardcoded array (kept very simple)
const buildManualSections = (matchId: number) => {
  const manual = MANUAL_SECTIONS_BY_MATCH[matchId];
  if (!manual || manual.length === 0) return null;

  return manual.map(({ start, end }, i) => ({
    matchId,
    startIndex: i,
    startTime: Number(start.toFixed(2)),
    endIndex: i,
    endTime: Number(end.toFixed(2)),
  }));
};

export async function seedMatchSections() {
  try {
    const matchIds = [1, 2, 3];

    for (const matchId of matchIds) {
      // Prefer manual sections if provided; otherwise fall back to random
      const sections =
        buildManualSections(matchId) ?? generateRandomSections(matchId);

      for (const section of sections) {
        console.log("Inserting:", section);

        await prisma.videoSection.create({
          data: {
            matchId: section.matchId,
            startIndex: section.startIndex,
            startTime: section.startTime,
            endIndex: section.endIndex,
            endTime: section.endTime,
          },
        });
      }
    }

    console.log("Seed data generated successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
