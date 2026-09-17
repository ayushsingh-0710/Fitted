import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendProductsFromCatalog } from '../services/catalogRecommendationEngine';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';
import WardrobeOutfitRecommendations from '../components/WardrobeOutfitRecommendations';
import { api } from '../services/api';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Info,
  Ruler,
  DollarSign,
  ShieldAlert,
  Calendar,
  Bot,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Building
} from 'lucide-react';

const PREFERRED_FABRICS = ['100% Organic Cotton', 'Cashmere', 'Mulberry Silk'];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { items: wardrobeItems = [] } = useWardrobe();

  // Selected Category & Brand Filter State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [safetyOnly, setSafetyOnly] = useState(false);
  const [addedId, setAddedId] = useState(null);

  // Body Suitability Inputs
  const [useSavedProfile, setUseSavedProfile] = useState(true);
  const [customBodyType, setCustomBodyType] = useState(() => user?.bodyType || 'Athletic Trapezoid');
  const [customHeight, setCustomHeight] = useState(() => user?.height || "5'11\" (180 cm)");
  const [customChest, setCustomChest] = useState(() => user?.chest || "39 in");
  const [customWaist, setCustomWaist] = useState(() => user?.waist || "31 in");
  const [customShoulder, setCustomShoulder] = useState("18.5 in");
  const [fitPreference, setFitPreference] = useState("Tailored / Structured");

  // Budget Controls
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(40000);

  // Fabric specs & Excluded Allergies
  const availableFabrics = ['Wool', 'Polyester', 'Synthetic', 'Latex', 'Leather', 'Linen', 'Silk', 'Nylon', 'Down / Feathers'];
  const [excludedFabrics, setExcludedFabrics] = useState(['Wool']);


  // Occasion & Wardrobe Pairing
  const occasionsList = [
    'Creative Workspace',
    'Formal Evening / Wedding',
    'Date Night Luxe',
    'Weekend Casual',
    'Resort & Summer Travel',
    'Black Tie Gala'
  ];
  const [selectedOccasion, setSelectedOccasion] = useState('Creative Workspace');
  const [selectedClosetItemId, setSelectedClosetItemId] = useState('');

  // Engine state
  const [loading, setLoading] = useState(false);
  const [aiSource, setAiSource] = useState("Fitted Indian Women's Fashion AI Engine");
  const [partnerProducts, setPartnerProducts] = useState(() => recommendProductsFromCatalog(wardrobeItems, user));
  const [panelOpen, setPanelOpen] = useState(true);

  // Product Inspection Modal state
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [selectedModalSize, setSelectedModalSize] = useState('');

  const handleGenerateRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        wardrobeItems: wardrobeItems,
        measurements: {
          bodyType: customBodyType,
          height: customHeight,
          chest: customChest,
          waist: useSavedProfile ? (user?.waist || customWaist) : customWaist,
          shoulderWidth: customShoulder,
          fitPreference: fitPreference,
          useSavedData: useSavedProfile
        },
        budget: {
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice)
        },
        fabricSpecs: {
          preferences: PREFERRED_FABRICS,
          allergiesOrExclusions: excludedFabrics
        },
        occasion: selectedOccasion,
        closetItemId: selectedClosetItemId || undefined
      };

      const response = await api.recommendations.getPartnerSuggestions(payload);
      if (response && response.products) {
        setPartnerProducts(response.products);
        setAiSource(response.source || "Fitted Indian Women's Fashion AI Engine");
      }
    } catch (err) {
      console.warn("Recommendations generation fallback:", err);
      setPartnerProducts(recommendProductsFromCatalog(wardrobeItems, user));
    } finally {
      setLoading(false);
    }
  }, [
    wardrobeItems,
    customBodyType,
    customHeight,
    customChest,
    useSavedProfile,
    user,
    customWaist,
    customShoulder,
    fitPreference,
    minPrice,
    maxPrice,
    excludedFabrics,
    selectedOccasion,
    selectedClosetItemId
  ]);

  // Skip redundant initial effect execution since state is already pre-seeded
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    handleGenerateRecommendations();
  }, [handleGenerateRecommendations]);

  // Categories & Brand lists
  const categories = ['All', 'Kurti', 'Top', 'T-Shirt', 'Jeans', 'Trousers', 'Dress', 'Co-ord Set', 'Jacket', 'Sneakers', 'Flats'];
  const allBrands = ['All', ...Array.from(new Set(partnerProducts.map(p => p.brand).filter(Boolean)))];

  const toggleExcludedFabric = (fabric) => {
    if (excludedFabrics.includes(fabric)) {
      setExcludedFabrics(excludedFabrics.filter(f => f !== fabric));
    } else {
      setExcludedFabrics([...excludedFabrics, fabric]);
    }
  };

  const handleQuickAdd = (prod, e) => {
    if (e) e.stopPropagation();
    const size = selectedModalSize || (prod.sizes ? prod.sizes[0] : 'M');
    addToCart(prod, size);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Filter recommendations by category, brand, and safety
  const filteredProds = partnerProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesSafety = !safetyOnly || !p.allergyConflict;
    return matchesCategory && matchesBrand && matchesSafety;
  });

  // Body Suitability Rules Guide Map
  const bodySuitabilityTips = {
    'Athletic Trapezoid': 'Balanced shoulder-to-waist ratio. Benefits from tailored jackets, tapered trousers, and fitted knitwear that frame the V-shape.',
    'Inverted Triangle': 'Broad shoulders with narrow waist. Best suited to soft drop-shoulder tops, straight-leg denim, and unstructured unpadded coats.',
    'Rectangle': 'Balanced chest, waist, and hips. Looks best in structured peak-lapel blazers and pleated trousers that create optical waist depth.',
    'Oval / Rounded': 'Soft midsection profile. Enhanced by vertical open-front long overcoats, camp collar linen shirts, and mid-rise straight trousers.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown text-xs font-bold uppercase tracking-wider border border-fitted-brown/20">
            <Bot className="w-4 h-4 text-fitted-brown" />
            <span>AI Partner Product Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">
            Multi-Brand Partner Product Matches
          </h1>
          <p className="text-xs sm:text-sm text-fitted-muted max-w-2xl">
            Input your measurements, body shape, fabric safety exclusions, budget, and occasion to discover curated product matches from top luxury brands.
          </p>
        </div>

        <button
          onClick={() => navigate('/stylist')}
          className="px-5 py-3 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all shadow-glow-brown flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Book Stylist Session (₹99)</span>
        </button>
      </div>

      {/* 1-on-1 Stylist Booking Banner */}
      <div className="bg-gradient-to-r from-[#F97316]/15 via-[#FB923C]/10 to-[#FAF6ED] rounded-3xl p-6 sm:p-8 border border-[#F97316]/30 shadow-cream-card flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/20 text-[#C2410C] text-[11px] font-bold uppercase tracking-wider border border-[#F97316]/30">
            <Sparkles className="w-3.5 h-3.5 fill-[#C2410C]" />
            <span>Need Personal Fashion Advice?</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-fitted-charcoal">
            1-on-1 Stylist Consultations
          </h2>
          <p className="text-xs text-fitted-muted leading-relaxed">
            Get personalized advice from India’s top celebrity fashion stylists starting from <strong>₹0 (Quick Style Review)</strong> to <strong>₹99 / session</strong> & monthly plans.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#F97316]/20 text-[10px] font-bold text-[#C2410C]">₹0 — Quick style review</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#F97316]/20 text-[10px] font-bold text-[#C2410C]">₹99 — Per Session</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#F97316]/20 text-[10px] font-bold text-[#C2410C]">₹299 — Per Month Subscription</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#F97316]/20 text-[10px] font-bold text-[#C2410C]">₹999 — Premium Subscription</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/stylist')}
          className="px-8 py-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center gap-2"
        >
          <span>Book Stylist Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Wardrobe Outfit Combinations Section */}
      <WardrobeOutfitRecommendations
        wardrobeItems={wardrobeItems}
        userPreferences={user || {}}
        onOpenAddModal={() => navigate('/wardrobe')}
      />

      {/* Interactive AI Preference & Body Suitability Configuration Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-8 border border-fitted-border shadow-cream-card relative overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-fitted-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fitted-brown/10 border border-fitted-brown/20 flex items-center justify-center text-fitted-brown">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fitted-charcoal font-display">1. Configure Your Preference Profile</h2>
              <p className="text-xs text-fitted-muted">Body measurements, suitability rules, budget limits, fabric safety & occasion</p>
            </div>
          </div>

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 rounded-xl bg-fitted-bg hover:bg-fitted-bgSoft text-fitted-muted hover:text-fitted-charcoal transition-colors"
          >
            {panelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {panelOpen && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Box 1: Body Measurements & Suitability */}
              <div className="space-y-3 p-4 rounded-2xl bg-fitted-bg/70 border border-fitted-border flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      <span>Body & Measurements</span>
                    </span>
                  </div>

                  {/* Toggle: Saved vs Custom */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-fitted-border text-[11px]">
                    <button
                      onClick={() => setUseSavedProfile(true)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                        useSavedProfile ? 'bg-fitted-brown text-white font-bold shadow-sm' : 'text-fitted-muted hover:text-fitted-charcoal'
                      }`}
                    >
                      Saved Profile
                    </button>
                    <button
                      onClick={() => setUseSavedProfile(false)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                        !useSavedProfile ? 'bg-fitted-brown text-white font-bold shadow-sm' : 'text-fitted-muted hover:text-fitted-charcoal'
                      }`}
                    >
                      Custom Inputs
                    </button>
                  </div>

                  {useSavedProfile ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-fitted-border/60">
                        <span className="text-fitted-muted">Body Shape:</span>
                        <span className="text-fitted-charcoal font-bold">{user?.bodyType || customBodyType}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-fitted-border/60">
                        <span className="text-fitted-muted">Height:</span>
                        <span className="text-fitted-charcoal font-bold">{user?.height || customHeight}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-fitted-muted">Chest / Waist:</span>
                        <span className="text-fitted-charcoal font-bold">{user?.chest || customChest} / {user?.waist || customWaist}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-fitted-muted uppercase font-semibold">Body Shape</label>
                        <select
                          value={customBodyType}
                          onChange={(e) => setCustomBodyType(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                        >
                          <option value="Athletic Trapezoid">Athletic Trapezoid</option>
                          <option value="Inverted Triangle">Inverted Triangle</option>
                          <option value="Rectangle">Rectangle</option>
                          <option value="Oval / Rounded">Oval / Rounded</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-fitted-muted uppercase font-semibold">Height</label>
                        <input
                          type="text"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-fitted-muted uppercase font-semibold">Chest</label>
                          <input
                            type="text"
                            value={customChest}
                            onChange={(e) => setCustomChest(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-fitted-muted uppercase font-semibold">Waist</label>
                          <input
                            type="text"
                            value={customWaist}
                            onChange={(e) => setCustomWaist(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-fitted-muted uppercase font-semibold">Shoulder Width</label>
                          <input
                            type="text"
                            value={customShoulder}
                            onChange={(e) => setCustomShoulder(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-fitted-muted uppercase font-semibold">Fit Preference</label>
                          <select
                            value={fitPreference}
                            onChange={(e) => setFitPreference(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                          >
                            <option value="Tailored / Structured">Tailored</option>
                            <option value="Relaxed / Oversized">Relaxed</option>
                            <option value="Slim Fit">Slim Fit</option>
                            <option value="Regular Classic">Regular</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-[10px] text-fitted-brown bg-fitted-brown/10 p-2 rounded-xl border border-fitted-brown/20 font-medium">
                  💡 {bodySuitabilityTips[useSavedProfile ? (user?.bodyType || customBodyType) : customBodyType] || 'Tailored cuts to complement body proportions.'}
                </div>
              </div>

              {/* Box 2: Price Budget Limit */}
              <div className="space-y-3 p-4 rounded-2xl bg-fitted-bg/70 border border-fitted-border flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Price Budget Limit</span>
                  </span>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-fitted-charcoal font-bold">
                      <span>₹{minPrice.toLocaleString('en-IN')}</span>
                      <span className="text-fitted-muted">to</span>
                      <span className="text-fitted-brown font-extrabold">₹{maxPrice.toLocaleString('en-IN')} INR</span>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-fitted-muted">Min Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            max={maxPrice}
                            step="500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-fitted-border text-fitted-charcoal text-xs outline-none focus:border-fitted-brown"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-fitted-muted">Max Cap (₹)</label>
                          <input
                            type="number"
                            min={minPrice}
                            max="100000"
                            step="1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-fitted-border text-fitted-charcoal text-xs outline-none focus:border-fitted-brown"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-fitted-muted">Max Spending Cap Slider (₹)</label>
                        <input
                          type="range"
                          min="1000"
                          max="100000"
                          step="1000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full accent-fitted-brown cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                <p className="text-[10px] text-fitted-muted">Filters multi-brand product recommendations to stay within your spending comfort zone.</p>
              </div>

              {/* Box 3: Fabric Exclusions & Allergies */}
              <div className="space-y-3 p-4 rounded-2xl bg-fitted-bg/70 border border-fitted-border flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Fabric Allergies & Exclusions</span>
                  </span>

                  <p className="text-[10px] text-fitted-muted">Select fabrics you are allergic to or unwilling to wear:</p>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {availableFabrics.map((fab) => {
                      const isExcluded = excludedFabrics.includes(fab);
                      return (
                        <button
                          key={fab}
                          onClick={() => toggleExcludedFabric(fab)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            isExcluded
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 line-through font-bold'
                              : 'bg-white text-fitted-muted hover:text-fitted-charcoal border border-fitted-border'
                          }`}
                        >
                          {isExcluded ? `✕ No ${fab}` : fab}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {excludedFabrics.length > 0 && (
                  <div className="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Excluding: {excludedFabrics.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Box 4: Occasion & Wardrobe Closet Pairing */}
              <div className="space-y-3 p-4 rounded-2xl bg-fitted-bg/70 border border-fitted-border flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Occasion & Closet Pairing</span>
                  </span>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-fitted-muted uppercase font-semibold">Target Occasion</label>
                      <select
                        value={selectedOccasion}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                      >
                        {occasionsList.map(occ => (
                          <option key={occ} value={occ}>{occ}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-fitted-muted uppercase font-semibold">Pair With Closet Item</label>
                      <select
                        value={selectedClosetItemId}
                        onChange={(e) => setSelectedClosetItemId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-fitted-border text-fitted-charcoal outline-none focus:border-fitted-brown"
                      >
                        {(wardrobeItems || []).map(item => (
                          <option key={item.id} value={item.id}>{item.name} ({item.brand})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-fitted-brown/10 border border-fitted-brown/20 text-[10px] text-fitted-brown">
                  Formulated for <span className="font-bold">{selectedOccasion}</span>.
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-fitted-border">
              <div className="flex items-center gap-2 text-xs text-fitted-muted">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Engine Active: <strong className="text-fitted-charcoal">{aiSource}</strong></span>
              </div>

              <button
                onClick={handleGenerateRecommendations}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-glow-brown disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Body & Suitability Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Generate AI Partner Product Matches</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Multi-Brand & Category Filtering Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-fitted-brown text-white font-bold shadow-glow-brown'
                    : 'bg-white text-fitted-muted border border-fitted-border hover:text-fitted-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Allergy Safety Filter Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSafetyOnly(!safetyOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                safetyOnly
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                  : 'bg-white text-fitted-muted border-fitted-border hover:text-fitted-charcoal'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${safetyOnly ? 'text-emerald-600' : 'text-fitted-muted'}`} />
              <span>Allergy Safe Only</span>
            </button>
          </div>
        </div>

        {/* Brand Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-fitted-muted shrink-0 mr-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            <span>Brands:</span>
          </span>
          {allBrands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedBrand === b
                  ? 'bg-fitted-charcoal text-white font-bold'
                  : 'bg-white text-fitted-muted border border-fitted-border hover:text-fitted-charcoal'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Products Grid */}
      {filteredProds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-fitted-border space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-fitted-charcoal font-display">No Partner Products Match Current Filters</h3>
          <p className="text-xs text-fitted-muted max-w-md mx-auto">
            Try adjusting your price budget cap (₹{maxPrice.toLocaleString('en-IN')}), unchecking fabric allergy exclusions, or selecting "All Brands".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
              setSafetyOnly(false);
              setMaxPrice(50000);
            }}
            className="px-5 py-2.5 rounded-xl bg-fitted-brown text-white text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProds.map((prod, idx) => (
            <div
              key={prod.id || idx}
              onClick={() => setActiveModalProduct(prod)}
              className="bg-white rounded-3xl overflow-hidden cursor-pointer group flex flex-col sm:flex-row justify-between border border-fitted-border hover:border-fitted-brown/50 shadow-cream-card transition-all"
            >
              {/* Left Image Column */}
              <div className="sm:w-2/5 relative h-72 sm:h-auto overflow-hidden bg-fitted-bgSoft">
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Match Synergy Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-fitted-brown/30 text-fitted-brown text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-fitted-brown" />
                  <span>{prod.matchScore || 95}% Synergy Match</span>
                </div>

                {/* Allergy Safety Badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  {prod.allergyConflict ? (
                    <div className="px-2.5 py-1.5 rounded-xl bg-amber-50/95 backdrop-blur-md border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Contains Excluded Fabric</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50/95 backdrop-blur-md border border-emerald-300 text-emerald-900 text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>100% Allergy Safe</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Details Column */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-fitted-brown flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{prod.brand || 'Partner Brand'}</span>
                    </span>
                    <span className="text-base font-bold text-fitted-charcoal">₹{prod.price?.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-fitted-charcoal group-hover:text-fitted-brown transition-colors">
                    {prod.name}
                  </h3>

                  <div className="text-[11px] text-fitted-muted font-medium">
                    Fabric: <span className="text-fitted-charcoal font-semibold">{prod.fabric || '100% Organic Cotton'}</span>
                  </div>

                  {/* Body Suitability Card */}
                  {prod.bodySuitability && (
                    <div className="p-3 rounded-2xl bg-fitted-bg/80 border border-fitted-border/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-fitted-brown text-[10px] font-bold">
                        <Ruler className="w-3.5 h-3.5 text-fitted-brown" />
                        <span>Body Suitability:</span>
                      </div>
                      <p className="text-[11px] text-fitted-charcoal leading-relaxed">
                        {prod.bodySuitability}
                      </p>
                    </div>
                  )}

                  {/* Match Reason Box */}
                  <div className="p-3 rounded-2xl bg-fitted-bgSoft border border-fitted-border/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-fitted-brown text-[10px] font-bold">
                      <Info className="w-3.5 h-3.5" />
                      <span>Why it works for you:</span>
                    </div>
                    <p className="text-[11px] text-fitted-charcoal leading-relaxed">
                      {prod.matchReason}
                    </p>
                  </div>

                  {prod.pairedItemName && (
                    <div className="text-[11px] text-fitted-brown font-semibold pt-0.5">
                      Pairs with closet item: <span className="text-fitted-charcoal font-medium">{prod.pairedItemName}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-fitted-border flex items-center gap-3">
                  <button
                    onClick={(e) => handleQuickAdd(prod, e)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      addedId === (prod.id || idx)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-fitted-brown text-white hover:bg-fitted-brownDark shadow-glow-brown'
                    }`}
                  >
                    {addedId === (prod.id || idx) ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveModalProduct(prod)}
                    className="p-3 rounded-xl bg-fitted-bg hover:bg-fitted-bgSoft text-fitted-charcoal border border-fitted-border transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Suitability Inspection Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-fitted-border relative max-h-[90vh] flex flex-col md:flex-row">
            
            {/* Modal Image Column */}
            <div className="md:w-1/2 relative bg-fitted-bgSoft h-64 md:h-auto overflow-hidden">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 left-4 md:hidden p-2 rounded-full bg-white/90 text-fitted-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Column */}
            <div className="md:w-1/2 p-6 sm:p-8 space-y-6 overflow-y-auto flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-fitted-brown flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    <span>{activeModalProduct.brand} ({activeModalProduct.brandOrigin || 'Global Partner'})</span>
                  </span>

                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="hidden md:block p-1.5 rounded-full hover:bg-fitted-bg text-fitted-muted hover:text-fitted-charcoal transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-fitted-charcoal font-display">
                  {activeModalProduct.name}
                </h2>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-fitted-charcoal">₹{activeModalProduct.price?.toLocaleString('en-IN')}</span>
                  {activeModalProduct.originalPrice && (
                    <span className="text-xs text-fitted-muted line-through">₹{activeModalProduct.originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown text-[10px] font-bold">
                    {activeModalProduct.matchScore || 95}% Synergy Match
                  </span>
                </div>

                {/* Body Suitability Deep-Dive */}
                <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2">
                  <h4 className="text-xs font-bold text-fitted-brown uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-4 h-4" />
                    <span>Body Suitability Metrics</span>
                  </h4>
                  <p className="text-xs text-fitted-charcoal leading-relaxed">
                    {activeModalProduct.bodySuitability || 'Engineered silhouette to compliment shoulder-to-waist ratios.'}
                  </p>
                </div>

                {/* Fabric Specs & Allergy Status */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-fitted-border">
                    <span className="text-fitted-muted">Fabric Specs:</span>
                    <span className="text-fitted-charcoal font-bold">{activeModalProduct.fabric}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-fitted-border">
                    <span className="text-fitted-muted">Fit Type:</span>
                    <span className="text-fitted-charcoal font-bold">{activeModalProduct.fitType || 'Regular Fit'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-fitted-muted">Allergy Safety:</span>
                    <span className={`font-bold ${activeModalProduct.allergyConflict ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {activeModalProduct.allergyConflict ? '⚠️ Contains Excluded Material' : '✓ 100% Allergy Safe'}
                    </span>
                  </div>
                </div>

                {/* Size Selector */}
                {activeModalProduct.sizes && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-fitted-muted">Select Size</label>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedModalSize(sz)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            (selectedModalSize || activeModalProduct.sizes[0]) === sz
                              ? 'bg-fitted-brown text-white shadow-sm'
                              : 'bg-fitted-bg text-fitted-charcoal border border-fitted-border'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-fitted-border space-y-2">
                <button
                  onClick={(e) => {
                    handleQuickAdd(activeModalProduct, e);
                    setActiveModalProduct(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-glow-brown"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag (₹{activeModalProduct.price?.toLocaleString('en-IN')})</span>
                </button>

                <button
                  onClick={() => {
                    navigate(`/product/${activeModalProduct.id}`);
                    setActiveModalProduct(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white border border-fitted-border text-fitted-charcoal text-xs font-semibold hover:bg-fitted-bg transition-colors"
                >
                  View Full Product Details Page
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
