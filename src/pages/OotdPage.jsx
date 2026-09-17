import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { api } from '../services/api';
import CameraModal from '../components/CameraModal';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  CheckCircle2, 
  Bot, 
  RotateCcw, 
  Shirt,
  AlertCircle
} from 'lucide-react';

export default function OotdPage() {

  const { items } = useWardrobe();
  const [selectedItems, setSelectedItems] = useState(['w_01', 'w_03', 'w_04']);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    const steps = [
      'Inspecting shirt silhouette, collar cut & trouser drape...',
      'Evaluating color contrast & fabric tones in natural light...',
      'Checking torso-to-leg proportions and sleeve fit...',
      'Matching outfit versatility across work, dinner & casual settings...',
      'Formulating personal stylist recommendations & footwear pairings...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisProgress(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    const res = await api.ootd.analyzeOutfit({
      itemIds: selectedItems,
      hasCustomImage: !!imagePreview,
      imageBase64: imagePreview
    });

    setAnalysisResult(res);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#FAF6ED]">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-fitted-border text-fitted-brown text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Fashion Intelligence Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">Outfit of the Day (OOTD)</h1>
        <p className="text-xs sm:text-sm text-fitted-muted max-w-xl">
          Get real-time feedback on your fit, color harmony, body proportions, and occasion match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 space-y-6 border border-fitted-border shadow-cream-card">
            
            {/* Photo Upload & Camera Capture */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2">
                  <Camera className="w-4 h-4 text-fitted-brown" />
                  <span>1. Capture or Upload Outfit Photo</span>
                </h3>
                {imagePreview && (
                  <button
                    onClick={() => setImagePreview(null)}
                    className="text-[11px] text-rose-500 hover:underline font-semibold"
                  >
                    Clear Photo
                  </button>
                )}
              </div>

              {imagePreview ? (
                <div className="relative h-60 rounded-2xl overflow-hidden border border-fitted-border shadow-xs group">
                  <img src={imagePreview} alt="Captured OOTD Fit" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="px-3 py-1.5 rounded-full bg-white text-fitted-charcoal text-xs font-bold shadow-md hover:bg-stone-100 flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-fitted-brown" />
                      <span>Retake Camera</span>
                    </button>
                    <label className="px-3 py-1.5 rounded-full bg-white text-fitted-charcoal text-xs font-bold shadow-md hover:bg-stone-100 cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-fitted-brown" />
                      <span>Upload New File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Laptop Camera Snap Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="p-5 rounded-2xl bg-fitted-brown text-white hover:bg-fitted-brownDark transition-all flex flex-col items-center justify-center text-center gap-2 shadow-xs group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Snap with Camera</p>
                      <p className="text-[10px] text-white/80">Use Laptop Webcam</p>
                    </div>
                  </button>

                  {/* File Upload Area */}
                  <label className="p-5 rounded-2xl border-2 border-dashed border-fitted-border hover:border-fitted-brown transition-all flex flex-col items-center justify-center text-center gap-2 bg-fitted-bg cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-fitted-border group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-fitted-brown" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-fitted-charcoal">Upload Photo</p>
                      <p className="text-[10px] text-fitted-muted">JPG, PNG, WEBP</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Closet Combination Selection */}
            <div className="space-y-3 pt-4 border-t border-fitted-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-fitted-brown" />
                  <span>2. Or Select Closet Combination</span>
                </h3>
                <span className="text-[10px] text-fitted-brown font-semibold">{selectedItems.length} items chosen</span>
              </div>

              <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectItem(item.id)}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-fitted-brown text-white border-fitted-brown shadow-xs'
                          : 'bg-fitted-bg border-fitted-border text-fitted-muted hover:border-fitted-brown'
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="w-full h-14 rounded-lg object-cover mb-1" />
                      <p className="text-[10px] font-bold truncate">{item.name}</p>
                      <p className="text-[9px] opacity-80">{item.category}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Scan Trigger */}
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="w-full py-4 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-brownDark transition-all shadow-glow-brown disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Analyzing Outfit...' : 'Run AI Fashion Analysis'}</span>
            </button>

          </div>
        </div>

        {/* Right Column: AI Analysis Results Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {analyzing && (
            <div className="bg-white p-12 rounded-3xl text-center space-y-6 border border-fitted-border shadow-cream-card">
              <div className="w-16 h-16 rounded-full bg-fitted-brown/15 border border-fitted-brown text-fitted-brown flex items-center justify-center mx-auto animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-fitted-charcoal">Fashion Intelligence in Progress</h3>
                <p className="text-xs text-fitted-brown font-mono animate-pulse">{analysisProgress}</p>
              </div>
            </div>
          )}

          {!analyzing && !analysisResult && (
            <div className="bg-white p-12 rounded-3xl text-center space-y-4 text-fitted-muted border border-fitted-border shadow-cream-card">
              <Bot className="w-12 h-12 text-fitted-brown mx-auto" />
              <h3 className="text-lg font-bold text-fitted-charcoal">Ready for your OOTD scan</h3>
              <p className="text-xs max-w-md mx-auto">
                Upload a picture of your outfit or pick items from your digitized closet on the left to see your instant score breakdown.
              </p>
            </div>
          )}

          {analysisResult && (
            analysisResult.isValidOutfit === false ? (
              <div className="bg-white rounded-3xl p-8 space-y-6 border border-amber-200 shadow-cream-card animate-in fade-in text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/60 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                    <span>Validation Check</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-fitted-charcoal">
                    No Person or Outfit Detected
                  </h3>
                  <p className="text-xs text-fitted-muted leading-relaxed">
                    {analysisResult.errorMessage}
                  </p>
                </div>

                <div className="bg-fitted-bg rounded-2xl p-4 border border-fitted-border max-w-md mx-auto space-y-2 text-left text-xs">
                  <p className="font-bold text-fitted-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-fitted-brown" />
                    <span>Stylist Camera Tips:</span>
                  </p>
                  <ul className="space-y-1.5 text-fitted-muted list-disc list-inside">
                    <li>Point the camera at yourself or stand in front of a mirror.</li>
                    <li>Ensure both your top (shirt) and bottom (trousers/skirt) are in view.</li>
                    <li>Avoid pointing the camera directly at empty walls, ceilings, or blank floors.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-fitted-brown text-white text-xs font-bold hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-glow-brown"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo with Camera</span>
                  </button>

                  <label className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-fitted-border text-fitted-charcoal text-xs font-bold hover:bg-fitted-bg transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-fitted-brown" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Main Score Header */}
              <div className="bg-white rounded-3xl p-8 space-y-6 border border-fitted-border shadow-cream-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-fitted-border pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-fitted-brown tracking-widest">
                        Personal Stylist Verdict
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Stylist Approved
                      </span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-fitted-charcoal">{analysisResult.verdict}</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-fitted-bg px-5 py-3 rounded-2xl border border-fitted-border">
                    <span className="text-4xl font-display font-bold text-fitted-brown">{analysisResult.overallScore}</span>
                    <span className="text-xs text-fitted-muted font-semibold">/ 100</span>
                  </div>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-fitted-charcoal font-medium">Color Harmony</span>
                      <span className="text-fitted-brown font-bold">{analysisResult.breakdown.colorHarmony.score}%</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-fitted-border">
                      <div className="bg-fitted-brown h-full rounded-full" style={{ width: `${analysisResult.breakdown.colorHarmony.score}%` }}></div>
                    </div>
                    <p className="text-[11px] text-fitted-charcoal/90 leading-relaxed pt-1">{analysisResult.breakdown.colorHarmony.feedback}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-fitted-charcoal font-medium">Fit & Proportions</span>
                      <span className="text-fitted-teal font-bold">{analysisResult.breakdown.fitProportions.score}%</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-fitted-border">
                      <div className="bg-fitted-teal h-full rounded-full" style={{ width: `${analysisResult.breakdown.fitProportions.score}%` }}></div>
                    </div>
                    <p className="text-[11px] text-fitted-charcoal/90 leading-relaxed pt-1">{analysisResult.breakdown.fitProportions.feedback}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-fitted-charcoal font-medium">Occasion Match</span>
                      <span className="text-emerald-700 font-bold">{analysisResult.breakdown.occasionMatch.score}%</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-fitted-border">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${analysisResult.breakdown.occasionMatch.score}%` }}></div>
                    </div>
                    <p className="text-[11px] text-fitted-charcoal/90 leading-relaxed pt-1">{analysisResult.breakdown.occasionMatch.feedback}</p>
                  </div>

                </div>
              </div>

              {/* Strengths & AI Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Key Strengths */}
                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Stylist's Highlights (What Works)</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs">
                    {analysisResult.strengths.map((str, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal flex items-start gap-2.5 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Improvement Tips */}
                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-fitted-charcoal flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-fitted-brown" />
                    <span>Stylist's Upgrades & Pro Tips</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs">
                    {analysisResult.suggestions.map((sug, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal flex items-start gap-2.5 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-fitted-brown mt-1.5 shrink-0" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Closet Rotation Alert */}
              <div className="p-4 rounded-2xl bg-white border border-fitted-border shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-fitted-brown" />
                  <span className="text-fitted-charcoal">{analysisResult.wearAgainPrompt}</span>
                </div>
                <button
                  onClick={() => runAnalysis()}
                  className="text-fitted-brown hover:underline font-semibold"
                >
                  Rescan Outfit
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Laptop Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedDataUrl) => {
          setImagePreview(capturedDataUrl);
        }}
        title="Snap OOTD Outfit Photo"
      />

    </div>
  );
}
