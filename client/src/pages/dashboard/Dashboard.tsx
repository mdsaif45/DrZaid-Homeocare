import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { useNavigate } from 'react-router-dom';

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
      <div className="relative bg-slate-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-teal-400 text-sm font-semibold mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Good {getGreeting()}, Dr. {firstName}</h2>
            <p className="text-slate-400 text-sm">Here's a summary of your practice today.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/patients/new')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-600/30 active:scale-95 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats?.total ?? 0, icon: '👥', color: 'teal', sub: 'All time' },
          { label: 'Registered Today', value: stats?.today ?? 0, icon: '📅', color: 'blue', sub: 'Today' },
          { label: 'New This Week', value: stats?.thisWeek ?? 0, icon: '📈', color: 'violet', sub: 'This week' },
          { label: 'This Month', value: stats?.thisMonth ?? 0, icon: '🗓️', color: 'amber', sub: 'This month' },
        ].map(({ label, value, icon, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">{icon}</div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mb-1">{value}</p>
            <p className="text-sm font-semibold text-slate-700">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-extrabold text-slate-900">Patient Management</h3>
            <button onClick={() => navigate('/dashboard/patients')} className="text-xs font-bold text-teal-600 hover:text-teal-700">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
              title="Register Patient"
              desc="Onboard a new patient record"
              onClick={() => navigate('/dashboard/patients/new')}
              primary
            />
            <ActionCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              title="Search Records"
              desc="Look up existing case files"
              onClick={() => navigate('/dashboard/patients')}
            />
          </div>
        </div>

        {/* System status */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'API Server', status: 'Online' },
                { label: 'Database', status: 'Healthy' },
                { label: 'Last Sync', status: 'Real-time' },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-500">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-600 rounded-2xl p-5 text-white">
            <h3 className="text-sm font-extrabold mb-1">Clinical Data Secured</h3>
            <p className="text-teal-200 text-xs mb-4">JWT • PostgreSQL v15 • TLS</p>
            <div className="grid grid-cols-2 gap-2">
              {['Prescription Engine', 'Case Timelines', 'EMR Records', 'Audit Logs'].map(label => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                  <span className="text-xs font-semibold text-teal-100">{label}</span>
                </div>
              ))}
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

function ActionCard({ icon, title, desc, onClick, primary = false }: {
  icon: React.ReactNode; title: string; desc: string; onClick: () => void; primary?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-xl text-left transition-all active:scale-95 border ${
        primary
          ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
          : 'bg-white border-slate-100 text-slate-900 hover:border-teal-200 hover:bg-teal-50/30'
      }`}
    >
      <div className={`mt-0.5 shrink-0 ${primary ? 'text-teal-400' : 'text-teal-600'}`}>{icon}</div>
      <div>
        <p className={`font-bold text-sm mb-0.5 ${primary ? 'text-white' : 'text-slate-900'}`}>{title}</p>
        <p className={`text-xs ${primary ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
      </div>
    </button>
  );
}
