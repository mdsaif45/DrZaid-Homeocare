import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, Users, FileText, Pill, Activity } from 'lucide-react';
import { Button, Input, Alert, Card, ThemeToggle } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex relative">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-sidebar-bg p-12 relative overflow-hidden border-r border-sidebar-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <svg className="w-6 h-6 text-text-on-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-sidebar-text font-extrabold text-sm">Dr. ZAID's</p>
              <p className="text-primary text-xs font-semibold">Homeo Care</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-sidebar-text leading-tight mb-4">
            Clinical Management<br />
            <span className="text-primary">at Your Fingertips.</span>
          </h2>
          <p className="text-sidebar-muted leading-relaxed text-sm max-w-sm">
            A complete EMR system for managing patient records, consultations, case timelines, and prescriptions — all in one secure place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: <Users className="w-5 h-5 text-primary" />, label: 'Patient Registry' },
              { icon: <FileText className="w-5 h-5 text-primary" />, label: 'Case Records' },
              { icon: <Pill className="w-5 h-5 text-primary" />, label: 'Prescriptions' },
              { icon: <Activity className="w-5 h-5 text-primary" />, label: 'Practice Analytics' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-surface/10 border border-border/20 rounded-xl px-4 py-3">
                {icon}
                <span className="text-xs font-semibold text-sidebar-text">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-sidebar-muted">
          © 2026 Dr. ZAID's Homeo Care. All rights reserved.
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-on-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-text text-sm">Dr. ZAID's Homeo Care</p>
              <p className="text-xs text-primary font-semibold">Clinical Management System</p>
            </div>
          </div>

          <Card padding="lg" className="shadow-lg">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-text mb-1">Welcome back</h1>
              <p className="text-sm text-text-muted">Sign in to your doctor portal</p>
            </div>

            {error && (
              <Alert variant="danger" onDismiss={clearError} className="mb-5">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="doctor@homeocare.com"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-text-muted hover:text-text cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-2"
              >
                Sign In →
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-text-muted mt-6">
            <Link to="/" className="hover:text-primary transition font-semibold">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
