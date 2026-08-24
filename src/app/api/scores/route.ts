import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ScoreCreateSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

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
  const rl = checkRateLimit(request, 30, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const rawBody = await request.json();

    const validation = ScoreCreateSchema.safeParse({
      ...rawBody,
      pointsAwarded: typeof rawBody.pointsAwarded === 'string' ? parseInt(rawBody.pointsAwarded, 10) : rawBody.pointsAwarded,
      rank: rawBody.rank ? (typeof rawBody.rank === 'string' ? parseInt(rawBody.rank, 10) : rawBody.rank) : null,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid score parameters';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { teamId, eventId, pointsAwarded, rank, notes } = validation.data;

    // Atomic transaction for score upsert + total calculation
    const result = await prisma.$transaction(async (tx) => {
      const score = await tx.score.upsert({
        where: {
          teamId_eventId: {
            teamId,
            eventId,
          },
        },
        update: {
          pointsAwarded,
          rank: rank || null,
          notes: notes || null,
        },
        create: {
          teamId,
          eventId,
          pointsAwarded,
          rank: rank || null,
          notes: notes || null,
        },
        include: {
          team: true,
          event: true,
        },
      });

      const aggregate = await tx.score.aggregate({
        where: { teamId },
        _sum: { pointsAwarded: true },
      });

      const newTotal = aggregate._sum.pointsAwarded || 0;

      await tx.team.update({
        where: { id: teamId },
        data: { totalPoints: newTotal },
      });

      return { score, newTotalPoints: newTotal };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
