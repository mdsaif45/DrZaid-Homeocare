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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dr. ZAID's Homeo Care</h1>
            <p className="text-sm text-gray-600">Electronic Medical Records</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary to-accent-purple rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. {user?.full_name?.split(' ')[1]}!</h2>
          <p className="text-white/90">Here's what's happening with your practice today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats?.total.toString() || '0'}
            icon="👥"
            color="bg-blue-500"
          />
          <StatsCard
            title="This Month"
            value={stats?.thisMonth.toString() || '0'}
            icon="📅"
            color="bg-green-500"
          />
          <StatsCard
            title="This Week"
            value={stats?.thisWeek.toString() || '0'}
            icon="🔔"
            color="bg-yellow-500"
          />
          <StatsCard
            title="Today"
            value={stats?.today.toString() || '0'}
            icon="📋"
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              icon="👤"
              title="Add New Patient"
              description="Register a new patient"
              onClick={() => navigate('/dashboard/patients/new')}
            />
            <QuickActionButton
              icon="📝"
              title="View All Patients"
              description="Manage patient records"
              onClick={() => navigate('/dashboard/patients')}
            />
            <QuickActionButton
              icon="🔍"
              title="Search Patients"
              description="Find patient records"
              onClick={() => navigate('/dashboard/patients')}
            />
          </div>
        </div>

        {/* Phase 1 Complete Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-2">✅ Phase 2: Authentication Complete!</h3>
          <p className="text-green-700 mb-4">
            The authentication system is now fully functional. You can login, logout, and access protected routes.
          </p>
          <div className="space-y-2 text-sm text-green-800">
            <p>✓ JWT-based authentication</p>
            <p>✓ Secure password hashing</p>
            <p>✓ Token refresh mechanism</p>
            <p>✓ Protected routes</p>
            <p>✓ User session management</p>
          </div>
          <p className="text-green-700 mt-4 font-medium">
            Next: Phase 3 - Patient Management System
          </p>
        </div>
      </main>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionButton({ icon, title, description, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition text-left"
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}
