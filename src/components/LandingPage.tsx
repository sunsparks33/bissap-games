'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Flame, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Crown, 
  Medal, 
  Sparkles, 
  MapPin,
  Zap,
  X,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Timer,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import MultiStepTeamRegistration from './MultiStepTeamRegistration';
import LiveLeaderboard from './LiveLeaderboard';

interface Team {
  id: string;
  name: string;
  totalPoints: number;
  captain?: { name: string; email: string } | null;
  athletes?: any[];
  scores?: any[];
}

interface EventItem {
  id: string;
  name: string;
  description?: string;
  maxTeams: number;
  date: string;
  location?: string;
  scores?: any[];
}

interface LandingPageProps {
  initialTeams: Team[];
  initialEvents: EventItem[];
  totalAthletes: number;
  totalScores: number;
}

export default function LandingPage({
  initialTeams = [],
  initialEvents = [],
  totalAthletes = 0,
  totalScores = 0,
}: LandingPageProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [events] = useState<EventItem[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Registration modal form state
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setSubmitting(true);
    setNotification(null);

    try {
      // 1. Create team
      const teamRes = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim() }),
      });

      const teamData = await teamRes.json();
      if (!teamRes.ok) throw new Error(teamData.error || 'Failed to create team');

      // 2. If captain info is provided, create athlete and link as captain
      if (captainName.trim() && captainEmail.trim()) {
        const athleteRes = await fetch('/api/athletes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: captainName.trim(),
            email: captainEmail.trim(),
            role: 'CAPTAIN',
            teamId: teamData.id,
          }),
        });

        const athleteData = await athleteRes.json();
        if (athleteRes.ok && athleteData.id) {
          // Update team captain reference
          await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName.trim(), captainId: athleteData.id }),
          });
        }
      }

      setNotification({
        type: 'success',
        message: `Team "${teamData.name}" successfully registered for Bissap Games!`,
      });

      // Update local team list
      setTeams(prev => [teamData, ...prev]);
      setTeamName('');
      setCaptainName('');
      setCaptainEmail('');

      setTimeout(() => {
        setIsModalOpen(false);
        setNotification(null);
      }, 2500);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const top1 = teams[0];
  const top2 = teams[1];
  const top3 = teams[2];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* BRAND HEADER & EVENT ANNOUNCEMENT BADGE */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6093C]/15 border border-[#E6093C]/40 text-[#FF3366] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#9E002B]/20">
          <Flame className="w-4 h-4 text-[#E6093C] animate-pulse" />
          <span>Casablanca Coastal Arena • Ain Diab Series</span>
        </div>
      </div>

      {/* BOLD HERO SECTION */}
      <section className="relative glass-panel p-6 sm:p-12 lg:p-16 overflow-hidden text-center sm:text-left border-[#E6093C]/30 shadow-2xl">
        {/* Extracted Instagram Red Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#9E002B]/35 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E6093C]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-transparent via-[#050507]/40 to-[#050507]/90 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-gray-200 text-xs font-semibold uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3366]" /> Official Fitness Tournament
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Compete for the <br />
              <span className="text-gradient-red">Fittest Team</span> <br />
              in Casablanca
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl font-bold text-[#E6093C] tracking-wide">
              Relay Races & Strength Challenges
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Assemble your roster of 4 athletes. Push your endurance, power through heavy sandbag relays, and conquer coastal strength challenges at Ain Diab.
            </p>

            {/* HIGH-CONTRAST CTA BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-bissap text-base sm:text-lg px-8 py-4 w-full sm:w-auto shadow-xl shadow-[#E6093C]/40 border border-white/20"
              >
                <Users className="w-5 h-5" />
                <span>Register Your Team</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <a 
                href="#standings"
                className="btn-secondary text-base px-6 py-4 w-full sm:w-auto text-center"
              >
                <Trophy className="w-5 h-5 text-[#FFB800]" />
                <span>View Standings</span>
              </a>
            </div>

            {/* Mobile Feature Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 text-center sm:text-left border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Roster</div>
                <div className="text-sm font-extrabold text-white mt-0.5">4 Athletes / Team</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Location</div>
                <div className="text-sm font-extrabold text-white mt-0.5">Ain Diab Beach</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Prize Pool</div>
                <div className="text-sm font-extrabold text-[#FFB800] mt-0.5">Trophy & Medals</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE COUNTDOWN & QUICK STATS */}
          <div className="lg:col-span-5 space-y-6 w-full">
            {/* Event Countdown Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14141C] to-[#0B0B10] border border-[#E6093C]/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FF3366] text-xs font-black uppercase tracking-wider">
                  <Timer className="w-4 h-4" /> Next Race Countdown
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  LIVE REGISTRATION
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Days</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Hours</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Mins</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-black text-[#FF3366]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Secs</div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full btn-bissap py-3 text-sm font-extrabold"
              >
                Claim Roster Spot Now
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#E6093C]/20 text-[#FF3366]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{teams.length}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Teams Registered</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FFB800]/20 text-[#FFB800]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{totalAthletes}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Athletes</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#9E002B]/30 text-[#FF3366]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{events.length}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Events</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{totalScores}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Scores Logged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGES SHOWCASE SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6093C]/20 text-[#FF3366] text-xs font-extrabold uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" /> Competition Format
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Relay Races & Strength Arena
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Every team competes across four intense disciplines designed to test endurance, power, strategy, and teamwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#E6093C]/60">
            <div className="w-12 h-12 rounded-xl bg-[#E6093C]/20 border border-[#E6093C]/40 flex items-center justify-center text-[#FF3366] font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="font-extrabold text-xl text-white">Sandbag Coastal Relay</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              4x400m sprint along Ain Diab sand dunes carrying 30kg/50kg sandbags. Seamless baton exchanges are critical.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#E6093C] uppercase tracking-wider">Speed & Work Capacity</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#E6093C]/60">
            <div className="w-12 h-12 rounded-xl bg-[#9E002B]/30 border border-[#9E002B]/60 flex items-center justify-center text-[#FF3366] font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="font-extrabold text-xl text-white">Max Barbell Ladder</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Ascending clean & jerk ladder. Accumulate maximum cumulative team tonnage within a strict 6-minute window.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#FFB800] uppercase tracking-wider">Raw Strength</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#E6093C]/60">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="font-extrabold text-xl text-white">Synchronized Rig WOD</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Sync pull-ups, kettlebell thrusters, and worm holds. Test synchronization and mental resilience under fatigue.
            </p>
            <div className="pt-2 text-[11px] font-bold text-gray-300 uppercase tracking-wider">Team Gymnastics</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#E6093C]/60">
            <div className="w-12 h-12 rounded-xl bg-[#E6093C]/20 border border-[#E6093C]/40 flex items-center justify-center text-[#FF3366] font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="font-extrabold text-xl text-white">Ocean Tug of War</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Head-to-head elimination bracket. Whole team pulls on heavy marine rope at the water edge for glory.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#FF3366] uppercase tracking-wider">Head-to-Head Finale</div>
          </div>
        </div>
      </section>

      {/* LIVE LEADERBOARD COMPONENT */}
      <section id="standings" className="space-y-6">
        <LiveLeaderboard />
      </section>

      {/* SCHEDULED EVENTS SECTION */}
      <section className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#E6093C]" /> Competition Schedule
            </h2>
            <p className="text-xs text-gray-400 mt-1">Official race timeline and team capacity limits.</p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">No events currently scheduled.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-[#E6093C]/50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#E6093C]/20 text-[#FF3366] text-xs font-bold border border-[#E6093C]/30">
                      Cap: {ev.maxTeams} Teams
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-white">{ev.name}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{ev.description || 'No description provided.'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>{ev.location || 'Ain Diab, Casablanca'}</span>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#FF3366] font-bold hover:underline"
                  >
                    Enter Team &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FINAL BOTTOM CALL TO ACTION BANNER */}
      <section className="glass-panel p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-r from-[#9E002B]/40 via-[#14141C] to-[#E6093C]/20 border-[#E6093C]/40">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Prove Your Team?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Register your team today, claim your spot in the Casablanca Series, and compete for the fittest team title.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-bissap text-lg px-10 py-4 shadow-2xl shadow-[#E6093C]/50 border border-white/20"
            >
              <Users className="w-6 h-6" />
              <span>Register Your Team Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#050507]/95 border-t border-white/10 backdrop-blur-md sm:hidden flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black text-white">Bissap Games 2026</div>
          <div className="text-[10px] text-gray-400">Compete in Casablanca</div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-bissap text-xs px-4 py-2.5 min-h-[40px] font-extrabold"
        >
          Register Team
        </button>
      </div>

            {/* TEAM REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <MultiStepTeamRegistration
              onSuccess={(data) => {
                // Add new team to local list preview
                setTeams((prev) => [
                  {
                    id: `temp-${Date.now()}`,
                    name: data.teamName,
                    totalPoints: 0,
                    captain: { name: data.captainName, email: data.captainEmail },
                  },
                  ...prev,
                ]);
              }}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
