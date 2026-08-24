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
        city: rawBody.city || 'Casablanca',
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

export async function PUT(request: Request) {
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const body = await request.json();
    const { id, name, description, maxTeams, city, date, location } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required for editing' }, { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description ? description.trim() : null } : {}),
        ...(maxTeams ? { maxTeams: parseInt(String(maxTeams), 10) } : {}),
        ...(city ? { city } : {}),
        ...(date ? { date: new Date(date) } : {}),
        ...(location !== undefined ? { location: location ? location.trim() : null } : {}),
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const rl = checkRateLimit(request, 20, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required for deletion' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
