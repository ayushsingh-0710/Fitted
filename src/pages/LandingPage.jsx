import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Shirt, 
  Compass, 
  SlidersHorizontal, 
  CheckCircle2, 
  Star,
  Bot
} from 'lucide-react';

export default function LandingPage() {
  return (

    <div className="space-y-24 pb-16 overflow-hidden bg-[#FAF6ED]">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Background Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-fitted-sand/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-fitted-brown/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-fitted-border text-fitted-brown text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Stylist Fashion Intelligence Engine</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-fitted-charcoal tracking-tight leading-[1.08]">
              Wear what <br className="hidden sm:inline" />
              <span className="brown-gradient-text">works for you.</span>
            </h1>

            {/* Supporting Message */}
            <p className="text-base sm:text-lg text-fitted-muted max-w-2xl leading-relaxed font-normal mx-auto lg:mx-0">
              Fitted understands your style, your wardrobe, and what you're looking for — so getting dressed and shopping smarter becomes effortless.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <NavLink
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-fitted-brown text-white font-bold text-sm tracking-wide hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-3 shadow-glow-brown"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <NavLink
                to="/discover"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-fitted-charcoal border border-fitted-border hover:border-fitted-brown text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4 text-fitted-brown" />
                <span>Explore Fitted</span>
              </NavLink>
            </div>

            {/* Micro Stats */}
            <div className="pt-8 border-t border-fitted-border grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-fitted-charcoal font-display">94%</p>
                <p className="text-xs text-fitted-muted">Color Match Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fitted-charcoal font-display">3.2x</p>
                <p className="text-xs text-fitted-muted">Wardrobe Reuse</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fitted-charcoal font-display">100%</p>
                <p className="text-xs text-fitted-muted">Personalized</p>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card Mockup */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-cream-card border border-fitted-border space-y-6">
              
              {/* OOTD Live Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-fitted-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-fitted-bg border border-fitted-border flex items-center justify-center text-fitted-brown font-bold">
                    92
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-fitted-charcoal">Daily OOTD Score</h3>
                    <p className="text-[11px] text-fitted-brown font-medium">High Visual Harmony</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-fitted-brown/15 text-fitted-brown uppercase">
                  Live AI Scan
                </span>
              </div>

              {/* Showcase Image Stack */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                  alt="Fashion Intelligence Showcase"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold text-fitted-sandLight tracking-wider">Analyzed Breakdown</span>
                  <p className="text-xs font-semibold text-white">Structured Blazer + Terracotta Knit Layering</p>
                </div>
              </div>

              {/* AI Insight Bullet Pill */}
              <div className="p-3.5 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2 text-xs">
                <div className="flex items-center gap-2 text-fitted-brown font-bold">
                  <Bot className="w-4 h-4" />
                  <span>Personal Stylist Tip</span>
                </div>
                <p className="text-fitted-muted text-[11px] leading-relaxed">
                  "The cognac brown tones in your inner layer enhance your skin tone. Pair with deep selvedge denim for vertical ratio accentuation."
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Section 1: The Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fitted-brown">Personal Stylist Reimagined</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">
            Everything you need to master your personal style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="glass-card rounded-3xl p-8 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-fitted-brown/10 text-fitted-brown flex items-center justify-center border border-fitted-brown/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-fitted-charcoal">1. OOTD AI Feedback</h3>
            <p className="text-xs text-fitted-muted leading-relaxed">
              Upload outfit photos or select items from your closet to instantly receive color harmony scores, fit proportion evaluations, and occasion advice.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-fitted-brown group-hover:translate-x-1 transition-transform">
              <span>Try OOTD Scan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card rounded-3xl p-8 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-fitted-rose/10 text-fitted-rose flex items-center justify-center border border-fitted-rose/20">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-fitted-charcoal">2. Wardrobe Digitizer</h3>
            <p className="text-xs text-fitted-muted leading-relaxed">
              Catalog your clothes seamlessly with auto-tagging, wear metrics, and category filtering. Stop wearing the same 20% of your closet.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-fitted-rose group-hover:translate-x-1 transition-transform">
              <span>Digitize Closet</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card rounded-3xl p-8 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-fitted-sand/15 text-fitted-sand flex items-center justify-center border border-fitted-sand/30">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-fitted-charcoal">3. Smart Recommendations</h3>
            <p className="text-xs text-fitted-muted leading-relaxed">
              Shop items guaranteed to work with what you already own. We identify closet gaps and calculate match confidence percentages for every item.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-fitted-sand group-hover:translate-x-1 transition-transform">
              <span>Explore Shop</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-fitted-border shadow-cream-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-fitted-brown text-white uppercase">
                Wardrobe Gap Analysis
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">
                Never buy something that sits in your closet unworn.
              </h2>
              <p className="text-sm text-fitted-muted leading-relaxed">
                Fitted cross-references your current wardrobe inventory against curated luxury and contemporary pieces, giving you a precise compatibility rating before you purchase.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-fitted-charcoal font-medium">
                  <CheckCircle2 className="w-4 h-4 text-fitted-brown" />
                  <span>Calculates color undertone harmony automatically</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fitted-charcoal font-medium">
                  <CheckCircle2 className="w-4 h-4 text-fitted-brown" />
                  <span>Shows exact wardrobe items the product pairs with</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fitted-charcoal font-medium">
                  <CheckCircle2 className="w-4 h-4 text-fitted-brown" />
                  <span>Razorpay test mode enabled for seamless checkout validation</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-fitted-border shadow-md">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                alt="Personal Fashion Engine"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fitted-brown">Member Feedback</h2>
          <p className="text-3xl font-display font-bold text-fitted-charcoal">Loved by fashion-forward professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex items-center gap-1 text-fitted-sand">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-fitted-sand" />
              ))}
            </div>
            <p className="text-xs text-fitted-muted leading-relaxed">
              "Fitted completely changed how I get dressed for morning meetings. The OOTD AI feedback gave me the confidence to pair structured blazers with raw denim."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-fitted-brown/15 flex items-center justify-center font-bold text-xs text-fitted-brown">
                JD
              </div>
              <div>
                <p className="text-xs font-bold text-fitted-charcoal">Julian Drake</p>
                <p className="text-[10px] text-fitted-muted">Design Director</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex items-center gap-1 text-fitted-sand">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-fitted-sand" />
              ))}
            </div>
            <p className="text-xs text-fitted-muted leading-relaxed">
              "The Wardrobe-Gap shopping engine is brilliant. Every item I purchased through Fitted's recommendation engine fits into my existing closet seamlessly."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-fitted-rose/15 flex items-center justify-center font-bold text-xs text-fitted-rose">
                SC
              </div>
              <div>
                <p className="text-xs font-bold text-fitted-charcoal">Sophia Chen</p>
                <p className="text-[10px] text-fitted-muted">Founder & Stylist</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex items-center gap-1 text-fitted-sand">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-fitted-sand" />
              ))}
            </div>
            <p className="text-xs text-fitted-muted leading-relaxed">
              "Super clean interface! The body proportion breakdown and skin undertone analysis made shopping for coats effortless."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-fitted-sand/20 flex items-center justify-center font-bold text-xs text-fitted-sand">
                MR
              </div>
              <div>
                <p className="text-xs font-bold text-fitted-charcoal">Marcus Ross</p>
                <p className="text-[10px] text-fitted-muted">Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-white p-12 rounded-3xl space-y-6 border border-fitted-border shadow-cream-card relative">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-fitted-charcoal">
            Ready to discover what <span className="brown-gradient-text">works for you?</span>
          </h2>
          <p className="text-sm text-fitted-muted max-w-xl mx-auto">
            Join Fitted today and unlock personalized style scoring, digital closet management, and AI recommendations.
          </p>
          <div className="pt-4">
            <NavLink
              to="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-fitted-brown text-white font-bold text-sm hover:bg-fitted-brownDark transition-all shadow-glow-brown"
            >
              <span>Create Your Style Profile</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

    </div>
  );
}
