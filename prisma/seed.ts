import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Bissap Games multi-city database seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.score.deleteMany();
  await prisma.team.updateMany({ data: { captainId: null } });
  await prisma.athlete.deleteMany();
  await prisma.team.deleteMany();
  await prisma.event.deleteMany();

  // 1. Create Multi-City Fitness Events
  const eventsData = [
    {
      name: 'Ain Diab Coastal Relay',
      description: 'High-intensity coastal team relay along Ain Diab corniche. 4x 1.25k legs with sandbag sprint finish.',
      maxTeams: 16,
      city: 'Casablanca',
      location: 'Ain Diab Beach, Casablanca',
      date: new Date('2026-09-15T09:00:00Z'),
    },
    {
      name: 'Atlas Palm Strength Challenge',
      description: 'Maximum weight lifted aggregate across barbell deadlifts, sync kettlebell carries, and log presses.',
      maxTeams: 12,
      city: 'Marrakech',
      location: 'Palmeraie Arena, Marrakech',
      date: new Date('2026-09-28T14:00:00Z'),
    },
    {
      name: 'Hercules Cliffside Sprint',
      description: 'Timed coastal hill climb and obstacle relay featuring rope climbs and heavy sled pushes.',
      maxTeams: 10,
      city: 'Tangier',
      location: 'Cap Spartel, Tangier',
      date: new Date('2026-10-10T10:00:00Z'),
    },
    {
      name: 'Taghazout Ocean Dune Pull',
      description: 'Sand dune sprint & synchronous ocean tide sled drag. Tested across 4-person squads.',
      maxTeams: 12,
      city: 'Agadir',
      location: 'Taghazout Bay, Agadir',
      date: new Date('2026-10-24T09:30:00Z'),
    },
    {
      name: 'Bouregreg Relay Championship',
      description: 'The national championship finals combining 500m row ergometers, wall balls, and sprints.',
      maxTeams: 8,
      city: 'Rabat',
      location: 'Marina Bouregreg, Rabat',
      date: new Date('2026-11-05T11:00:00Z'),
    },
  ];

  const createdEvents = [];
  for (const eData of eventsData) {
    const ev = await prisma.event.create({ data: eData });
    createdEvents.push(ev);
  }

  console.log('✅ Multi-city events created:', createdEvents.map(e => `${e.name} (${e.city})`));

  // 2. Create Teams & Athletes
  const teamData = [
    {
      name: 'Atlas Titans',
      city: 'Casablanca',
      captain: { name: 'Youssef El Mansouri', email: 'youssef@atlastitans.ma' },
      members: [
        { name: 'Sarah Benali', email: 'sarah@atlastitans.ma' },
        { name: 'Omar Kabbaj', email: 'omar@atlastitans.ma' },
        { name: 'Leila Amrani', email: 'leila@atlastitans.ma' },
      ],
    },
    {
      name: 'Marrakech Lions',
      city: 'Marrakech',
      captain: { name: 'Karim Tazi', email: 'karim@marrakechlions.ma' },
      members: [
        { name: 'Zineb Chraibi', email: 'zineb@marrakechlions.ma' },
        { name: 'Mehdi Bennani', email: 'mehdi@marrakechlions.ma' },
        { name: 'Amine Guessous', email: 'amine@marrakechlions.ma' },
      ],
    },
    {
      name: 'Tangier Spartans',
      city: 'Tangier',
      captain: { name: 'Lina Amrani', email: 'lina@tangierspartans.ma' },
      members: [
        { name: 'Hamza El Fassi', email: 'hamza@tangierspartans.ma' },
        { name: 'Nadia Berrada', email: 'nadia@tangierspartans.ma' },
        { name: 'Reda Alami', email: 'reda@tangierspartans.ma' },
      ],
    },
    {
      name: 'Agadir Wave Squad',
      city: 'Agadir',
      captain: { name: 'Tarik Oukili', email: 'tarik@agadirwave.ma' },
      members: [
        { name: 'Sofia Filali', email: 'sofia@agadirwave.ma' },
        { name: 'Yassine Belhaj', email: 'yassine@agadirwave.ma' },
        { name: 'Kenza Zouiten', email: 'kenza@agadirwave.ma' },
      ],
    },
    {
      name: 'Rabat Capital Warriors',
      city: 'Rabat',
      captain: { name: 'Sami Bouzid', email: 'sami@rabatwarriors.ma' },
      members: [
        { name: 'Meriem Naciri', email: 'meriem@rabatwarriors.ma' },
        { name: 'Adnane Sefrioui', email: 'adnane@rabatwarriors.ma' },
        { name: 'Hiba El Hajji', email: 'hiba@rabatwarriors.ma' },
      ],
    },
  ];

  const createdTeams = [];

  for (const t of teamData) {
    // Create team
    const team = await prisma.team.create({
      data: {
        name: t.name,
        totalPoints: 0,
      },
    });

    // Create Captain
    const captain = await prisma.athlete.create({
      data: {
        name: t.captain.name,
        email: t.captain.email,
        role: Role.CAPTAIN,
        teamId: team.id,
      },
    });

    // Link captain to team
    await prisma.team.update({
      where: { id: team.id },
      data: { captainId: captain.id },
    });

    // Create members
    for (const m of t.members) {
      await prisma.athlete.create({
        data: {
          name: m.name,
          email: m.email,
          role: Role.MEMBER,
          teamId: team.id,
        },
      });
    }

    createdTeams.push(team);
  }

  console.log('✅ Teams and Athletes created!');

  // 3. Create Scores across multi-city events
  const scoreEntries = [
    // Casablanca Relay Event
    { teamIndex: 0, eventIndex: 0, points: 100, rank: 1, notes: 'Record 17m 45s relay finish' },
    { teamIndex: 1, eventIndex: 0, points: 88, rank: 2, notes: '18m 12s finish' },
    { teamIndex: 2, eventIndex: 0, points: 80, rank: 3, notes: '18m 40s finish' },

    // Marrakech Strength Event
    { teamIndex: 1, eventIndex: 1, points: 100, rank: 1, notes: '1540kg total tonnage lifted' },
    { teamIndex: 0, eventIndex: 1, points: 92, rank: 2, notes: '1480kg total tonnage' },
    { teamIndex: 3, eventIndex: 1, points: 85, rank: 3, notes: '1410kg total tonnage' },

    // Tangier Hill Sprint
    { teamIndex: 2, eventIndex: 2, points: 95, rank: 1, notes: 'Cap Spartel course record' },
    { teamIndex: 4, eventIndex: 2, points: 90, rank: 2, notes: '+45s behind leader' },

    // Agadir Dune Pull
    { teamIndex: 3, eventIndex: 3, points: 98, rank: 1, notes: 'Flawless synchronous sled drag' },
    { teamIndex: 0, eventIndex: 3, points: 85, rank: 2, notes: 'Solid dune endurance' },
  ];

  for (const s of scoreEntries) {
    const team = createdTeams[s.teamIndex];
    const event = createdEvents[s.eventIndex];

    await prisma.score.create({
      data: {
        teamId: team.id,
        eventId: event.id,
        pointsAwarded: s.points,
        rank: s.rank,
        notes: s.notes,
      },
    });
  }

  // Recalculate team total points
  for (const team of createdTeams) {
    const agg = await prisma.score.aggregate({
      where: { teamId: team.id },
      _sum: { pointsAwarded: true },
    });
    await prisma.team.update({
      where: { id: team.id },
      data: { totalPoints: agg._sum.pointsAwarded || 0 },
    });
  }

  console.log('🏆 Multi-city scores updated and leaderboards recalculated!');
  console.log('✨ Multi-city seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
