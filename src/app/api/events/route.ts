import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventCreateSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        scores: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const rawBody = await request.json();

    const validation = EventCreateSchema.safeParse({
      ...rawBody,
      maxTeams: typeof rawBody.maxTeams === 'string' ? parseInt(rawBody.maxTeams, 10) : rawBody.maxTeams,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid event input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, description, maxTeams, date, location } = validation.data;

    const event = await prisma.event.create({
      data: {
        name,
        description: description || null,
        maxTeams,
        date: new Date(date),
        location: location || 'Ain Diab, Casablanca',
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
