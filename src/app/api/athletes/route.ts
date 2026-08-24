import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { AthleteCreateSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        team: true,
        captainOf: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(athletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
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

    // 2. Validate input with Zod
    const validation = AthleteCreateSchema.safeParse(rawBody);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid athlete data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, role, teamId } = validation.data;
    const athleteRole = role === 'CAPTAIN' ? Role.CAPTAIN : Role.MEMBER;

    // 3. Atomic transaction execution
    const athlete = await prisma.$transaction(async (tx) => {
      const createdAthlete = await tx.athlete.create({
        data: {
          name,
          email,
          role: athleteRole,
          teamId: teamId || null,
        },
        include: {
          team: true,
        },
      });

      if (athleteRole === Role.CAPTAIN && teamId) {
        await tx.team.update({
          where: { id: teamId },
          data: { captainId: createdAthlete.id },
        });
      }

      return createdAthlete;
    });

    return NextResponse.json(athlete, { status: 201 });
  } catch (error: any) {
    console.error('Error creating athlete:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'An athlete with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
  }
}
