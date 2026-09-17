import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, CreditCard, ArrowRight } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="bg-[#FAF6ED] border-t border-fitted-border text-fitted-muted pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-fitted-border">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 px-3 py-1 bg-white rounded-xl border border-fitted-border shadow-xs flex items-center justify-center">
                <img src="/fitted-emblem-logo.jpg" alt="Fitted Emblem" className="h-7 w-7 object-contain rounded-lg" />
                <span className="font-display text-lg font-bold tracking-tight text-fitted-charcoal ml-2">FITTED</span>
              </div>
            </div>
            <p className="text-sm text-fitted-muted leading-relaxed max-w-sm">
              Personalized fashion intelligence platform combining style profile analytics, wardrobe digitizing, and AI-curated shopping recommendations.
            </p>

            {/* Architecture badging */}
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-fitted-border text-fitted-teal font-semibold shadow-xs">
                <Cpu className="w-3.5 h-3.5 text-fitted-teal" />
                Qwen ML Engine Ready
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-fitted-border text-fitted-rose font-semibold shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-fitted-rose" />
                Razorpay Ready
              </span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-fitted-charcoal uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><NavLink to="/ootd" className="hover:text-fitted-teal transition-colors">OOTD AI Analyzer</NavLink></li>
              <li><NavLink to="/wardrobe" className="hover:text-fitted-teal transition-colors">Wardrobe Digitizer</NavLink></li>
              <li><NavLink to="/discover" className="hover:text-fitted-teal transition-colors">Style & Trend Engine</NavLink></li>
              <li><NavLink to="/recommendations" className="hover:text-fitted-teal transition-colors">Personalized Shop</NavLink></li>
            </ul>
          </div>

          {/* Column 2: Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-fitted-charcoal uppercase tracking-wider">Technology</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-fitted-charcoal transition-colors">FastAPI Python Backend</li>
              <li className="hover:text-fitted-charcoal transition-colors">MongoDB Async Engine</li>
              <li className="hover:text-fitted-charcoal transition-colors">Groq Multimodal AI</li>
              <li className="hover:text-fitted-charcoal transition-colors">Razorpay Payment Gateway</li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-fitted-charcoal uppercase tracking-wider">Stay Fitted</h4>
            <p className="text-xs text-fitted-muted">Subscribe for weekly fashion intelligence insights.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-teal shadow-xs"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-fitted-teal text-white hover:bg-fitted-tealDark transition-all shadow-xs"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fitted-muted">
          <p>© {new Date().getFullYear()} Fitted Personal Stylist. Wear what works for you.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-fitted-charcoal">Privacy Policy</a>
            <a href="#terms" className="hover:text-fitted-charcoal">Terms of Service</a>
            <a href="#security" className="hover:text-fitted-charcoal">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
