import { prisma } from '@/lib/prisma';
import LandingPage from '@/components/LandingPage';

export const revalidate = 0; // Fresh live data on request

export default async function HomePage() {
  let teams: any[] = [];
  let events: any[] = [];
  let totalAthletes = 0;
  let totalScores = 0;

  try {
    const [fetchedTeams, fetchedEvents, athleteCount, scoreCount] = await Promise.all([
      prisma.team.findMany({
        include: {
          captain: true,
          athletes: true,
          scores: {
            include: {
              event: true,
            },
          },
        },
        orderBy: {
          totalPoints: 'desc',
        },
      }),
      prisma.event.findMany({
        include: {
          scores: true,
        },
        orderBy: {
          date: 'asc',
        },
      }),
      prisma.athlete.count(),
      prisma.score.count(),
    ]);

    teams = fetchedTeams;
    events = fetchedEvents;
    totalAthletes = athleteCount;
    totalScores = scoreCount;
  } catch (error) {
    console.error('Error loading home page data:', error);
  }

  return (
    <LandingPage
      initialTeams={teams}
      initialEvents={events}
      totalAthletes={totalAthletes}
      totalScores={totalScores}
    />
  );
}
