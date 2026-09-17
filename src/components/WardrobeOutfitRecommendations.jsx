import React, { useState, useMemo } from 'react';
import { generateOutfitRecommendations } from '../services/outfitGenerator';
import { 
  Sparkles, 
  Shirt, 
  RotateCcw, 
  Plus, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function WardrobeOutfitRecommendations({ wardrobeItems = [], userPreferences = {}, onOpenAddModal }) {
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [loggedOutfitId, setLoggedOutfitId] = useState(null);

  const occasions = ['All', 'Casual', 'Smart Casual', 'College', 'Party', 'Date / Night Out', 'Minimal', 'Streetwear'];

  // Generate outfit combinations using the rule-based engine
  const outfitData = useMemo(() => {
    return generateOutfitRecommendations(wardrobeItems, userPreferences, selectedOccasion);
  }, [wardrobeItems, userPreferences, selectedOccasion]);

  const handleLogWearOutfit = (outfit) => {
    setLoggedOutfitId(outfit.id);
    setTimeout(() => setLoggedOutfitId(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Occasion Filter Pills */}
      <div className="bg-white rounded-3xl p-6 border border-fitted-border shadow-cream-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-brown/10 border border-fitted-brown/20 text-fitted-brown text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Generated From Your Closet Vault</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-fitted-charcoal">
              Wardrobe Outfit Combinations
            </h2>
            <p className="text-xs text-fitted-muted">
              AI-merged outfit pairings built exclusively using your cataloged clothes.
            </p>
          </div>

          <span className="text-xs font-bold text-fitted-brown bg-fitted-bg px-3 py-1.5 rounded-full border border-fitted-border">
            {outfitData.recommendations.length > 0 ? `${outfitData.recommendations.length} Top Combos` : 'No Combos Yet'}
          </span>
        </div>

        {/* Occasion Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedOccasion === occ
                  ? 'bg-fitted-brown text-white font-bold shadow-xs'
                  : 'bg-fitted-bg border border-fitted-border text-fitted-muted hover:text-fitted-charcoal hover:bg-stone-100'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Logged Success Banner */}
      {loggedOutfitId && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Outfit wear logged! Updated closet rotation metrics for all paired items.</span>
          </div>
        </div>
      )}

      {/* Insufficient Items State */}
      {outfitData.hasInsufficientItems && (
        <div className="bg-white rounded-3xl p-10 text-center border border-fitted-border shadow-cream-card space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-fitted-brown/15 text-fitted-brown flex items-center justify-center mx-auto border border-fitted-brown/20">
            <Shirt className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-fitted-charcoal">More Closet Items Needed</h3>
            <p className="text-xs text-fitted-muted leading-relaxed">
              {outfitData.missingMessage}
            </p>
          </div>
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-fitted-brown text-white text-xs font-bold uppercase tracking-wider hover:bg-fitted-brownDark transition-all inline-flex items-center gap-2 shadow-glow-brown"
            >
              <Plus className="w-4 h-4" />
              <span>Digitize Clothing Item Now</span>
            </button>
          )}
        </div>
      )}

      {/* Outfit Cards Grid */}
      {!outfitData.hasInsufficientItems && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outfitData.recommendations.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white rounded-3xl p-6 border border-fitted-border shadow-cream-card space-y-4 flex flex-col justify-between hover:border-fitted-brown transition-all group"
            >
              {/* Card Header: Name, Score & Occasion Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-fitted-border pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-fitted-brown uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-fitted-brown/10">
                    {outfit.occasion}
                  </span>
                  <h3 className="text-base font-bold text-fitted-charcoal group-hover:text-fitted-brown transition-colors">
                    {outfit.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xl font-display font-bold text-fitted-charcoal">
                    {outfit.score}%
                  </span>
                  <p className="text-[9px] text-fitted-muted font-semibold uppercase">Harmony Score</p>
                </div>
              </div>

              {/* Items Thumbnails Row (Actual Wardrobe Items) */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-fitted-muted uppercase tracking-wider">
                  Paired Vault Pieces ({outfit.items.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {outfit.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-xl overflow-hidden border border-fitted-border bg-fitted-bg group/item flex flex-col"
                    >
                      <div className="h-20 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-1.5 bg-white text-center border-t border-fitted-border">
                        <p className="text-[10px] font-bold text-fitted-charcoal truncate">{item.name}</p>
                        <p className="text-[9px] text-fitted-muted">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* "Why This Works" Explanation Box */}
              <div className="p-3 rounded-2xl bg-fitted-bg border border-fitted-border text-xs space-y-1">
                <p className="text-fitted-brown font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Why This Outfit Works</span>
                </p>
                <p className="text-fitted-charcoal text-[11px] leading-relaxed">
                  {outfit.explanation}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleLogWearOutfit(outfit)}
                  className="w-full py-2.5 rounded-xl bg-fitted-brown/10 hover:bg-fitted-brown hover:text-white text-fitted-brown text-xs font-bold transition-all flex items-center justify-center gap-2 border border-fitted-brown/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Log Wear for This Outfit</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
