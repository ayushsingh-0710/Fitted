import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { 
  Sun, 
  CloudRain, 
  X, 
  ArrowRight, 
  Shirt 
} from 'lucide-react';

export default function WeatherNotificationToast() {
  const { activeToast, dismissToast } = useNotifications();
  const navigate = useNavigate();

  if (!activeToast) return null;

  const isRain = (activeToast.condition || '').toLowerCase().includes('rain');

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1E2229] text-white rounded-3xl p-5 shadow-2xl border border-fitted-gold/30 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-fitted-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-fitted-gold/20 border border-fitted-gold/40 flex items-center justify-center shrink-0">
              {isRain ? (
                <CloudRain className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fitted-gold">
                  Climate Clothes Alert
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white font-mono">
                  {activeToast.temperature}°C
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {activeToast.city}: {activeToast.condition}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissToast}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Advice text */}
        <p className="text-[11px] text-gray-300 mt-2.5 leading-relaxed relative z-10">
          {activeToast.message}
        </p>

        {/* Recommended Pieces Preview */}
        {activeToast.pieces && activeToast.pieces.length > 0 && (
          <div className="mt-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-[10px] text-gray-300 font-semibold">
              <span className="flex items-center gap-1">
                <Shirt className="w-3 h-3 text-fitted-gold" />
                <span>Optimal Vault Mix</span>
              </span>
              <span className="text-fitted-gold font-bold text-[9px] uppercase">
                {activeToast.pieces.length} Pieces
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {activeToast.pieces.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl shrink-0 border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover bg-white/5"
                  />
                  <div className="max-w-[90px]">
                    <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                    <p className="text-[8px] text-gray-400">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-3.5 flex items-center justify-between gap-3 pt-1 border-t border-white/10 relative z-10">
          <span className="text-[10px] text-gray-400">
            Matched to your wardrobe
          </span>
          <button
            onClick={() => {
              dismissToast();
              navigate('/wardrobe');
            }}
            className="px-3.5 py-1.5 rounded-full bg-fitted-gold text-[#1E2229] font-bold text-[11px] hover:brightness-110 flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>View in Wardrobe</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
