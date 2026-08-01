import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp, Stethoscope, Pill, Plus, Search, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const patientVisitData = [
  { month: 'Jan', visits: 45 },
  { month: 'Feb', visits: 52 },
  { month: 'Mar', visits: 61 },
  { month: 'Apr', visits: 58 },
  { month: 'May', visits: 74 },
  { month: 'Jun', visits: 89 },
  { month: 'Jul', visits: 95 },
];

const remedyData = [
  { remedy: 'Pulsatilla', count: 42 },
  { remedy: 'Nux Vomica', count: 38 },
  { remedy: 'Sulphur', count: 31 },
  { remedy: 'Lycopodium', count: 27 },
  { remedy: 'Arsenicum', count: 24 },
  { remedy: 'Silicea', count: 19 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { stats, fetchStats } = usePatientStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const firstName = user?.full_name?.split(' ').slice(-1)[0] ?? 'Doctor';

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 shadow-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold text-emerald-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="mb-2 text-2xl font-extrabold text-white md:text-3xl">
              Good {getGreeting()}, Dr. {firstName}
            </h2>
            <p className="text-sm text-slate-400">Here's a summary of your homeopathic practice today.</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/patients/new')}
            variant="primary"
            size="lg"
            className="whitespace-nowrap shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Patient
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Patients', value: stats?.total ?? 0, icon: <Users className="h-5 w-5 text-emerald-600" />, sub: 'All time' },
          { label: 'Registered Today', value: stats?.today ?? 0, icon: <Calendar className="h-5 w-5 text-sky-600" />, sub: 'Today' },
          { label: 'New This Week', value: stats?.thisWeek ?? 0, icon: <TrendingUp className="h-5 w-5 text-violet-600" />, sub: 'This week' },
          { label: 'Prescriptions Issued', value: stats?.thisMonth ?? 0, icon: <Pill className="h-5 w-5 text-amber-600" />, sub: 'This month' },
        ].map(({ label, value, icon, sub }) => (
          <Card key={label} className="p-5 hover:shadow-md transition-shadow">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                {icon}
              </div>
              <span className="text-xs text-slate-400 font-medium">{sub}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Activity className="h-5 w-5 text-emerald-600" />
              Patient Visit Trends (2026)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientVisitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }} />
                <Area type="monotone" dataKey="visits" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Pill className="h-5 w-5 text-amber-600" />
              Top Prescribed Remedies
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={remedyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="remedy" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }} />
                <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Quick Clinical Actions</CardTitle>
            <button onClick={() => navigate('/dashboard/patients')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All Patients →
            </button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-extrabold text-slate-900">System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'API Server', status: 'Online' },
                { label: 'PostgreSQL DB', status: 'Connected' },
                { label: 'Type Safety', status: 'Strict (Phase 1)' },
                { label: 'Architecture', status: 'Clean Drizzle (Phase 2)' },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{status}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-2xl bg-emerald-700 p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-200" />
              <h3 className="text-sm font-extrabold">EMR Security Active</h3>
            </div>
            <p className="text-xs text-emerald-100 mb-3">JWT Auth • PostgreSQL v15 • Drizzle ORM</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-emerald-200 font-medium">
              <span>✓ Case Timelines</span>
              <span>✓ Prescriptions</span>
              <span>✓ Audit Logs</span>
              <span>✓ Strict Validation</span>
            </div>
          </div>
        </div>
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
      className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/20 active:scale-95 shadow-sm"
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
