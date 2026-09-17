import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Bot,
  Sparkle
} from 'lucide-react';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [activeOccasion, setActiveOccasion] = useState('Creative Workspace');
  const [activeVibe, setActiveVibe] = useState('Minimalist Luxe');
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const occasions = ['Creative Workspace', 'Formal Evening', 'Weekend Casual', 'Resort / Travel', 'Streetwear Nightout'];
  const vibes = ['Minimalist Luxe', 'Old Money Tailored', 'Modern Technical', 'Relaxed High-Low'];

  const quizQuestions = [
    {
      question: "What silhouette makes you feel most confident?",
      options: [
        "Structured shoulder with tailored trousers",
        "Clean oversized drop-shoulder tops",
        "Classic fitted oxford shirts & selvedge denim",
        "Technical outerwear with utilitarian pants"
      ]
    },
    {
      question: "Which color palette dominates your preference?",
      options: [
        "Monochrome (Obsidian, Charcoal, Off-White)",
        "Warm Earthy Tones (Camel, Tobacco Suede, Cream)",
        "Deep Jewel Tones (Emerald, Midnight Blue, Burgundy)",
        "High-Contrast Neutrals with Gold Accessories"
      ]
    },
    {
      question: "What is your primary fashion goal right now?",
      options: [
        "Build a versatile capsule wardrobe",
        "Elevate smart casual workwear outfits",
        "Discover rare designer pieces that complement existing closet",
        "Understand my body proportions & color undertones better"
      ]
    }
  ];

  const lookbooks = [
    {
      id: 'look_01',
      title: 'Architectural Minimalist',
      tag: 'Trending Silhouette',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      matchScore: 98,
      items: ['Structured Charcoal Blazer', 'Off-White Tee', 'Pleated Tapered Trousers']
    },
    {
      id: 'look_02',
      title: 'Milanese Evening Tailoring',
      tag: 'Formal Luxe',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      matchScore: 95,
      items: ['Italian Merino Overcoat', 'Cashmere Turtleneck', 'Chelsea Boots']
    },
    {
      id: 'look_03',
      title: 'Tokyo Streetwear Elevate',
      tag: 'Casual High-Low',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
      matchScore: 92,
      items: ['Raw Denim Jacket', 'Heavyweight Cream Tee', 'Retro Sneakers']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-fitted-border shadow-cream-card">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown text-xs font-bold uppercase tracking-wider border border-fitted-brown/20">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Style & Trend Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">Discover Your Aesthetics</h1>
          <p className="text-xs sm:text-sm text-fitted-muted">
            Explore curated outfit combinations matched specifically to your undertone and body shape.
          </p>
        </div>

        <button
          onClick={() => { setQuizOpen(true); setQuizStep(0); }}
          className="px-6 py-3.5 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center gap-2 shadow-glow-brown shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Take 60-Sec AI Style Quiz</span>
        </button>
      </div>

      {/* Occasion & Vibe Filters */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-fitted-brown" />
            <span>Filter by Occasion</span>
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setActiveOccasion(occ)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeOccasion === occ
                    ? 'bg-fitted-brown text-white font-bold shadow-sm'
                    : 'bg-white text-fitted-muted border border-fitted-border hover:text-fitted-charcoal'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2 mb-2">
            <Sparkle className="w-4 h-4 text-fitted-brown" />
            <span>Aesthetic Vibe</span>
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {vibes.map((vibe) => (
              <button
                key={vibe}
                onClick={() => setActiveVibe(vibe)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeVibe === vibe
                    ? 'bg-fitted-brown text-white font-bold shadow-sm'
                    : 'bg-white text-fitted-muted border border-fitted-border hover:text-fitted-charcoal'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Curated Lookbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {lookbooks.map((lb) => (
          <div key={lb.id} className="bg-white rounded-3xl overflow-hidden group flex flex-col justify-between border border-fitted-border shadow-cream-card hover:border-fitted-brown/40 transition-all">
            <div className="relative h-80 overflow-hidden bg-fitted-bgSoft">
              <img
                src={lb.image}
                alt={lb.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-fitted-brown border border-fitted-border shadow-sm">
                {lb.tag}
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-fitted-brown text-white text-[10px] font-bold shadow-sm">
                {lb.matchScore}% Style Match
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <h3 className="text-lg font-bold text-white font-display">{lb.title}</h3>
                <p className="text-[11px] text-gray-200">Target: {activeOccasion}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-fitted-muted uppercase tracking-wider">Lookbook Formula</p>
                <div className="flex flex-wrap gap-1.5">
                  {lb.items.map((item, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-fitted-bg text-[10px] font-semibold text-fitted-charcoal border border-fitted-border">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/recommendations')}
                className="w-full py-3 rounded-xl bg-fitted-bg hover:bg-fitted-bgSoft text-fitted-brown text-xs font-semibold border border-fitted-border transition-all flex items-center justify-center gap-2"
              >
                <span>Shop This Look Formula</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Style Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white p-8 rounded-3xl space-y-6 shadow-2xl border border-fitted-border animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-fitted-border pb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-fitted-brown" />
                <h3 className="text-base font-bold text-fitted-charcoal font-display">AI Style Personality Quiz</h3>
              </div>
              <span className="text-xs text-fitted-muted font-mono">Step {quizStep + 1} of 3</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-fitted-charcoal">{quizQuestions[quizStep].question}</h4>
              <div className="space-y-2">
                {quizQuestions[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (quizStep < 2) {
                        setQuizStep(quizStep + 1);
                      } else {
                        setQuizOpen(false);
                        navigate('/recommendations');
                      }
                    }}
                    className="w-full p-3.5 rounded-2xl bg-fitted-bg hover:bg-fitted-brown/10 hover:border-fitted-brown text-left text-xs font-medium text-fitted-charcoal border border-fitted-border transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setQuizOpen(false)}
              className="w-full text-center text-xs text-fitted-muted hover:text-fitted-charcoal"
            >
              Cancel Quiz
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

