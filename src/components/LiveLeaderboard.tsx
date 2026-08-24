'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  ArrowUpDown, 
  RefreshCw, 
  ChevronRight, 
  Users, 
  Crown,
  Medal,
  Award,
  Sparkles,
  MapPin,
  Zap,
  Info,
  X,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface LeaderboardTeam {
  id: string;
  name: string;
  captain?: { name: string; email: string } | null;
  totalPoints: number;
  athletes?: Array<{ id: string; name: string; email: string; role: string }>;
  scores?: Array<{ id: string; pointsAwarded: number; rank?: number | null; event: { name: string } }>;
}

interface LiveLeaderboardProps {
  teams?: LeaderboardTeam[];
  onRefresh?: () => void;
}

export default function LiveLeaderboard({ teams: propTeams, onRefresh }: LiveLeaderboardProps) {
  const { t } = useLanguage();
  const [teams, setTeams] = useState<LeaderboardTeam[]>(propTeams || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'totalPoints' | 'athletes' | 'name'>('totalPoints');
  const [selectedTeamModal, setSelectedTeamModal] = useState<LeaderboardTeam | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  useEffect(() => {
    if (propTeams) {
      setTeams(propTeams);
    }
  }, [propTeams]);

  // Live refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      try {
        const res = await fetch('/api/teams');
        if (res.ok) {
          const data = await res.json();
          setTeams(data);
        }
      } catch (err) {
        console.error('Failed to refresh leaderboard:', err);
      }
    }
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsRefreshing(false);
  };

  // Filtered & Sorted teams
  const filteredTeams = teams
    .filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.captain?.name && t.captain.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'athletes') return (b.athletes?.length || 0) - (a.athletes?.length || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.totalPoints - a.totalPoints;
    });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-white/10 bg-[#0B0B12]/80">
        {/* Glow ambient lights */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF1E56]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#9E002B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-live">
                <span className="pulse-dot" />
                LIVE SYNC ACTIVE
              </span>
              <span className="text-xs text-gray-400 font-mono">Synced {lastUpdated}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#F59E0B]" />
              <span>{t('leaderboardTitle')}</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              {t('leaderboardSubtitle')}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-[#FF1E56] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t('syncingDb') : t('btnRefreshLive')}</span>
          </button>
        </div>

        {/* SEARCH & SORT CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6 pt-6 border-t border-white/10">
          {/* Search Box */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E56] focus:ring-1 focus:ring-[#FF1E56] transition-all"
            />
          </div>

          {/* Sort Buttons */}
          <div className="sm:col-span-5 flex items-center justify-end gap-2">
            <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> {t('sortLabel')}
            </span>
            <button
              onClick={() => setSortBy('totalPoints')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                sortBy === 'totalPoints'
                  ? 'bg-gradient-to-r from-[#FF1E56] to-[#9E002B] text-white shadow-md shadow-[#FF1E56]/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {t('sortPoints')}
            </button>
            <button
              onClick={() => setSortBy('athletes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                sortBy === 'athletes'
                  ? 'bg-gradient-to-r from-[#FF1E56] to-[#9E002B] text-white shadow-md shadow-[#FF1E56]/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {t('sortRoster')}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block glass-panel p-6 border-white/10 bg-[#0B0B12]/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Team & Captain</th>
                <th className="py-3.5 px-4 text-center">Athletes</th>
                <th className="py-3.5 px-4 text-center">Completed Events</th>
                <th className="py-3.5 px-4 text-right">Total Points</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                    No matching teams found in leaderboard.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((t, idx) => (
                  <tr key={t.id} className="group transition-all hover:bg-white/5">
                    {/* Rank Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-lg ${
                            idx === 0
                              ? 'bg-gradient-to-tr from-[#F59E0B] to-[#FDE68A] text-black border border-[#F59E0B] shadow-[#F59E0B]/30'
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

                    {/* Team & Captain */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-base text-white group-hover:text-[#FF1E56] transition-colors flex items-center gap-2">
                          <span>{t.name}</span>
                          {idx === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-extrabold uppercase">
                              1st Place
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>Captain: <strong className="text-gray-200">{t.captain?.name || 'Unassigned'}</strong></span>
                        </div>
                      </div>
                    </td>

                    {/* Athletes Count */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs font-semibold text-gray-300 border border-white/10">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{t.athletes?.length || 0} Members</span>
                      </span>
                    </td>

                    {/* Completed Events */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 text-xs font-semibold text-gray-300 border border-white/10">
                        <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{t.scores?.length || 0} Events</span>
                      </span>
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-extrabold text-xl text-gradient-bissap font-mono">
                        {t.totalPoints} pts
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedTeamModal(t)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors border border-white/10 flex items-center gap-1 mx-auto"
                      >
                        <Info className="w-3.5 h-3.5 text-[#FF1E56]" />
                        <span>Roster</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {filteredTeams.map((t, idx) => (
          <div
            key={t.id}
            className={`glass-panel p-4 border-white/10 bg-[#0B0B12] space-y-3 relative overflow-hidden ${
              idx === 0 ? 'border-[#F59E0B]/40 bg-gradient-to-r from-[#F59E0B]/10 via-[#0B0B12] to-[#0B0B12]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                    idx === 0
                      ? 'bg-[#F59E0B] text-black font-extrabold'
                      : idx === 1
                      ? 'bg-slate-300 text-black font-extrabold'
                      : idx === 2
                      ? 'bg-amber-600 text-white font-extrabold'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  #{idx + 1}
                </span>

                <div>
                  <h4 className="font-bold text-base text-white">{t.name}</h4>
                  <p className="text-xs text-gray-400">Capt: {t.captain?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-gradient-bissap font-mono">{t.totalPoints} pts</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Total Score</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs text-gray-400">{t.athletes?.length || 0} Athletes</span>
              <button
                onClick={() => setSelectedTeamModal(t)}
                className="text-xs text-[#FF1E56] font-bold hover:underline flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TEAM ROSTER MODAL POPOVER */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel-elevated max-w-md w-full p-6 space-y-5 border-white/20 relative bg-[#0F0F1A]">
            <button
              onClick={() => setSelectedTeamModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF1E56]" />
                <h3 className="text-xl font-extrabold text-white">{selectedTeamModal.name}</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">Official registered athlete roster</p>
            </div>

            {/* Captain Info */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] font-bold uppercase text-[#F59E0B]">Team Captain</div>
              <div className="font-bold text-white text-sm">{selectedTeamModal.captain?.name || 'No Captain Assigned'}</div>
              <div className="text-xs text-gray-400">{selectedTeamModal.captain?.email}</div>
            </div>

            {/* Athlete Roster List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Roster Members</div>
              {!selectedTeamModal.athletes || selectedTeamModal.athletes.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No additional roster members added yet.</p>
              ) : (
                selectedTeamModal.athletes.map(a => (
                  <div key={a.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{a.name}</div>
                      <div className="text-[10px] text-gray-400">{a.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                      {a.role}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedTeamModal(null)}
              className="btn-secondary w-full text-xs py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
