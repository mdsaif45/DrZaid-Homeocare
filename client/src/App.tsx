import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/public/Home';
import Login from './pages/dashboard/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PatientList from './pages/dashboard/PatientList';
import PatientForm from './pages/dashboard/PatientForm';
import PatientDetail from './pages/dashboard/PatientDetail';
import CaseRecordForm from './pages/dashboard/CaseRecordForm';
import PrescriptionForm from './pages/dashboard/PrescriptionForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes — all share DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients"
          element={
            <ProtectedRoute>
              <DashboardLayout><PatientList /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/new"
          element={
            <ProtectedRoute>
              <DashboardLayout><PatientForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout><PatientForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout><PatientDetail /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/case-records/new"
          element={
            <ProtectedRoute>
              <DashboardLayout><CaseRecordForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/case-records/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout><CaseRecordForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/prescriptions/new"
          element={
            <ProtectedRoute>
              <DashboardLayout><PrescriptionForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/prescriptions/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout><PrescriptionForm /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
