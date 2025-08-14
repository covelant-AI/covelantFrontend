import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Utility function to generate random float values within a range (for start and end time)
const getRandomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

// Generate a random number of sections for each match (between 5 and 10 sections)
const generateRandomSections = (matchId: number, totalTime: number = 180) => {
  const numSections = Math.floor(Math.random() * 6) + 5; // Random number of sections between 5 and 10
  let sections = [];

  for (let i = 0; i < numSections; i++) {
    const startTime = parseFloat(getRandomFloat(0, totalTime - 2));  
    const endTime = parseFloat(getRandomFloat(startTime + 1, totalTime)); 

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

export async function seedMatchSections() {
  try {
    // Generate sections for matchId 1, 2, and 3
    const matchIds = [1, 2, 3];
    for (const matchId of matchIds) {
      const sections = generateRandomSections(matchId);

      // Insert each generated section into the database
      for (const section of sections) {
        console.log('Inserting:', section); // Log data to see what's being inserted

        await prisma.videoSection.create({
          data: {
            matchId: section.matchId,
            startIndex: section.startIndex,
            startTime: section.startTime, // Make sure this is a float
            endIndex: section.endIndex,
            endTime: section.endTime,     // Make sure this is a float
          },
        });
      }
    }

    console.log('Seed data generated successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
