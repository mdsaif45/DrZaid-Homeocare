import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { stats, fetchStats } = usePatientStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">Z</div>
             <div>
               <h1 className="text-xl font-black text-slate-900 leading-tight">Dr. ZAID's <span className="text-primary">Homeo Care</span></h1>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical Management System</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-900">{user?.full_name}</p>
              <p className="text-xs font-medium text-slate-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Card */}
        <div className="relative bg-slate-900 rounded-[2.5rem] p-10 mb-12 overflow-hidden shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Welcome back, Dr. {user?.full_name?.split(' ')[1]}</h2>
            <p className="text-slate-400 font-medium max-w-lg">Monitoring your practice analytics and patient records for today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Patients"
            value={stats?.total.toString() || '0'}
            icon="👥"
            trend="+12%"
          />
          <StatsCard
            title="Appointments Today"
            value={stats?.today.toString() || '0'}
            icon="📅"
            trend="Ongoing"
          />
          <StatsCard
            title="New This Week"
            value={stats?.thisWeek.toString() || '0'}
            icon="📈"
            trend="Active"
          />
          <StatsCard
            title="Active Consultations"
            value={stats?.thisMonth.toString() || '0'}
            icon="🩹"
            trend="Updated"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Left Column: Quick Actions */}
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900">Patient Management</h3>
                  <button 
                    onClick={() => navigate('/dashboard/patients')}
                    className="text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    View Registry →
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuickActionCard
                    icon="👤"
                    title="Register Patient"
                    desc="Onboard a new patient record"
                    onClick={() => navigate('/dashboard/patients/new')}
                    primary
                  />
                  <QuickActionCard
                    icon="🔍"
                    title="Search Records"
                    desc="Lookup existing case files"
                    onClick={() => navigate('/dashboard/patients')}
                  />
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8">
                 <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-emerald-900">Clinical Data Secured</h3>
                       <p className="text-sm font-bold text-emerald-700/80 uppercase tracking-widest">Phase 5 Production Environment</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <StatusBadge label="JWT Encryption" active />
                    <StatusBadge label="PostgreSQL v15" active />
                    <StatusBadge label="Prescription Engine" active />
                    <StatusBadge label="Case Timelines" active />
                 </div>
              </div>
           </div>

           {/* Right Column: Recent Activity / Sidebar */}
           <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-black text-slate-900 mb-6">Clinic Info</h3>
                 <div className="space-y-6">
                    <SidebarItem label="System Version" value="v1.4.0 (Enterprise)" />
                    <SidebarItem label="Storage Status" value="Healthy (92% Free)" />
                    <SidebarItem label="Last Database Sync" value="Real-time" />
                 </div>
              </div>

              <div className="bg-accent/10 rounded-[2rem] p-8 border border-accent/20">
                 <h3 className="text-lg font-black text-accent mb-4">Support Hub</h3>
                 <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">Need help with complex prescriptions or system settings?</p>
                 <button className="w-full py-4 bg-white text-accent font-black rounded-2xl border border-accent/20 shadow-sm hover:bg-white/80 transition active:scale-95">
                    Open Documentation
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: string, trend: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary/10 group-hover:scale-110 transition-all">
          {icon}
        </div>
        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-wider">{trend}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, desc, onClick, primary = false }: { icon: string, title: string, desc: string, onClick: () => void, primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-3xl text-left transition-all active:scale-95 border ${
        primary 
          ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800' 
          : 'bg-white border-slate-100 text-slate-900 hover:border-primary/50'
      }`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="font-black text-lg mb-1">{title}</h4>
      <p className={`text-sm font-medium ${primary ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
    </button>
  );
}

function StatusBadge({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-xl border border-emerald-100">
       <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
       <span className="text-xs font-bold text-emerald-900/80">{label}</span>
    </div>
  );
}

function SidebarItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
