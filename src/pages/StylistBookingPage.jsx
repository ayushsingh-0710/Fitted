import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Star, 
  Check
} from 'lucide-react';


export default function StylistBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pricing Tiers State (Matching attached screenshot)
  const tiers = [
    {
      id: 'tier_free',
      name: 'Quick style review',
      price: 0,
      priceLabel: '₹0',
      periodLabel: 'One-time',
      badge: 'Free AI Review',
      highlight: false,
      features: [
        'AI outfit harmony & body suitability score',
        'Wardrobe gap identification report',
        'Automated color & silhouette feedback',
        'Instant digital recommendations'
      ]
    },
    {
      id: 'tier_session',
      name: 'Per Session',
      price: 99,
      priceLabel: '₹99',
      periodLabel: 'Per Session',
      badge: 'Most Popular',
      highlight: true,
      features: [
        '30-minute 1-on-1 virtual live consultation',
        'Personalized outfit moodboard & body guide',
        'Occasion outfit selection (Weddings, Galas, Work)',
        'Indian brand pairing recommendations'
      ]
    },
    {
      id: 'tier_monthly',
      name: 'Per Month Subscription',
      price: 299,
      priceLabel: '₹299',
      periodLabel: 'Per Month',
      badge: 'Best Value',
      highlight: false,
      features: [
        'Unlimited AI style & OOTD reviews',
        '2 Live 1-on-1 personal stylist sessions / month',
        'Priority discounts on partner Indian brands',
        'Monthly seasonal wardrobe audit & gap analysis'
      ]
    },
    {
      id: 'tier_premium',
      name: 'Premium Subscription',
      price: 999,
      priceLabel: '₹999',
      periodLabel: 'Per Month VIP',
      badge: 'VIP Elite',
      highlight: false,
      features: [
        'Dedicated VIP celebrity personal fashion stylist',
        'Unlimited 1-on-1 live video calls & WhatsApp chat',
        'Custom wedding & haute couture wardrobe curation',
        'Exclusive VIP access to brand previews & fitting events'
      ]
    }
  ];

  const [selectedTier, setSelectedTier] = useState(tiers[1]); // Default to ₹99 Per Session

  // Available Expert Stylists
  const stylists = [
    {
      id: 'stylist_01',
      name: 'Priya Sharma',
      role: 'Ethnic & Royal Heritage Specialist',
      rating: 4.9,
      reviews: 142,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      brands: ['Sabyasachi', 'Anita Dongre', 'FabIndia']
    },
    {
      id: 'stylist_02',
      name: 'Rohan Kapoor',
      role: 'Streetwear & Minimalist Luxe Expert',
      rating: 4.8,
      reviews: 118,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      brands: ['Nicobar', 'Bhaane', 'Rare Rabbit']
    },
    {
      id: 'stylist_03',
      name: 'Ananya Verma',
      role: 'Haute Couture & Wedding Stylist',
      rating: 5.0,
      reviews: 215,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      brands: ['Manish Malhotra', 'House of Pataudi', 'Kardo']
    },
    {
      id: 'stylist_04',
      name: 'Vikram Mehta',
      role: 'Executive Workwear & Formal Tailoring',
      rating: 4.9,
      reviews: 96,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      brands: ['Raymond Luxe', 'Mufti', 'HRX']
    }
  ];

  const [selectedStylist, setSelectedStylist] = useState(stylists[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-15');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('03:00 PM - 03:30 PM');
  const [stylingGoal, setStylingGoal] = useState('Occasion & Wedding Outfit Curation');

  // Booking & Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const timeSlots = [
    '10:00 AM - 10:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '03:00 PM - 03:30 PM',
    '05:00 PM - 05:30 PM',
    '07:00 PM - 07:30 PM'
  ];

  const handleBookSession = async () => {
    setIsProcessing(true);
    try {
      // Simulate booking order creation via payments API or direct confirmation
      if (selectedTier.price > 0) {
        const order = await api.payments.createOrder([{ name: `Stylist Session - ${selectedTier.name}`, price: selectedTier.price, quantity: 1 }], selectedTier.price);
        setBookingSuccess({
          bookingId: `BK_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          tier: selectedTier,
          stylist: selectedStylist,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          goal: stylingGoal,
          amount: selectedTier.price,
          txnId: order.orderId || `TXN_${Date.now()}`
        });
      } else {
        // ₹0 Free Tier
        setBookingSuccess({
          bookingId: `BK_FREE_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          tier: selectedTier,
          stylist: selectedStylist,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          goal: stylingGoal,
          amount: 0,
          txnId: 'FREE_STYLE_REVIEW'
        });
      }
    } catch (err) {
      console.error('Error booking stylist session:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fitted-brown/10 text-fitted-brown text-xs font-bold uppercase tracking-wider border border-fitted-brown/20">
          <UserCheck className="w-4 h-4 text-fitted-brown" />
          <span>Personal Stylist Consultations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-fitted-charcoal tracking-tight">
          Book Your 1-on-1 Stylist Session
        </h1>
        <p className="text-sm sm:text-base text-fitted-muted leading-relaxed">
          Elevate your wardrobe with personalized advice from India’s top celebrity stylists and AI fashion intelligence. Select a pricing plan below to schedule your session.
        </p>
      </div>

      {/* Pricing Tiers Section (Matching User Screenshot) */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-fitted-charcoal">Pricing Tiers</h2>
          <p className="text-xs text-fitted-muted">Flexible options tailored for quick reviews, per-session advice, or monthly styling support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`bg-white rounded-3xl p-6 flex flex-col justify-between border cursor-pointer transition-all relative overflow-hidden shadow-cream-card ${
                  isSelected 
                    ? 'border-fitted-brown ring-2 ring-fitted-brown/30 shadow-2xl scale-[1.02]' 
                    : 'border-fitted-border hover:border-fitted-brown/50'
                }`}
              >
                {tier.badge && (
                  <div className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    tier.highlight 
                      ? 'bg-fitted-brown text-white shadow-sm' 
                      : 'bg-fitted-bg text-fitted-brown border border-fitted-brown/20'
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-fitted-charcoal font-display">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-fitted-charcoal">{tier.priceLabel}</span>
                      <span className="text-xs text-fitted-muted font-medium">— {tier.periodLabel}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-fitted-muted pt-2 border-t border-fitted-border">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-fitted-brown shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(tier);
                  }}
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-fitted-brown text-white shadow-glow-brown'
                      : 'bg-fitted-bg text-fitted-charcoal border border-fitted-border hover:bg-fitted-bgSoft'
                  }`}
                >
                  {isSelected ? 'Selected Plan ✓' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form Card */}
      {!bookingSuccess ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-fitted-border shadow-cream-card space-y-8 max-w-4xl mx-auto">
          
          <div className="border-b border-fitted-border pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-fitted-brown/10 border border-fitted-brown/20 flex items-center justify-center text-fitted-brown">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fitted-charcoal font-display">Schedule Your Consultation</h3>
                <p className="text-xs text-fitted-muted">Selected Tier: <strong className="text-fitted-brown">{selectedTier.name} ({selectedTier.priceLabel})</strong></p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Guaranteed Satisfaction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Step 1: Select Stylist */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>1. Select Expert Stylist</span>
              </label>

              <div className="space-y-3">
                {stylists.map((st) => {
                  const isSel = selectedStylist.id === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStylist(st)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                        isSel 
                          ? 'border-fitted-brown bg-fitted-bg/60 shadow-xs' 
                          : 'border-fitted-border hover:border-fitted-brown/40 bg-white'
                      }`}
                    >
                      <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-xl object-cover border border-fitted-brown" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-fitted-charcoal truncate">{st.name}</h4>
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{st.rating} ({st.reviews})</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-fitted-muted truncate">{st.role}</p>
                        <div className="flex items-center gap-1 pt-1 text-[9px] text-fitted-brown">
                          <span>Specializes: {st.brands.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date, Time & Goals */}
            <div className="space-y-6">
              
              {/* Date & Time */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>2. Pick Date & Time Slot</span>
                </label>

                <div>
                  <label className="text-[10px] text-fitted-muted uppercase font-semibold">Consultation Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-fitted-border text-fitted-charcoal text-xs font-medium focus:border-fitted-brown outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-fitted-muted uppercase font-semibold">Time Slot</label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                          selectedTimeSlot === slot
                            ? 'bg-fitted-brown text-white font-bold shadow-xs'
                            : 'bg-fitted-bg text-fitted-charcoal border border-fitted-border hover:bg-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Styling Goals */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fitted-brown flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-fitted-brown" />
                  <span>3. Styling Goals / Occasion Focus</span>
                </label>
                <select
                  value={stylingGoal}
                  onChange={(e) => setStylingGoal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-fitted-border text-fitted-charcoal text-xs font-medium focus:border-fitted-brown outline-none"
                >
                  <option value="Occasion & Wedding Outfit Curation">Occasion & Wedding Outfit Curation</option>
                  <option value="Executive Workwear & Fit Tapering">Executive Workwear & Fit Tapering</option>
                  <option value="Casual & Streetwear Wardrobe Refresh">Casual & Streetwear Wardrobe Refresh</option>
                  <option value="Festive & Royal Heritage Styling">Festive & Royal Heritage Styling</option>
                </select>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2 text-xs">
                <div className="flex justify-between font-semibold border-b border-fitted-border/60 pb-1.5">
                  <span className="text-fitted-muted">Selected Tier:</span>
                  <span className="text-fitted-charcoal font-bold">{selectedTier.name} ({selectedTier.priceLabel})</span>
                </div>
                <div className="flex justify-between font-semibold border-b border-fitted-border/60 pb-1.5">
                  <span className="text-fitted-muted">Stylist:</span>
                  <span className="text-fitted-brown font-bold">{selectedStylist.name}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-fitted-muted">Schedule:</span>
                  <span className="text-fitted-charcoal font-bold">{selectedDate} @ {selectedTimeSlot}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-fitted-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-fitted-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant Confirmation & Calendar Invite</span>
            </div>

            <button
              onClick={handleBookSession}
              disabled={isProcessing}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-glow-brown disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm Booking ({selectedTier.priceLabel})</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-fitted-border shadow-2xl max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-fitted-charcoal font-display">Stylist Session Confirmed!</h2>
            <p className="text-xs text-fitted-muted">Booking Reference: <strong className="text-fitted-brown font-mono">{bookingSuccess.bookingId}</strong></p>
          </div>

          <div className="bg-fitted-bg rounded-2xl p-6 space-y-3 text-left border border-fitted-border text-xs">
            <div className="flex justify-between border-b border-fitted-border/60 pb-2">
              <span className="text-fitted-muted">Plan:</span>
              <span className="font-bold text-fitted-charcoal">{bookingSuccess.tier.name} ({bookingSuccess.tier.priceLabel})</span>
            </div>
            <div className="flex justify-between border-b border-fitted-border/60 pb-2">
              <span className="text-fitted-muted">Assigned Stylist:</span>
              <span className="font-bold text-fitted-brown">{bookingSuccess.stylist.name} ({bookingSuccess.stylist.role})</span>
            </div>
            <div className="flex justify-between border-b border-fitted-border/60 pb-2">
              <span className="text-fitted-muted">Date & Time:</span>
              <span className="font-bold text-fitted-charcoal">{bookingSuccess.date} @ {bookingSuccess.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fitted-muted">Goal / Focus:</span>
              <span className="font-bold text-fitted-charcoal">{bookingSuccess.goal}</span>
            </div>
          </div>

          <p className="text-xs text-fitted-muted">
            We have sent a calendar invite and video consultation link to <strong className="text-fitted-charcoal">{user?.email || 'your email'}</strong>.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/recommendations')}
              className="px-6 py-3 rounded-xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all"
            >
              Back to Product Recommendations
            </button>
            <button
              onClick={() => setBookingSuccess(null)}
              className="px-6 py-3 rounded-xl bg-white border border-fitted-border text-fitted-charcoal font-semibold text-xs hover:bg-fitted-bg transition-all"
            >
              Book Another Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
