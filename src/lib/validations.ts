import { z } from 'zod';

export const TeamCreateSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(50, 'Team name cannot exceed 50 characters').trim(),
  captainId: z.string().optional().nullable(),
});

export const AthleteCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  role: z.enum(['CAPTAIN', 'MEMBER']).default('MEMBER'),
  teamId: z.string().optional().nullable(),
});

export const EventCreateSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters').max(80, 'Event name too long').trim(),
  description: z.string().max(300, 'Description too long').optional().nullable(),
  maxTeams: z.number().int().min(1, 'At least 1 team required').max(100, 'Max 100 teams'),
  date: z.string().or(z.date()),
  location: z.string().max(100).optional().nullable(),
});

export const ScoreCreateSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  eventId: z.string().min(1, 'Event ID is required'),
  pointsAwarded: z.number().int().min(0, 'Points cannot be negative').max(10000, 'Points value too high'),
  rank: z.number().int().min(1).max(100).optional().nullable(),
  notes: z.string().max(200).optional().nullable(),
});
