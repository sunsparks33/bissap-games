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
  Zap,
  MapPin,
  UserCheck,
  Pencil,
  Trash2,
  X
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
  city?: string | null;
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

  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'captains' | 'athletes' | 'events' | 'scores'>('overview');
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Modals State
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingScore, setEditingScore] = useState<Score | null>(null);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamCaptainId, setTeamCaptainId] = useState('');

  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [captainTeamId, setCaptainTeamId] = useState('');
  
  const [assignTeamId, setAssignTeamId] = useState('');
  const [assignCaptainId, setAssignCaptainId] = useState('');

  const [athleteName, setAthleteName] = useState('');
  const [athleteEmail, setAthleteEmail] = useState('');
  const [athleteRole, setAthleteRole] = useState<'CAPTAIN' | 'MEMBER'>('MEMBER');
  const [athleteTeamId, setAthleteTeamId] = useState('');

  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMaxTeams, setEventMaxTeams] = useState('12');
  const [eventCity, setEventCity] = useState('Casablanca');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('Ain Diab, Casablanca');

  const [scoreTeamId, setScoreTeamId] = useState('');
  const [scoreEventId, setScoreEventId] = useState('');
  const [scorePoints, setScorePoints] = useState('');
  const [scoreRank, setScoreRank] = useState('');
  const [scoreNotes, setScoreNotes] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsAuthenticated(true);
      setPasscode('');
      fetchData();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid Admin Passcode. Access denied.');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- CREATE HANDLERS ---
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

  const handleCreateCaptain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captainName.trim() || !captainEmail.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: captainName.trim(),
          email: captainEmail.trim(),
          role: 'CAPTAIN',
          teamId: captainTeamId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register captain');

      showNotification('success', `Captain "${data.name}" created successfully!`);
      setCaptainName('');
      setCaptainEmail('');
      setCaptainTeamId('');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignCaptainToTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeamId || !assignCaptainId) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: assignTeamId,
          captainId: assignCaptainId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign captain');

      showNotification('success', `Captain assigned to team "${data.name}" successfully!`);
      setAssignTeamId('');
      setAssignCaptainId('');
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
          city: eventCity,
          date: eventDate,
          location: eventLocation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      showNotification('success', `Event "${data.name}" created successfully!`);
      setEventName('');
      setEventDesc('');
      setEventMaxTeams('12');
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

  // --- DELETE HANDLERS ---
  const handleDeleteTeam = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Team "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete team');
      showNotification('success', `Team "${name}" deleted.`);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteAthlete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Athlete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/athletes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete athlete');
      showNotification('success', `Athlete "${name}" deleted.`);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Event "${name}"?`)) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      showNotification('success', `Event "${name}" deleted.`);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteScore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score entry?')) return;
    try {
      const res = await fetch(`/api/scores?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete score');
      showNotification('success', 'Score entry deleted and team total points recalculated.');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // --- UPDATE SUBMIT HANDLERS ---
  const handleUpdateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    try {
      const res = await fetch('/api/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTeam.id,
          name: editingTeam.name,
          captainId: editingTeam.captainId || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to update team');
      showNotification('success', 'Team updated successfully.');
      setEditingTeam(null);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleUpdateAthleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAthlete) return;
    try {
      const res = await fetch('/api/athletes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAthlete.id,
          name: editingAthlete.name,
          email: editingAthlete.email,
          role: editingAthlete.role,
          teamId: editingAthlete.teamId || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to update athlete');
      showNotification('success', 'Athlete updated successfully.');
      setEditingAthlete(null);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleUpdateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          name: editingEvent.name,
          description: editingEvent.description,
          maxTeams: editingEvent.maxTeams,
          city: editingEvent.city,
          date: editingEvent.date,
          location: editingEvent.location,
        }),
      });
      if (!res.ok) throw new Error('Failed to update event');
      showNotification('success', 'Event updated successfully.');
      setEditingEvent(null);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleUpdateScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: editingScore.teamId,
          eventId: editingScore.eventId,
          pointsAwarded: editingScore.pointsAwarded,
          rank: editingScore.rank,
          notes: editingScore.notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to update score');
      showNotification('success', 'Score updated successfully.');
      setEditingScore(null);
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
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
                placeholder="Enter admin security passcode"
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

  const captainsList = athletes.filter(a => a.role === 'CAPTAIN');

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
              Full CRUD management: Create, Edit & Delete Teams, Captains, Athletes, Events, and Scores.
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
            { id: 'captains', label: 'Captains', icon: Crown, count: captainsList.length },
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

      {/* 1. TAB CONTENT: OVERVIEW */}
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
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Team Captains</span>
                <Crown className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{captainsList.length}</div>
              <p className="text-xs text-gray-400 mt-1">Assigned squad leaders</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Scheduled Events</span>
                <Calendar className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">{events.length}</div>
              <p className="text-xs text-gray-400 mt-1">Across 5 Cities</p>
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

      {/* 2. TAB CONTENT: TEAMS */}
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
                  <option value="">-- Select Registered Athlete / Captain --</option>
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email}) [{a.role}]
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
              {teams.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No teams registered yet.</div>
              ) : (
                teams.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-base">{t.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[#F59E0B] font-semibold">
                          <Crown className="w-3.5 h-3.5" /> {t.captain?.name || 'Unassigned Captain'}
                        </span>
                        <span>•</span>
                        <span>{t.athletes?.length || 0} Roster Members</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-extrabold text-lg text-gradient-bissap">{t.totalPoints} pts</div>
                      </div>
                      <button
                        onClick={() => setEditingTeam(t)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                        title="Edit Team"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(t.id, t.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Delete Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: CAPTAINS */}
      {activeTab === 'captains' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#F59E0B]" /> Add New Captain
              </h3>
              <form onSubmit={handleCreateCaptain} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Captain Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youssef El Mansouri"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Captain Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="captain@domain.ma"
                    value={captainEmail}
                    onChange={(e) => setCaptainEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Assign to Team (Optional)
                  </label>
                  <select
                    value={captainTeamId}
                    onChange={(e) => setCaptainTeamId(e.target.value)}
                    className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
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
                  className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] text-black font-extrabold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#F59E0B]/20"
                >
                  {submitting ? 'Creating...' : 'Register Captain'}
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#FF1E56]" /> Assign Captain to Team
              </h3>
              <form onSubmit={handleAssignCaptainToTeam} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Select Team *
                  </label>
                  <select
                    required
                    value={assignTeamId}
                    onChange={(e) => setAssignTeamId(e.target.value)}
                    className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF1E56]"
                  >
                    <option value="">-- Select Team --</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Capt: {t.captain?.name || 'None'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Select Captain *
                  </label>
                  <select
                    required
                    value={assignCaptainId}
                    onChange={(e) => setAssignCaptainId(e.target.value)}
                    className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF1E56]"
                  >
                    <option value="">-- Select Registered Athlete / Captain --</option>
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
                  className="btn-bissap w-full py-2 text-xs font-bold"
                >
                  Link Captain to Team
                </button>
              </form>
            </div>
          </div>

          <div className="glass-panel p-6 lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#F59E0B]" /> Team Captains ({captainsList.length})
            </h3>
            <div className="space-y-3">
              {captainsList.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No team captains registered yet.</div>
              ) : (
                captainsList.map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-bold uppercase">
                          CAPTAIN
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{c.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {c.team ? (
                        <div className="text-sm font-extrabold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                          {c.team.name}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Unassigned Squad</span>
                      )}
                      <button
                        onClick={() => setEditingAthlete(c)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                        title="Edit Captain"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAthlete(c.id, c.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Delete Captain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: ATHLETES */}
      {activeTab === 'athletes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-1 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#F59E0B]" /> Register Athlete
            </h3>
            <form onSubmit={handleCreateAthlete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youssef El Mansouri"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="athlete@domain.ma"
                  value={athleteEmail}
                  onChange={(e) => setAthleteEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  value={athleteRole}
                  onChange={(e) => setAthleteRole(e.target.value as any)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="CAPTAIN">Captain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Assign to Team (Optional)
                </label>
                <select
                  value={athleteTeamId}
                  onChange={(e) => setAthleteTeamId(e.target.value)}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
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
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] text-black font-extrabold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#F59E0B]/20"
              >
                {submitting ? 'Registering...' : 'Register Athlete'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#F59E0B]" /> Registered Athletes ({athletes.length})
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {athletes.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No athletes registered yet.</div>
              ) : (
                athletes.map(a => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{a.name}</div>
                      <div className="text-gray-400">{a.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.role === 'CAPTAIN' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' : 'bg-white/10 text-gray-300'}`}>
                        {a.role}
                      </span>
                      <span className="text-gray-300 font-semibold">{a.team?.name || 'Free Agent'}</span>
                      <button
                        onClick={() => setEditingAthlete(a)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 ml-2"
                        title="Edit Athlete"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAthlete(a.id, a.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Delete Athlete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-1 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF1E56]" /> Schedule Event
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ain Diab 5k Relay"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Relay rules, workout specs..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <select
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Rabat">Rabat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Max Teams *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventMaxTeams}
                    onChange={(e) => setEventMaxTeams(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Location Venue
                </label>
                <input
                  type="text"
                  placeholder="Ain Diab Beach, Casablanca"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-bissap w-full py-2.5 text-sm"
              >
                {submitting ? 'Scheduling...' : 'Schedule Event'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 lg:col-span-2">
            <h3 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#FF1E56]" /> Scheduled Events ({events.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-gray-500 text-sm">No events scheduled yet.</div>
              ) : (
                events.map((e) => (
                  <div key={e.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-base">{e.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF1E56]/20 text-[#FF1E56]">
                        {e.city || 'Casablanca'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{e.description || 'No description provided.'}</p>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>📍 {e.location || e.city}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEvent(e)}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                          title="Edit Event"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e.id, e.name)}
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: SCORES */}
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
                      {e.name} ({e.city || 'Casablanca'})
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
            <h3 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" /> Score Log History ({scores.length})
            </h3>
            <div className="space-y-3">
              {scores.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No scores recorded yet.</div>
              ) : (
                scores.map(s => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{s.team?.name}</div>
                      <div className="text-gray-400">{s.event?.name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right font-extrabold text-emerald-400 text-base">
                        +{s.pointsAwarded} pts
                      </div>
                      <button
                        onClick={() => setEditingScore(s)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                        title="Edit Score"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteScore(s.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Score"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODALS --- */}
      {/* 1. EDIT TEAM MODAL */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full p-6 space-y-4 bg-[#0F0F1A] border-white/20 relative">
            <button onClick={() => setEditingTeam(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-[#FF1E56]" /> Edit Team
            </h3>
            <form onSubmit={handleUpdateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Team Captain</label>
                <select
                  value={editingTeam.captainId || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, captainId: e.target.value })}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                >
                  <option value="">-- No Captain --</option>
                  {athletes.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingTeam(null)} className="btn-secondary flex-1 py-2 text-xs">Cancel</button>
                <button type="submit" className="btn-bissap flex-1 py-2 text-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT ATHLETE MODAL */}
      {editingAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full p-6 space-y-4 bg-[#0F0F1A] border-white/20 relative">
            <button onClick={() => setEditingAthlete(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-[#F59E0B]" /> Edit Athlete
            </h3>
            <form onSubmit={handleUpdateAthleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingAthlete.name}
                  onChange={(e) => setEditingAthlete({ ...editingAthlete, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingAthlete.email}
                  onChange={(e) => setEditingAthlete({ ...editingAthlete, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Role</label>
                <select
                  value={editingAthlete.role}
                  onChange={(e) => setEditingAthlete({ ...editingAthlete, role: e.target.value as any })}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="CAPTAIN">Captain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Assigned Team</label>
                <select
                  value={editingAthlete.teamId || ''}
                  onChange={(e) => setEditingAthlete({ ...editingAthlete, teamId: e.target.value })}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="">-- Free Agent (Unassigned) --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingAthlete(null)} className="btn-secondary flex-1 py-2 text-xs">Cancel</button>
                <button type="submit" className="w-full bg-[#F59E0B] text-black font-extrabold py-2 rounded-xl text-xs flex-1">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full p-6 space-y-4 bg-[#0F0F1A] border-white/20 relative">
            <button onClick={() => setEditingEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-[#FF1E56]" /> Edit Event
            </h3>
            <form onSubmit={handleUpdateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">City</label>
                <select
                  value={editingEvent.city || 'Casablanca'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                  className="w-full bg-[#12161F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Rabat">Rabat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Location Venue</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1E56]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingEvent(null)} className="btn-secondary flex-1 py-2 text-xs">Cancel</button>
                <button type="submit" className="btn-bissap flex-1 py-2 text-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT SCORE MODAL */}
      {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full p-6 space-y-4 bg-[#0F0F1A] border-white/20 relative">
            <button onClick={() => setEditingScore(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-emerald-400" /> Edit Score
            </h3>
            <form onSubmit={handleUpdateScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Points Awarded</label>
                <input
                  type="number"
                  required
                  value={editingScore.pointsAwarded}
                  onChange={(e) => setEditingScore({ ...editingScore, pointsAwarded: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Performance Notes</label>
                <input
                  type="text"
                  value={editingScore.notes || ''}
                  onChange={(e) => setEditingScore({ ...editingScore, notes: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingScore(null)} className="btn-secondary flex-1 py-2 text-xs">Cancel</button>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 rounded-xl text-xs flex-1">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
