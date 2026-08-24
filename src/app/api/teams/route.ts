import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TeamCreateSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
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
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // 1. Rate limiting check
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const rawBody = await request.json();
    
    // 2. Validate payload with Zod
    const validationResult = TeamCreateSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid team input payload';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, captainId } = validationResult.data;

    // 3. Execute DB operations in an atomic transaction
    const team = await prisma.$transaction(async (tx) => {
      const createdTeam = await tx.team.create({
        data: {
          name,
          captainId: captainId || null,
        },
        include: {
          captain: true,
        },
      });

      if (captainId) {
        await tx.athlete.update({
          where: { id: captainId },
          data: { teamId: createdTeam.id, role: 'CAPTAIN' },
        });
      }

      return createdTeam;
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A team with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
