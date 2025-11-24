import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/dashboard/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PatientList from './pages/dashboard/PatientList';
import PatientForm from './pages/dashboard/PatientForm';
import PatientDetail from './pages/dashboard/PatientDetail';
import CaseRecordForm from './pages/dashboard/CaseRecordForm';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients"
          element={
            <ProtectedRoute>
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/new"
          element={
            <ProtectedRoute>
              <PatientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id/edit"
          element={
            <ProtectedRoute>
              <PatientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id"
          element={
            <ProtectedRoute>
              <PatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/case-records/new"
          element={
            <ProtectedRoute>
              <CaseRecordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/case-records/:id/edit"
          element={
            <ProtectedRoute>
              <CaseRecordForm />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
