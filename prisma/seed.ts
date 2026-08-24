import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Bissap Games database seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.score.deleteMany();
  await prisma.team.updateMany({ data: { captainId: null } });
  await prisma.athlete.deleteMany();
  await prisma.team.deleteMany();
  await prisma.event.deleteMany();

  // 1. Create Fitness Events
  const relayEvent = await prisma.event.create({
    data: {
      name: 'Ain Diab 5k Relay',
      description: 'High-intensity coastal team relay along Ain Diab corniche. 4x 1.25k legs with sprint finishes.',
      maxTeams: 12,
      date: new Date('2026-09-15T09:00:00Z'),
      location: 'Ain Diab Beach, Casablanca',
    },
  });

  const strengthEvent = await prisma.event.create({
    data: {
      name: 'Strength Challenge',
      description: 'Maximum weight lifted aggregate across barbell deadlifts, kettlebell sync carries, and sandbag cleans.',
      maxTeams: 10,
      date: new Date('2026-09-16T14:00:00Z'),
      location: 'Anfa Athletic Complex, Casablanca',
    },
  });

  const obstacleEvent = await prisma.event.create({
    data: {
      name: 'Atlas Obstacle Sprint',
      description: 'Timed obstacle course featuring rope climbs, wall scales, and heavy sled pushes.',
      maxTeams: 8,
      date: new Date('2026-10-02T10:30:00Z'),
      location: 'Bouskoura Forest Trail',
    },
  });

  console.log('✅ Events created:', [relayEvent.name, strengthEvent.name, obstacleEvent.name]);

  // 2. Create Teams & Athletes
  const teamData = [
    {
      name: 'Atlas Titans',
      captain: { name: 'Youssef El Mansouri', email: 'youssef@atlastitans.ma' },
      members: [
        { name: 'Sarah Benali', email: 'sarah@atlastitans.ma' },
        { name: 'Omar Kabbaj', email: 'omar@atlastitans.ma' },
        { name: 'Leila Amrani', email: 'leila@atlastitans.ma' },
      ],
    },
    {
      name: 'Corniche Runners',
      captain: { name: 'Mehdi Chraibi', email: 'mehdi@cornicherunners.ma' },
      members: [
        { name: 'Sami Bennis', email: 'sami@cornicherunners.ma' },
        { name: 'Nadia Tazi', email: 'nadia@cornicherunners.ma' },
        { name: 'Karim Fassi', email: 'karim@cornicherunners.ma' },
      ],
    },
    {
      name: 'Bouskoura Warriors',
      captain: { name: 'Zineb Alami', email: 'zineb@bouskourawarriors.ma' },
      members: [
        { name: 'Hamza Tahiri', email: 'hamza@bouskourawarriors.ma' },
        { name: 'Aicha Bennani', email: 'aicha@bouskourawarriors.ma' },
        { name: 'Driss Berrada', email: 'driss@bouskourawarriors.ma' },
      ],
    },
    {
      name: 'Anfa Iron Squad',
      captain: { name: 'Tarik Othmani', email: 'tarik@anfairon.ma' },
      members: [
        { name: 'Kenza Slaoui', email: 'kenza@anfairon.ma' },
        { name: 'Reda Laraki', email: 'reda@anfairon.ma' },
        { name: 'Meriem Skalli', email: 'meriem@anfairon.ma' },
      ],
    },
  ];

  for (const t of teamData) {
    // Create Team skeleton first
    const createdTeam = await prisma.team.create({
      data: {
        name: t.name,
      },
    });

    // Create Captain
    const captain = await prisma.athlete.create({
      data: {
        name: t.captain.name,
        email: t.captain.email,
        role: Role.CAPTAIN,
        teamId: createdTeam.id,
      },
    });

    // Set captainId on team
    await prisma.team.update({
      where: { id: createdTeam.id },
      data: { captainId: captain.id },
    });

    // Create Members
    for (const member of t.members) {
      await prisma.athlete.create({
        data: {
          name: member.name,
          email: member.email,
          role: Role.MEMBER,
          teamId: createdTeam.id,
        },
      });
    }
  }

  console.log('✅ Teams and Athletes created!');

  // 3. Award Scores and calculate totals
  const allTeams = await prisma.team.findMany();

  const scoreMap = [
    // Relay Scores
    { teamName: 'Atlas Titans', eventId: relayEvent.id, points: 100, rank: 1, notes: 'Finished in 18m 42s' },
    { teamName: 'Corniche Runners', eventId: relayEvent.id, points: 85, rank: 2, notes: 'Finished in 19m 10s' },
    { teamName: 'Bouskoura Warriors', eventId: relayEvent.id, points: 70, rank: 3, notes: 'Finished in 20m 05s' },
    { teamName: 'Anfa Iron Squad', eventId: relayEvent.id, points: 55, rank: 4, notes: 'Finished in 21m 30s' },

    // Strength Scores
    { teamName: 'Anfa Iron Squad', eventId: strengthEvent.id, points: 100, rank: 1, notes: 'Total aggregate weight 1,420kg' },
    { teamName: 'Atlas Titans', eventId: strengthEvent.id, points: 85, rank: 2, notes: 'Total aggregate weight 1,350kg' },
    { teamName: 'Bouskoura Warriors', eventId: strengthEvent.id, points: 70, rank: 3, notes: 'Total aggregate weight 1,280kg' },
    { teamName: 'Corniche Runners', eventId: strengthEvent.id, points: 55, rank: 4, notes: 'Total aggregate weight 1,190kg' },
  ];

  for (const s of scoreMap) {
    const team = allTeams.find((t) => t.name === s.teamName);
    if (!team) continue;

    await prisma.score.create({
      data: {
        teamId: team.id,
        eventId: s.eventId,
        pointsAwarded: s.points,
        rank: s.rank,
        notes: s.notes,
      },
    });
  }

  // Update total points for each team
  for (const team of allTeams) {
    const teamScores = await prisma.score.aggregate({
      where: { teamId: team.id },
      _sum: { pointsAwarded: true },
    });

    const total = teamScores._sum.pointsAwarded || 0;

    await prisma.team.update({
      where: { id: team.id },
      data: { totalPoints: total },
    });
  }

  console.log('🏆 Scores updated and leaderboards recalculated!');
  console.log('✨ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
