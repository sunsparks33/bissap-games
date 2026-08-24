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
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const rawBody = await request.json();
    
    const validationResult = TeamCreateSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid team input payload';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, captainId } = validationResult.data;

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

export async function PUT(request: Request) {
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const body = await request.json();
    const { teamId, captainId } = body;

    if (!teamId || !captainId) {
      return NextResponse.json({ error: 'Team ID and Captain ID are required' }, { status: 400 });
    }

    const updatedTeam = await prisma.$transaction(async (tx) => {
      // 1. Update Athlete to be CAPTAIN of this team
      await tx.athlete.update({
        where: { id: captainId },
        data: {
          teamId,
          role: 'CAPTAIN',
        },
      });

      // 2. Update Team captain reference
      const team = await tx.team.update({
        where: { id: teamId },
        data: {
          captainId,
        },
        include: {
          captain: true,
          athletes: true,
        },
      });

      return team;
    });

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error: any) {
    console.error('Error assigning captain:', error);
    return NextResponse.json({ error: 'Failed to assign captain to team' }, { status: 500 });
  }
}
