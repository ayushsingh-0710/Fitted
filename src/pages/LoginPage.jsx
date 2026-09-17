import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, KeyRound, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('dixita.mishra@fitted.ai');
  const [password, setPassword] = useState('password123');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/home');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    await login('dixita.mishra@fitted.ai', 'demo123');
    navigate('/home');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF6ED]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-2xl bg-white border border-fitted-border mb-2 shadow-xs">
            <img src="/fitted-emblem-logo.jpg" alt="Fitted Emblem" className="h-10 w-10 object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-fitted-charcoal">Welcome back to Fitted</h1>
          <p className="text-xs text-fitted-muted">Sign in to access your personal stylist passport</p>
        </div>

        {/* Login Form Panel */}
        <div className="bg-white p-8 rounded-3xl space-y-6 shadow-cream-card border border-fitted-border">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-fitted-charcoal">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-xs focus:outline-none focus:border-fitted-teal transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-fitted-charcoal">Password</label>
                <a href="#forgot" className="text-[10px] text-fitted-teal hover:underline font-semibold">Forgot password?</a>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-xs focus:outline-none focus:border-fitted-teal transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-fitted-teal text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-tealDark transition-all shadow-glow-teal"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Mode Access Button */}
          <div className="pt-2 border-t border-fitted-border text-center space-y-3">
            <p className="text-[11px] text-fitted-muted">Testing Fitted without creating a backend account?</p>
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-fitted-bg hover:bg-white text-fitted-teal text-xs font-semibold border border-fitted-border transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Sign In</span>
            </button>
          </div>
        </div>

        {/* Redirect to Register */}
        <p className="text-center text-xs text-fitted-muted">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-fitted-teal font-semibold hover:underline">
            Get Started
          </NavLink>
        </p>

      </div>
    </div>
  );
}
