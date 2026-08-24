'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Crown, 
  Sparkles, 
  Zap, 
  ArrowUpDown, 
  RefreshCw, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  Medal,
  Award
} from 'lucide-react';

export interface LeaderboardTeam {
  id: string;
  name: string;
  captain: string;
  membersCount: number;
  beachRelayScore: number; // points in Beach Relay
  sandbagCarryScore: number; // points in Sandbag Carry
  totalPoints: number;
  trend: 'up' | 'down' | 'same';
}

const INITIAL_MOCK_TEAMS: LeaderboardTeam[] = [
  {
    id: 'team-1',
    name: 'Atlas Titans',
    captain: 'Youssef El Mansouri',
    membersCount: 4,
    beachRelayScore: 95,
    sandbagCarryScore: 100,
    totalPoints: 195,
    trend: 'up',
  },
  {
    id: 'team-2',
    name: 'Ain Diab Warriors',
    captain: 'Sarah Benali',
    membersCount: 4,
    beachRelayScore: 100,
    sandbagCarryScore: 88,
    totalPoints: 188,
    trend: 'same',
  },
  {
    id: 'team-3',
    name: 'Casa Barbell Club',
    captain: 'Karim Tazi',
    membersCount: 4,
    beachRelayScore: 82,
    sandbagCarryScore: 92,
    totalPoints: 174,
    trend: 'up',
  },
  {
    id: 'team-4',
    name: 'Anfa Apex Squad',
    captain: 'Lina Amrani',
    membersCount: 4,
    beachRelayScore: 88,
    sandbagCarryScore: 80,
    totalPoints: 168,
    trend: 'down',
  },
  {
    id: 'team-5',
    name: 'Corniche Spartans',
    captain: 'Omar Chraibi',
    membersCount: 4,
    beachRelayScore: 75,
    sandbagCarryScore: 85,
    totalPoints: 160,
    trend: 'up',
  },
];

export default function LiveLeaderboard() {
  const [teams, setTeams] = useState<LeaderboardTeam[]>(INITIAL_MOCK_TEAMS);
  const [filter, setFilter] = useState<'overall' | 'beachRelay' | 'sandbagCarry'>('overall');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [loaded, setLoaded] = useState(false);

  // Mount animation trigger
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Sort teams based on selected tab filter
  const sortedTeams = [...teams].sort((a, b) => {
    if (filter === 'beachRelay') return b.beachRelayScore - a.beachRelayScore;
    if (filter === 'sandbagCarry') return b.sandbagCarryScore - a.sandbagCarryScore;
    return b.totalPoints - a.totalPoints;
  });

  // Mock live update refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate minor live scoring updates
      setTeams(prev =>
        prev.map(team => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const newSandbag = Math.max(70, team.sandbagCarryScore + delta);
          return {
            ...team,
            sandbagCarryScore: newSandbag,
            totalPoints: team.beachRelayScore + newSandbag,
          };
        })
      );
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-[#E6093C]/40 bg-[#0D0D12]">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#E6093C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#9E002B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                LIVE COMPETITION FEED
              </span>
              <span className="text-xs text-gray-400 font-mono">Updated {lastUpdated}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Live Tournament Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Real-time score standings tracking Casablanca's top 5 squads across <strong>Beach Relay</strong> and <strong>Sandbag Carry</strong>.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF3366] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing Live Scores...' : 'Refresh Standings'}</span>
          </button>
        </div>

        {/* FILTER & SORT TAB BAR */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <span className="text-xs font-extrabold uppercase text-gray-400 mr-2 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Event Filter:
          </span>

          <button
            onClick={() => setFilter('overall')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all min-h-[40px] ${
              filter === 'overall'
                ? 'bg-gradient-to-r from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/30 border border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            🏆 Overall Points
          </button>

          <button
            onClick={() => setFilter('beachRelay')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all min-h-[40px] ${
              filter === 'beachRelay'
                ? 'bg-gradient-to-r from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/30 border border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            🌊 Event 1: Beach Relay
          </button>

          <button
            onClick={() => setFilter('sandbagCarry')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all min-h-[40px] ${
              filter === 'sandbagCarry'
                ? 'bg-gradient-to-r from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/30 border border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            🏋️ Event 2: Sandbag Carry
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (md and above) */}
      <div className="hidden md:block glass-panel p-6 border-[#E6093C]/30 bg-[#0D0D12] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase font-extrabold text-gray-400 tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Team & Captain</th>
                <th className="py-3 px-4 text-center">Beach Relay</th>
                <th className="py-3 px-4 text-center">Sandbag Carry</th>
                <th className="py-3 px-4 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedTeams.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`group transition-all hover:bg-white/5 ${
                    loaded ? 'animate-in fade-in slide-in-from-bottom-2' : ''
                  }`}
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {/* Rank Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${
                          idx === 0
                            ? 'bg-gradient-to-tr from-[#FFB800] to-[#FFE066] text-black border border-[#FFB800]/80 shadow-[#FFB800]/30'
                            : idx === 1
                            ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black border border-slate-300'
                            : idx === 2
                            ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border border-amber-600'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {idx === 0 ? <Crown className="w-5 h-5 text-black" /> : `#${idx + 1}`}
                      </span>
                    </div>
                  </td>

                  {/* Team Name & Captain */}
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-extrabold text-base text-white group-hover:text-[#FF3366] transition-colors flex items-center gap-2">
                        <span>{t.name}</span>
                        {idx === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 font-bold uppercase">
                            Leader
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>Captain: <strong className="text-gray-300">{t.captain}</strong></span>
                        <span>•</span>
                        <span>{t.membersCount} Athletes</span>
                      </div>
                    </div>
                  </td>

                  {/* Beach Relay Score */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black font-mono ${
                      filter === 'beachRelay' ? 'bg-[#E6093C]/20 text-[#FF3366] border border-[#E6093C]/40' : 'bg-white/5 text-gray-300'
                    }`}>
                      {t.beachRelayScore} pts
                    </span>
                  </td>

                  {/* Sandbag Carry Score */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black font-mono ${
                      filter === 'sandbagCarry' ? 'bg-[#E6093C]/20 text-[#FF3366] border border-[#E6093C]/40' : 'bg-white/5 text-gray-300'
                    }`}>
                      {t.sandbagCarryScore} pts
                    </span>
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 text-right">
                    <div className="font-black text-xl text-gradient-red font-mono">
                      {t.totalPoints} pts
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST CARD VIEW (below md) */}
      <div className="block md:hidden space-y-3">
        {sortedTeams.map((t, idx) => (
          <div
            key={t.id}
            className={`glass-panel p-4 border-white/10 bg-[#0D0D12] space-y-3 relative overflow-hidden ${
              idx === 0 ? 'border-[#FFB800]/50 bg-gradient-to-r from-[#FFB800]/10 via-[#0D0D12] to-[#0D0D12]' : ''
            } ${loaded ? 'animate-in fade-in slide-in-from-bottom-3' : ''}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    idx === 0
                      ? 'bg-[#FFB800] text-black font-black'
                      : idx === 1
                      ? 'bg-slate-300 text-black font-black'
                      : idx === 2
                      ? 'bg-amber-600 text-white font-black'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  #{idx + 1}
                </span>

                <div>
                  <h4 className="font-extrabold text-base text-white">{t.name}</h4>
                  <p className="text-xs text-gray-400">Capt: {t.captain}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-gradient-red font-mono">{t.totalPoints} pts</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Total Score</div>
              </div>
            </div>

            {/* Scores breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-gray-400 font-extrabold uppercase">🌊 Beach Relay</div>
                <div className="text-sm font-black text-white mt-0.5">{t.beachRelayScore} pts</div>
              </div>

              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-gray-400 font-extrabold uppercase">🏋️ Sandbag Carry</div>
                <div className="text-sm font-black text-white mt-0.5">{t.sandbagCarryScore} pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
