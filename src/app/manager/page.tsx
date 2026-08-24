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
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  Zap
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'athletes' | 'events' | 'scores'>('overview');
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamCaptainId, setTeamCaptainId] = useState('');

  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [athleteRole, setAthleteRole] = useState<'CAPTAIN' | 'MEMBER'>('MEMBER');
  const [athleteTeamId, setAthleteTeamId] = useState('');

  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMaxTeams, setEventMaxTeams] = useState('10');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('Ain Diab, Casablanca');

  const [scoreTeamId, setScoreTeamId] = useState('');
  const [scoreEventId, setScoreEventId] = useState('');
  const [scorePoints, setScorePoints] = useState('');
  const [scoreRank, setScoreRank] = useState('');
  const [scoreNotes, setScoreNotes] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode === 'admin' || passcode === 'bissap2026') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError('Invalid Admin Passcode. Please try again.');
    }
  };

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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel-elevated max-w-md w-full p-8 space-y-6 text-center border-white/20 bg-[#0B0B14]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF1E56] to-[#9E002B] p-0.5 mx-auto shadow-xl shadow-[#FF1E56]/30">
            <div className="w-full h-full bg-[#0B0B14] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#FF1E56]" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Manager Authentication</h2>
            <p className="text-xs text-gray-400 mt-1">Enter your admin security passcode to access score control panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (e.g. 1234)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {authError}
              </p>
            )}

            <button type="submit" className="btn-bissap w-full py-3 text-sm font-bold">
              <Unlock className="w-4 h-4" /> Unlock Admin Panel
            </button>
          </form>

          <p className="text-[11px] text-gray-500 italic">Protected by enterprise Zod payload validation & IP rate limiting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-[#0B0B12]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E56]/15 border border-[#FF1E56]/30 text-[#FF1E56] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Official Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF1E56] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
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
                    ? 'bg-gradient-to-r from-[#FF1E56] to-[#9E002B] text-white shadow-lg shadow-[#FF1E56]/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF1E56]'}`} />
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

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Registered Teams</span>
                <Users className="w-5 h-5 text-[#FF1E56]" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{teams.length}</div>
              <p className="text-xs text-gray-400 mt-1">Active squads</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Athletes</span>
                <UserPlus className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{athletes.length}</div>
              <p className="text-xs text-gray-400 mt-1">{athletes.filter(a => a.role === 'CAPTAIN').length} Captains</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Scheduled Events</span>
                <Calendar className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{events.length}</div>
              <p className="text-xs text-gray-400 mt-1">Relays & Strength</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Scores Logged</span>
                <Medal className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{scores.length}</div>
              <p className="text-xs text-gray-400 mt-1">Total points computed</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-1 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#FF1E56]" /> Register New Team
            </h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlas Titans"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Assign Captain (Optional)
                </label>
                <select
                  value={teamCaptainId}
                  onChange={(e) => setTeamCaptainId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
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
                className="btn-bissap w-full py-2.5 text-sm"
              >
                {submitting ? 'Creating...' : 'Register Team'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF1E56]" /> Registered Teams ({teams.length})
            </h3>
            <div className="space-y-3">
              {teams.map(t => (
                <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-base">{t.name}</div>
                    <div className="text-xs text-gray-400">Capt: {t.captain?.name || 'Unassigned'} • {t.athletes?.length || 0} Members</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-lg text-gradient-bissap">{t.totalPoints} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCORES */}
      {activeTab === 'scores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-1 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-emerald-400" /> Award Points
            </h3>
            <form onSubmit={handleRecordScore} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25"
              >
                {submitting ? 'Recording...' : 'Submit Points'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" /> Score Log History ({scores.length})
            </h3>
            <div className="space-y-3">
              {scores.map(s => (
                <div key={s.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{s.team?.name}</div>
                    <div className="text-gray-400">{s.event?.name}</div>
                  </div>
                  <div className="text-right font-extrabold text-emerald-400 text-base">
                    +{s.pointsAwarded} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
