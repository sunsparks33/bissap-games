'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Calendar, 
  Award, 
  Plus, 
  UserPlus, 
  Flag, 
  Medal, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Crown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  email: string;
  role: 'CAPTAIN' | 'MEMBER';
  teamId?: string | null;
  team?: { name: string } | null;
}

interface Team {
  id: string;
  name: string;
  totalPoints: number;
  captainId?: string | null;
  captain?: Athlete | null;
  athletes?: Athlete[];
}

interface Event {
  id: string;
  name: string;
  description?: string;
  maxTeams: number;
  date: string;
  location?: string;
  scores?: any[];
}

interface Score {
  id: string;
  teamId: string;
  eventId: string;
  pointsAwarded: number;
  rank?: number;
  notes?: string;
  team: Team;
  event: Event;
}

export default function ManagerPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'athletes' | 'events' | 'scores'>('overview');
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  // 1. Team form
  const [teamName, setTeamName] = useState('');
  const [teamCaptainId, setTeamCaptainId] = useState('');

  // 2. Athlete form
  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [athleteRole, setAthleteRole] = useState<'CAPTAIN' | 'MEMBER'>('MEMBER');
  const [athleteTeamId, setAthleteTeamId] = useState('');

  // 3. Event form
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMaxTeams, setEventMaxTeams] = useState('10');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('Ain Diab, Casablanca');

  // 4. Score form
  const [scoreTeamId, setScoreTeamId] = useState('');
  const [scoreEventId, setScoreEventId] = useState('');
  const [scorePoints, setScorePoints] = useState('');
  const [scoreRank, setScoreRank] = useState('');
  const [scoreNotes, setScoreNotes] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, athletesRes, eventsRes, scoresRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/athletes'),
        fetch('/api/events'),
        fetch('/api/scores'),
      ]);

      const [teamsData, athletesData, eventsData, scoresData] = await Promise.all([
        teamsRes.json(),
        athletesRes.json(),
        eventsRes.json(),
        scoresRes.json(),
      ]);

      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setAthletes(Array.isArray(athletesData) ? athletesData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setScores(Array.isArray(scoresData) ? scoresData : []);
    } catch (err) {
      console.error('Failed to load manager data', err);
      showNotification('error', 'Failed to fetch manager data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Submit Handlers
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim(), captainId: teamCaptainId || null }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create team');

      showNotification('success', `Team "${data.name}" registered successfully!`);
      setTeamName('');
      setTeamCaptainId('');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAthlete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim() || !athleteEmail.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: athleteName.trim(),
          email: athleteEmail.trim(),
          role: athleteRole,
          teamId: athleteTeamId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register athlete');

      showNotification('success', `Athlete "${data.name}" registered successfully!`);
      setAthleteName('');
      setAthleteEmail('');
      setAthleteRole('MEMBER');
      setAthleteTeamId('');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate || !eventMaxTeams) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventName.trim(),
          description: eventDesc.trim(),
          maxTeams: parseInt(eventMaxTeams, 10),
          date: eventDate,
          location: eventLocation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      showNotification('success', `Event "${data.name}" created successfully!`);
      setEventName('');
      setEventDesc('');
      setEventMaxTeams('10');
      setEventDate('');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreTeamId || !scoreEventId || !scorePoints) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: scoreTeamId,
          eventId: scoreEventId,
          pointsAwarded: parseInt(scorePoints, 10),
          rank: scoreRank ? parseInt(scoreRank, 10) : null,
          notes: scoreNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record score');

      showNotification('success', `Points awarded successfully! Team total points recalculated.`);
      setScoreTeamId('');
      setScoreEventId('');
      setScorePoints('');
      setScoreRank('');
      setScoreNotes('');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#E60049]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60049]/20 border border-[#E60049]/40 text-[#FF3370] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Official Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Manager Panel
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Register teams, athletes, schedule relay & strength events, and record live scoring.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Trophy },
            { id: 'teams', label: 'Teams', icon: Users, count: teams.length },
            { id: 'athletes', label: 'Athletes', icon: UserPlus, count: athletes.length },
            { id: 'events', label: 'Events', icon: Calendar, count: events.length },
            { id: 'scores', label: 'Score & Standings', icon: Medal, count: scores.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E60049] to-[#C0003A] text-white shadow-lg shadow-[#E60049]/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF3370]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Registered Teams</span>
                <Users className="w-5 h-5 text-[#FF3370]" />
              </div>
              <div className="text-3xl font-black text-white mt-3">{teams.length}</div>
              <p className="text-xs text-gray-400 mt-1">Ready for challenge</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Athletes</span>
                <UserPlus className="w-5 h-5 text-[#8B00FF]" />
              </div>
              <div className="text-3xl font-black text-white mt-3">{athletes.length}</div>
              <p className="text-xs text-gray-400 mt-1">{athletes.filter(a => a.role === 'CAPTAIN').length} Team Captains</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Scheduled Events</span>
                <Calendar className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div className="text-3xl font-black text-white mt-3">{events.length}</div>
              <p className="text-xs text-gray-400 mt-1">Relays & Strength Challenges</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Scores Logged</span>
                <Medal className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white mt-3">{scores.length}</div>
              <p className="text-xs text-gray-400 mt-1">Total points computed</p>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Leaderboard Snapshot */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FFB800]" /> Current Top Standings
                </h3>
                <button 
                  onClick={() => setActiveTab('teams')}
                  className="text-xs text-[#FF3370] hover:underline font-semibold flex items-center gap-1"
                >
                  Manage Teams <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {teams.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No teams registered yet.</div>
              ) : (
                <div className="space-y-3">
                  {teams.slice(0, 4).map((t, idx) => (
                    <div 
                      key={t.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm ${
                          idx === 0 ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40' :
                          idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40' :
                          idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                          'bg-white/5 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{t.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            {t.captain ? (
                              <span className="flex items-center gap-1 text-gray-300">
                                <Crown className="w-3 h-3 text-[#FFB800]" /> {t.captain.name}
                              </span>
                            ) : (
                              <span className="text-gray-500 italic">No captain assigned</span>
                            )}
                            <span>•</span>
                            <span>{t.athletes?.length || 0} members</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg text-gradient-bissap">{t.totalPoints} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Events */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Flag className="w-5 h-5 text-[#E60049]" /> Scheduled Fitness Events
                </h3>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="text-xs text-[#FF3370] hover:underline font-semibold flex items-center gap-1"
                >
                  Manage Events <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {events.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No events scheduled.</div>
              ) : (
                <div className="space-y-3">
                  {events.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{e.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#E60049]/20 text-[#FF3370] font-semibold">
                          Max {e.maxTeams} Teams
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{e.description || 'No description'}</p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs text-gray-500">
                        <span>📅 {new Date(e.date).toLocaleDateString()}</span>
                        <span>📍 {e.location || 'Ain Diab'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Team Form */}
          <div className="glass-panel p-6 lg:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E60049]" /> Register New Team
            </h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlas Titans"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E60049]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Assign Captain (Optional)
                </label>
                <select
                  value={teamCaptainId}
                  onChange={(e) => setTeamCaptainId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E60049]"
                >
                  <option value="">-- Select Registered Athlete --</option>
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-bissap w-full py-2.5 text-sm mt-2"
              >
                {submitting ? 'Creating...' : 'Register Team'}
              </button>
            </form>
          </div>

          {/* Teams Table */}
          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF3370]" /> Registered Teams ({teams.length})
            </h3>

            {teams.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No teams registered. Use the form to register your first team.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Captain</th>
                      <th>Athletes</th>
                      <th>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="font-bold text-white text-sm">{t.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {t.id}</div>
                        </td>
                        <td>
                          {t.captain ? (
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-200">
                              <Crown className="w-3.5 h-3.5 text-[#FFB800]" />
                              <span>{t.captain.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
                            {t.athletes?.length || 0} members
                          </span>
                        </td>
                        <td>
                          <span className="font-extrabold text-base text-[#FF3370]">
                            {t.totalPoints} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. ATHLETES */}
      {activeTab === 'athletes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Athlete Form */}
          <div className="glass-panel p-6 lg:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#8B00FF]" /> Register Athlete
            </h3>
            <form onSubmit={handleCreateAthlete} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youssef El Mansouri"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8B00FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="athlete@domain.ma"
                  value={athleteEmail}
                  onChange={(e) => setAthleteEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8B00FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  value={athleteRole}
                  onChange={(e) => setAthleteRole(e.target.value as any)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B00FF]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="CAPTAIN">Captain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Assign to Team (Optional)
                </label>
                <select
                  value={athleteTeamId}
                  onChange={(e) => setAthleteTeamId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B00FF]"
                >
                  <option value="">-- Select Team --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#8B00FF] to-[#6A00C8] hover:from-[#9D1aff] hover:to-[#7B00E0] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#8B00FF]/25"
              >
                {submitting ? 'Registering...' : 'Register Athlete'}
              </button>
            </form>
          </div>

          {/* Athletes Table */}
          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8B00FF]" /> Registered Athletes ({athletes.length})
            </h3>

            {athletes.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No athletes registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Athlete</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Assigned Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athletes.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <div className="font-bold text-white text-sm">{a.name}</div>
                        </td>
                        <td>
                          <span className="text-xs text-gray-400">{a.email}</span>
                        </td>
                        <td>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              a.role === 'CAPTAIN'
                                ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30'
                                : 'bg-white/10 text-gray-300'
                            }`}
                          >
                            {a.role}
                          </span>
                        </td>
                        <td>
                          {a.team ? (
                            <span className="text-sm font-semibold text-white">{a.team.name}</span>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Free Agent</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Event Form */}
          <div className="glass-panel p-6 lg:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FFB800]" /> Schedule Event
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ain Diab 5k Relay"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Relay rules, workout specs..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Max Teams *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventMaxTeams}
                    onChange={(e) => setEventMaxTeams(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Ain Diab, Casablanca"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#FFB800] to-[#E69000] hover:from-[#FFC426] text-black font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#FFB800]/20"
              >
                {submitting ? 'Scheduling...' : 'Schedule Event'}
              </button>
            </form>
          </div>

          {/* Events Grid */}
          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#FFB800]" /> Scheduled Events ({events.length})
            </h3>

            {events.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No events scheduled. Create your first event using the form.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((e) => (
                  <div key={e.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-white">{e.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] font-bold border border-[#FFB800]/30">
                          Max {e.maxTeams} Teams
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mb-3">{e.description || 'No description provided.'}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-semibold text-gray-200">{new Date(e.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-semibold text-gray-200">{e.location || 'Ain Diab'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scores Logged:</span>
                        <span className="font-bold text-[#FF3370]">{e.scores?.length || 0} teams</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. SCORES & STANDINGS */}
      {activeTab === 'scores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Award / Update Score Form */}
          <div className="glass-panel p-6 lg:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-emerald-400" /> Award Team Points
            </h3>
            <form onSubmit={handleRecordScore} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Select Team *
                </label>
                <select
                  required
                  value={scoreTeamId}
                  onChange={(e) => setScoreTeamId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="">-- Choose Team --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Current: {t.totalPoints} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Select Event *
                </label>
                <select
                  required
                  value={scoreEventId}
                  onChange={(e) => setScoreEventId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="">-- Choose Event --</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Points *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={scorePoints}
                    onChange={(e) => setScorePoints(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Rank Place
                  </label>
                  <input
                    type="number"
                    placeholder="1, 2, 3..."
                    value={scoreRank}
                    onChange={(e) => setScoreRank(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Performance Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18m 42s finish, 1420kg total load"
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25"
              >
                {submitting ? 'Recording...' : 'Submit Points'}
              </button>
            </form>
          </div>

          {/* Scores History Table */}
          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" /> Recorded Event Scores ({scores.length})
            </h3>

            {scores.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No scores recorded yet. Award points using the form.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Event</th>
                      <th>Rank</th>
                      <th>Points</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="font-bold text-white text-sm">{s.team?.name}</div>
                        </td>
                        <td>
                          <div className="text-xs font-medium text-gray-300">{s.event?.name}</div>
                        </td>
                        <td>
                          {s.rank ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/10 text-white">
                              #{s.rank}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </td>
                        <td>
                          <span className="font-extrabold text-sm text-emerald-400">
                            +{s.pointsAwarded} pts
                          </span>
                        </td>
                        <td>
                          <span className="text-xs text-gray-400">{s.notes || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
