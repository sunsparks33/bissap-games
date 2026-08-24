import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      include: {
        team: true,
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, eventId, pointsAwarded, rank, notes } = body;

    if (!teamId || !eventId || pointsAwarded === undefined) {
      return NextResponse.json({ error: 'Team ID, Event ID, and Points are required' }, { status: 400 });
    }

    const points = parseInt(pointsAwarded, 10);
    const parsedRank = rank ? parseInt(rank, 10) : null;

    // Upsert score (create or update existing team/event score)
    const score = await prisma.score.upsert({
      where: {
        teamId_eventId: {
          teamId,
          eventId,
        },
      },
      update: {
        pointsAwarded: points,
        rank: parsedRank,
        notes: notes || null,
      },
      create: {
        teamId,
        eventId,
        pointsAwarded: points,
        rank: parsedRank,
        notes: notes || null,
      },
      include: {
        team: true,
        event: true,
      },
    });

    // Recalculate Team totalPoints
    const aggregate = await prisma.score.aggregate({
      where: { teamId },
      _sum: { pointsAwarded: true },
    });

    const newTotal = aggregate._sum.pointsAwarded || 0;

    await prisma.team.update({
      where: { id: teamId },
      data: { totalPoints: newTotal },
    });

    return NextResponse.json({ score, newTotalPoints: newTotal }, { status: 200 });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
