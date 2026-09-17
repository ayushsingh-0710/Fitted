import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Ruler, 
  Palette, 
  Check, 
  Edit3, 
  ArrowRight, 
  Bot
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const [bodyType, setBodyType] = useState(user?.bodyType || 'Athletic Trapezoid');
  const [undertone, setUndertone] = useState(user?.undertone || 'Warm Golden');
  const [height, setHeight] = useState(user?.height || "5'11\" (180 cm)");
  const [chest, setChest] = useState(user?.chest || "39 in");
  const [waist, setWaist] = useState(user?.waist || "31 in");

  const bodyShapes = ['Athletic Trapezoid', 'Inverted Triangle', 'Rectangle', 'Oval / Rounded'];
  const undertones = ['Warm Golden', 'Cool Pink/Rose', 'Neutral Olive', 'Deep Rich Mahogany'];

  const handleSave = () => {
    updateUserProfile({
      bodyType,
      undertone,
      height,
      chest,
      waist
    });
    setEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-fitted-border shadow-cream-card">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-fitted-brown shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-fitted-charcoal">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-fitted-brown/10 text-fitted-brown text-[10px] font-bold border border-fitted-brown/20">
                PRO PASSPORT
              </span>
            </div>
            <p className="text-xs text-fitted-muted mt-1">{user?.email}</p>
            <p className="text-[11px] text-fitted-brown font-mono font-bold mt-0.5">Style Score: {user?.styleScore || 88}/100</p>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="px-5 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border hover:border-fitted-brown text-fitted-charcoal text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
        >
          <Edit3 className="w-4 h-4 text-fitted-brown" />
          <span>{editing ? 'Cancel Editing' : 'Edit Passport'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Body Profile & Measurements */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-fitted-border shadow-cream-card">
            <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
              <Ruler className="w-4 h-4 text-fitted-brown" />
              <span>1. Body Shape & Measurements</span>
            </h3>

            {editing ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Body Silhouette Profile</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                  >
                    {bodyShapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-fitted-charcoal">Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-fitted-charcoal">Chest</label>
                    <input
                      type="text"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-fitted-charcoal">Waist</label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-fitted-bg border border-fitted-border space-y-1">
                  <span className="text-fitted-muted">Body Profile</span>
                  <p className="text-fitted-charcoal font-bold">{bodyType}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-fitted-bg border border-fitted-border space-y-1">
                  <span className="text-fitted-muted">Height</span>
                  <p className="text-fitted-charcoal font-bold">{height}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-fitted-bg border border-fitted-border space-y-1">
                  <span className="text-fitted-muted">Chest Measurement</span>
                  <p className="text-fitted-charcoal font-bold">{chest}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-fitted-bg border border-fitted-border space-y-1">
                  <span className="text-fitted-muted">Waist Measurement</span>
                  <p className="text-fitted-charcoal font-bold">{waist}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette & Undertone */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-fitted-border shadow-cream-card">
            <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
              <Palette className="w-4 h-4 text-fitted-brown" />
              <span>2. Undertone & Color Palette</span>
            </h3>

            {editing ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Skin Undertone Classification</label>
                  <select
                    value={undertone}
                    onChange={(e) => setUndertone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                  >
                    {undertones.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-fitted-bg border border-fitted-border space-y-1">
                  <span className="text-fitted-muted">Skin Undertone</span>
                  <p className="text-fitted-brown font-bold">{undertone}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-fitted-charcoal font-semibold">Recommended Complementary Colors</span>
                  <div className="flex items-center gap-2">
                    {['#1A1A24', '#D4AF37', '#334155', '#C59B6C', '#FAF6ED'].map((color, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-xl border border-fitted-border shadow-xs flex items-center justify-center text-[9px] font-mono text-white"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-brown hover:bg-fitted-brownDark transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Style Passport Changes</span>
            </button>
          )}

          {/* AI Partner Recommendation Banner */}
          <div className="bg-white rounded-3xl p-6 space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-fitted-border shadow-cream-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-fitted-brown text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>AI Partner Matching Engine</span>
              </div>
              <h4 className="text-sm font-bold text-fitted-charcoal font-display">Find Allergy-Safe & Budget Partner Products</h4>
              <p className="text-xs text-fitted-muted">
                Use your saved height ({user?.height || "5'11\""}), chest ({user?.chest || "39\""}), and body shape ({user?.bodyType || "Trapezoid"}) to generate tailored product recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              className="px-5 py-3 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-brown shrink-0 hover:bg-fitted-brownDark transition-all"
            >
              <span>Match Partner Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
