import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  try {
    const body = await request.json();
    const { name, captainId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        captainId: captainId || null,
      },
      include: {
        captain: true,
      },
    });

    // If captainId was passed, also make sure athlete's teamId points to this team
    if (captainId) {
      await prisma.athlete.update({
        where: { id: captainId },
        data: { teamId: team.id, role: 'CAPTAIN' },
      });
    }

    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A team with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
