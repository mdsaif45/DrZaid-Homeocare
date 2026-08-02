import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import patientService, { AnalyticsData } from '../../services/patientService';
import prescriptionService from '../../services/prescriptionService';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp, Stethoscope, Pill, Plus, Search, Activity, Clock, CalendarDays, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChartCard } from '../../components/ui/ChartCard';
import { OverviewCard, OverviewItem } from '../../components/ui/OverviewCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { stats, fetchStats } = usePatientStore();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visits: [],
    topRemedies: [],
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [visitTimeframe, setVisitTimeframe] = useState('This Year');
  const [remedyTimeframe, setRemedyTimeframe] = useState('This Year');

  const [upcomingFollowUps, setUpcomingFollowUps] = useState<number>(0);

  const loadAnalytics = useCallback(async (timeframe: string) => {
    setIsLoadingAnalytics(true);
    try {
      const data = await patientService.getAnalytics(timeframe);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    loadAnalytics(visitTimeframe);

    prescriptionService
      .getUpcomingFollowUps(7)
      .then((items) => setUpcomingFollowUps(items.length))
      .catch(() => setUpcomingFollowUps(0));
  }, [fetchStats, loadAnalytics, visitTimeframe]);

  const firstName = user?.full_name?.split(' ').slice(-1)[0] ?? 'Doctor';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-8 shadow-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-xs sm:text-sm font-semibold text-emerald-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="mb-2 text-2xl font-extrabold text-white sm:text-3xl flex items-center gap-2">
              Good {getGreeting()}, Dr. {firstName} <span className="animate-bounce inline-block">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Here's a summary of your homeopathic practice today.</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/patients/new')}
            variant="primary"
            size="lg"
            className="whitespace-nowrap shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Patient
          </Button>
        </div>
      </div>

      {/* KPI Counting Cards (Exactly matching Mock Image 2 layout) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Patients', value: stats?.total ?? 0, icon: <Users className="h-5 w-5 text-emerald-600" />, sub: 'All time' },
          { label: 'Registered Today', value: stats?.today ?? 0, icon: <Calendar className="h-5 w-5 text-sky-600" />, sub: 'Today' },
          { label: 'New This Week', value: stats?.thisWeek ?? 0, icon: <TrendingUp className="h-5 w-5 text-violet-600" />, sub: 'This week' },
          { label: 'Prescriptions Issued', value: stats?.thisMonth ?? 0, icon: <Pill className="h-5 w-5 text-amber-600" />, sub: 'This month' },
        ].map(({ label, value, icon, sub }) => (
          <Card key={label} className="p-4 sm:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  {icon}
                </div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium self-start">{sub}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          icon={<Activity className="h-5 w-5 text-emerald-600" />}
          title="Patient Visit Trends (2026)"
          selectedTimeframe={visitTimeframe}
          onTimeframeChange={(val) => {
            setVisitTimeframe(val);
            loadAnalytics(val);
          }}
        >
          {isLoadingAnalytics ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">Loading visit trends...</div>
          ) : analytics.visits.length === 0 || analytics.visits.every((v) => v.visits === 0) ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 space-y-1">
              <Activity className="h-8 w-8 text-slate-300 mb-1" />
              <p className="text-xs font-semibold">No visit trend records yet</p>
              <p className="text-[11px] text-slate-400">Register new patients to populate real-time analytics.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.visits} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }} />
                <Area type="monotone" dataKey="visits" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          icon={<Pill className="h-5 w-5 text-amber-600" />}
          title="Top Prescribed Remedies"
          selectedTimeframe={remedyTimeframe}
          onTimeframeChange={(val) => {
            setRemedyTimeframe(val);
            loadAnalytics(val);
          }}
        >
          {isLoadingAnalytics ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">Loading remedy statistics...</div>
          ) : analytics.topRemedies.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 space-y-1">
              <Pill className="h-8 w-8 text-slate-300 mb-1" />
              <p className="text-xs font-semibold">No prescriptions issued yet</p>
              <p className="text-[11px] text-slate-400">Issue prescriptions to track top remedies in real-time.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topRemedies} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="remedy" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }} />
                <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Quick Actions & Practice Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Quick Clinical Actions</CardTitle>
            <button onClick={() => navigate('/dashboard/patients')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All Actions →
            </button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ActionCard
              icon={<Stethoscope className="h-6 w-6 text-emerald-600" />}
              title="Register Patient"
              desc="Onboard a new patient record"
              onClick={() => navigate('/dashboard/patients/new')}
            />
            <ActionCard
              icon={<Search className="h-6 w-6 text-emerald-600" />}
              title="Search EMR Records"
              desc="Look up existing case files"
              onClick={() => navigate('/dashboard/patients')}
            />
          </CardContent>
        </Card>

        {/* Practice Overview */}
        <OverviewCard title="Practice Overview">
          <OverviewItem
            icon={<CalendarDays className="h-5 w-5 text-sky-600" />}
            iconBg="bg-sky-50"
            title="Upcoming Appointments"
            subtitle="No appointments today"
            count={0}
            onClick={() => navigate('/dashboard/patients')}
          />
          <OverviewItem
            icon={<Clock className="h-5 w-5 text-violet-600" />}
            iconBg="bg-violet-50"
            title="Pending Follow-ups"
            subtitle={`${upcomingFollowUps} follow-ups pending this week`}
            count={upcomingFollowUps}
            onClick={() => navigate('/dashboard/patients')}
          />
          <OverviewItem
            icon={<FileText className="h-5 w-5 text-amber-600" />}
            iconBg="bg-amber-50"
            title="Draft Prescriptions"
            subtitle="0 drafts pending"
            count={0}
            onClick={() => navigate('/dashboard/patients')}
          />
        </OverviewCard>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function ActionCard({ icon, title, desc, onClick }: {
  icon: React.ReactNode; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/20 active:scale-95 shadow-xs cursor-pointer"
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
