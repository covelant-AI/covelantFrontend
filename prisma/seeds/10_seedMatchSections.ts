import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Utility function to generate random float values within a range (for start and end time)
const getRandomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

const generateRandomSections = (matchId: number, totalTime: number = 300) => {
  const numSections = Math.floor(Math.random() * 6) + 5; // Random number of sections between 5 and 10 
  let sections = [];
  let lastEndTime = 0;  // Track the end time of the last section
  
  // Calculate the gap between the start times to evenly distribute sections across the total time
  const availableTimeForSections = totalTime - (numSections - 1) * 20;  // Subtracting 20 seconds for each section's gap
  const timeInterval = availableTimeForSections / numSections;

  for (let i = 0; i < numSections; i++) {
    // Ensure there is at least 20 seconds between sections, and spread sections evenly
    const startTime = parseFloat(getRandomFloat(i * timeInterval, (i + 1) * timeInterval - 20));  
    const sectionDuration = Math.min(20, totalTime - startTime);  // Limit section length to 20 seconds
    const endTime = startTime + sectionDuration;  // Ensure no section exceeds 20 seconds

    sections.push({
      matchId,
      startIndex: i,
      startTime,
      endIndex: i,
      endTime,
    });

    lastEndTime = endTime;  // Update lastEndTime for the next iteration
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
