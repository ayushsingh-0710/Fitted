import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, User, Mail, KeyRound } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name || 'New Member', email, password);
    navigate('/home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF6ED]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-2xl bg-white border border-fitted-border mb-2 shadow-xs">
            <img src="/fitted-emblem-logo.jpg" alt="Fitted Emblem" className="h-10 w-10 object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-fitted-charcoal">Join Fitted</h1>
          <p className="text-xs text-fitted-muted">Personalized fashion intelligence built specifically for you</p>
        </div>

        {/* Register Form Panel */}
        <div className="bg-white p-8 rounded-3xl space-y-6 shadow-cream-card border border-fitted-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-fitted-charcoal">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Dixita Mishra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-xs focus:outline-none focus:border-fitted-teal transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-fitted-charcoal">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="dixita@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-xs focus:outline-none focus:border-fitted-teal transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-fitted-charcoal">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="At least 8 characters"
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
              className="w-full py-3 rounded-xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-brownDark transition-all shadow-glow-brown"
            >
              <span>{loading ? 'Creating Passport...' : 'Create Style Passport'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-xs text-fitted-muted">
          Already have an account?{' '}
          <NavLink to="/login" className="text-fitted-brown font-semibold hover:underline">
            Sign In
          </NavLink>
        </p>

      </div>
    </div>
  );
}
