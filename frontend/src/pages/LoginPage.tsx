import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      if (type === 'admin') {
        try {
          await login({ email: 'admin@fineprint.com', password: 'AdminPassword2026!' });
        } catch {
          await login({ email: 'admin@labellens.com', password: 'AdminPassword2026!' });
        }
        onNavigate('admin');
      } else {
        try {
          await login({ email: 'demo@fineprint.com', password: 'DemoUser2026!' });
        } catch {
          await login({ email: 'demo@labellens.com', password: 'DemoUser2026!' });
        }
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sign in to FINEPRINT</h2>
        <p className="mt-1 text-xs text-slate-400">
          Access your food safety diary and reports.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:rounded-3xl sm:px-10 border border-slate-200 shadow-xl space-y-6 text-slate-900">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block text-center">
              Instant Hackathon Demo Login
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 text-xs font-bold text-center transition-all flex flex-col items-center justify-center space-y-0.5 shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Priya Sharma</span>
                <span className="text-[10px] text-slate-500 font-normal">Consumer Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-800 text-xs font-bold text-center transition-all flex flex-col items-center justify-center space-y-0.5 shadow-xs"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Food Inspector</span>
                <span className="text-[10px] text-slate-500 font-normal">Admin Console</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
