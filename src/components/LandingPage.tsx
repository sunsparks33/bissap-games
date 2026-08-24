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
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import MultiStepTeamRegistration, { TeamRegistrationFormData } from './MultiStepTeamRegistration';
import LiveLeaderboard, { LeaderboardTeam } from './LiveLeaderboard';

import Image from 'next/image';

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
  initialTeams: LeaderboardTeam[];
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
  const [teams, setTeams] = useState<LeaderboardTeam[]>(initialTeams);
  const [events] = useState<EventItem[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 14, minutes: 28, seconds: 45 });

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

  const handleRegistrationSuccess = async (formData: TeamRegistrationFormData) => {
    try {
      // Create team with Captain
      const teamRes = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.teamName }),
      });

      if (!teamRes.ok) throw new Error('Failed to register team');
      const newTeam = await teamRes.json();

      // Create Captain Athlete
      const captainRes = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.captainName,
          email: formData.captainEmail,
          role: 'CAPTAIN',
          teamId: newTeam.id,
        }),
      });

      const captainData = await captainRes.json();

      // Create additional roster members if provided
      if (formData.members && formData.members.length > 0) {
        for (const member of formData.members) {
          if (member.name && member.email) {
            await fetch('/api/athletes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: member.name,
                email: member.email,
                role: 'MEMBER',
                teamId: newTeam.id,
              }),
            });
          }
        }
      }

      // Refresh team data
      const refreshRes = await fetch('/api/teams');
      if (refreshRes.ok) {
        const updatedTeams = await refreshRes.json();
        setTeams(updatedTeams);
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Registration processing error:', err);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* BRAND ANNOUNCEMENT BADGE */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-[#FF1E56] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xl shadow-[#FF1E56]/10 backdrop-blur-md">
          <img 
            src="/logo.png" 
            alt="Bissap Games Logo" 
            className="w-6 h-6 rounded-full object-contain bg-[#FAF8F5] p-0.5 border border-[#FF1E56]/40" 
          />
          <span>Morocco National Tour • Casablanca • Marrakech • Tangier • Agadir • Rabat</span>
        </div>
      </div>

      {/* BOLD HERO SECTION */}
      <section className="relative glass-panel-elevated p-6 sm:p-12 lg:p-16 overflow-hidden border-white/10 shadow-2xl bg-[#090912]/90">
        {/* Glow Ambient Lights */}
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-[#FF1E56]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-[#9E002B]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-gray-300 text-xs font-semibold uppercase tracking-wider border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1E56]" /> National Fitness Championship
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06]">
              Compete for the <br />
              <span className="text-gradient-bissap">Fittest Team</span> <br />
              in Morocco
            </h1>

            <p className="text-[#FF1E56] font-bold text-lg sm:text-xl tracking-wide">
              Relay Races & High-Intensity Strength Challenges Across 5 Cities
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Assemble your roster of 4 athletes. Push your endurance, power through heavy sandbag relays, and conquer coastal & mountain strength challenges across Casablanca, Marrakech, Tangier, Agadir, and Rabat.
            </p>

            {/* CTA BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-bissap text-base sm:text-lg px-8 py-4 w-full sm:w-auto shadow-xl shadow-[#FF1E56]/30 border border-white/20"
              >
                <Users className="w-5 h-5" />
                <span>Register Your Team</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <a 
                href="#standings"
                className="btn-secondary text-base px-6 py-4 w-full sm:w-auto text-center"
              >
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <span>View Standings</span>
              </a>
            </div>

            {/* Feature Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 text-center sm:text-left border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Roster</div>
                <div className="text-sm font-extrabold text-white mt-0.5">4 Athletes / Squad</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Tour Scope</div>
                <div className="text-sm font-extrabold text-white mt-0.5">5 Moroccan Cities</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase">Prize Pool</div>
                <div className="text-sm font-extrabold text-[#F59E0B] mt-0.5">National Trophy</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: COUNTDOWN & QUICK STATS */}
          <div className="lg:col-span-5 space-y-6 w-full">
            {/* Event Countdown Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FF1E56] text-xs font-extrabold uppercase tracking-wider">
                  <Timer className="w-4 h-4" /> Championship Countdown
                </div>
                <span className="badge-live">
                  REGISTRATION OPEN
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Days</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Hours</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Mins</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FF1E56]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">Secs</div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full btn-bissap py-3 text-sm font-bold"
              >
                Secure Roster Entry
              </button>
            </div>

            {/* Quick Stats Tickers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FF1E56]/20 text-[#FF1E56]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{teams.length}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Teams</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{totalAthletes || teams.length * 4}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Athletes</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#9E002B]/30 text-[#FF1E56]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{events.length || 3}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Events</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{totalScores || 15}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Scores Logged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCIPLINARY CHALLENGES SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E56]/15 text-[#FF1E56] text-xs font-bold uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" /> Event Disciplines
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Relay Races & Strength Arena
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Every team competes across four intense disciplines designed to test endurance, power, strategy, and teamwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#FF1E56]/50">
            <div className="w-12 h-12 rounded-xl bg-[#FF1E56]/20 border border-[#FF1E56]/40 flex items-center justify-center text-[#FF1E56] font-extrabold text-xl mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="font-extrabold text-xl text-white">Sandbag Coastal Relay</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              4x400m sprint along Ain Diab sand dunes carrying 30kg/50kg sandbags. Seamless baton exchanges are critical.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#FF1E56] uppercase tracking-wider">Endurance & Power</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#FF1E56]/50">
            <div className="w-12 h-12 rounded-xl bg-[#9E002B]/30 border border-[#9E002B]/60 flex items-center justify-center text-[#FF1E56] font-extrabold text-xl mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="font-extrabold text-xl text-white">Max Barbell Ladder</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Ascending clean & jerk ladder. Accumulate maximum cumulative team tonnage within a strict 6-minute window.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">Raw Heavy Strength</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#FF1E56]/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-xl mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="font-extrabold text-xl text-white">Ocean Sync Pull</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              4-person synchronous sled drag & kettlebell lunges across ocean tide lines. Rhythmic coordination wins.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Team Synchronization</div>
          </div>

          <div className="glass-panel p-6 space-y-3 relative overflow-hidden group border-white/10 hover:border-[#FF1E56]/50">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-extrabold text-xl mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="font-extrabold text-xl text-white">Championship Sprint</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              The top 5 teams face off in the grand final relay sprint to claim the Bissap Games trophy and medals.
            </p>
            <div className="pt-2 text-[11px] font-bold text-purple-400 uppercase tracking-wider">Grand Finale</div>
          </div>
        </div>
      </section>

      {/* LIVE LEADERBOARD COMPONENT SECTION */}
      <section id="standings" className="pt-4">
        <LiveLeaderboard teams={teams} onRefresh={async () => {
          const res = await fetch('/api/teams');
          if (res.ok) {
            const data = await res.json();
            setTeams(data);
          }
        }} />
      </section>

      {/* REGISTRATION MODAL WIZARD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <MultiStepTeamRegistration
              onSuccess={handleRegistrationSuccess}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
