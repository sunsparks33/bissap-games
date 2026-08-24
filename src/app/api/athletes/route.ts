import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

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
  try {
    const body = await request.json();
    const { name, email, role, teamId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const athleteRole = role === 'CAPTAIN' ? Role.CAPTAIN : Role.MEMBER;

    const athlete = await prisma.athlete.create({
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

    // If role is CAPTAIN and teamId is provided, update team's captainId
    if (athleteRole === Role.CAPTAIN && teamId) {
      await prisma.team.update({
        where: { id: teamId },
        data: { captainId: athlete.id },
      });
    }

    return NextResponse.json(athlete, { status: 201 });
  } catch (error: any) {
    console.error('Error creating athlete:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'An athlete with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
  }
}
