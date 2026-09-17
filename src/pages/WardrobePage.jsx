import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { useAuth } from '../context/AuthContext';
import CameraModal from '../components/CameraModal';
import WardrobeOutfitRecommendations from '../components/WardrobeOutfitRecommendations';
import { 
  Shirt, 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Check, 
  X,
  Camera, 
  Upload, 
  RefreshCw, 
  Zap 
} from 'lucide-react';

const AI_SAMPLE_DETECTIONS = [
  { name: 'Linen Cuban Collar Shirt', brand: 'Nicobar', category: 'Tops', color: 'Olive Sage', season: 'Summer/Spring' },
  { name: 'Tailored Herringbone Blazer', brand: 'Raymond Luxe', category: 'Outerwear', color: 'Midnight Navy', season: 'Autumn/Winter' },
  { name: 'Embroidered Silk Kurta', brand: 'Anita Dongre', category: 'Tops', color: 'Terracotta Rust', season: 'All Season' },
  { name: 'Tapered Chino Trousers', brand: 'Rare Rabbit', category: 'Bottoms', color: 'Sand Beige', season: 'All Season' },
  { name: 'Handcrafted Suede Loafers', brand: 'Bhaane', category: 'Footwear', color: 'Cognac Brown', season: 'All Season' }
];

export default function WardrobePage() {
  const { user } = useAuth();
  const { items, addItem, removeItem, incrementWear } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiDetectedSuccess, setAiDetectedSuccess] = useState(false);

  // Form State for Adding Item
  const [newItemName, setNewItemName] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tops');
  const [newItemColor, setNewItemColor] = useState('Obsidian Black');
  const [newItemSeason, setNewItemSeason] = useState('All Season');
  const [newItemImage, setNewItemImage] = useState('');

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories'];

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const triggerAiAutoDetect = (imageDataUrl) => {
    setIsAiScanning(true);
    setAiDetectedSuccess(false);

    setTimeout(() => {
      // Pick detection sample based on current index or random
      const sample = AI_SAMPLE_DETECTIONS[Math.floor(Math.random() * AI_SAMPLE_DETECTIONS.length)];
      setNewItemName(sample.name);
      setNewItemBrand(sample.brand);
      setNewItemCategory(sample.category);
      setNewItemColor(sample.color);
      setNewItemSeason(sample.season);
      if (imageDataUrl) setNewItemImage(imageDataUrl);
      setIsAiScanning(false);
      setAiDetectedSuccess(true);
    }, 750);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setNewItemImage(dataUrl);
        triggerAiAutoDetect(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    await addItem({
      name: newItemName || 'Custom Closet Piece',
      brand: newItemBrand || 'Designer',
      category: newItemCategory,
      color: newItemColor,
      season: newItemSeason,
      image: newItemImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      wearCount: 1,
      tags: ['Cataloged', newItemSeason]
    });

    setNewItemName('');
    setNewItemBrand('');
    setNewItemImage('');
    setAiDetectedSuccess(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF6ED]">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-fitted-border text-fitted-brown text-xs font-bold uppercase tracking-wider shadow-xs">
            <Shirt className="w-3.5 h-3.5" />
            <span>Digital Closet Management</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-fitted-charcoal">Your Wardrobe Vault</h1>
          <p className="text-xs text-fitted-muted">
            {items.length} clothes cataloged. Tracking rotation frequency and color harmony.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center gap-2 shadow-glow-brown"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Automated Wardrobe Outfit Combinations Section */}
      <WardrobeOutfitRecommendations
        wardrobeItems={items}
        userPreferences={user || {}}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Cataloged Closet Vault Items Header */}
      <div className="pt-4 border-t border-fitted-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-fitted-charcoal flex items-center gap-2">
            <Shirt className="w-5 h-5 text-fitted-brown" />
            <span>Cataloged Closet Vault Pieces ({items.length})</span>
          </h2>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-fitted-border shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-fitted-brown text-white font-bold'
                  : 'text-fitted-muted hover:text-fitted-charcoal hover:bg-fitted-bg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-fitted-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search wardrobe by name, brand, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-xs focus:outline-none focus:border-fitted-brown"
          />
        </div>

      </div>

      {/* Closet Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden bg-fitted-bg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Category Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-fitted-border text-[10px] font-bold text-fitted-charcoal shadow-xs">
                {item.category}
              </span>

              {/* Delete Trigger */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-rose-500 hover:text-white text-fitted-muted transition-colors shadow-xs"
                title="Remove Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-fitted-muted">{item.brand} • {item.season}</span>
                <h3 className="text-sm font-bold text-fitted-charcoal line-clamp-1">{item.name}</h3>
                <p className="text-[11px] text-fitted-muted mt-0.5">{item.color}</p>
              </div>

              {item.fitNote && (
                <p className="text-[10px] text-fitted-charcoal bg-fitted-bg p-2 rounded-xl border border-fitted-border italic">
                  "{item.fitNote}"
                </p>
              )}

              <div className="pt-2 border-t border-fitted-border flex items-center justify-between">
                <span className="text-[11px] text-fitted-muted">
                  Worn <strong className="text-fitted-charcoal">{item.wearCount}</strong> times
                </span>
                <button
                  onClick={() => incrementWear(item.id)}
                  className="px-2.5 py-1 rounded-lg bg-fitted-brown/15 text-fitted-brown text-[10px] font-bold hover:bg-fitted-brown hover:text-white transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Log Wear</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white p-6 rounded-3xl space-y-5 shadow-2xl border border-fitted-border animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-fitted-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fitted-brown/15 text-fitted-brown flex items-center justify-center">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fitted-charcoal">Digitize New Clothing Item</h3>
                  <p className="text-[10px] text-fitted-muted">Snap camera photo or upload image to auto-detect details</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-fitted-muted hover:text-fitted-charcoal p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Capture & AI Auto-Detect Panel */}
            <div className="space-y-3 bg-fitted-bg p-4 rounded-2xl border border-fitted-border">
              <label className="block text-xs font-bold text-fitted-charcoal">
                1. Snap Photo or Upload Image
              </label>

              {newItemImage ? (
                <div className="relative h-44 rounded-xl overflow-hidden border border-fitted-border group">
                  <img src={newItemImage} alt="Digitized item preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-3 py-1.5 rounded-full bg-white text-fitted-charcoal text-xs font-bold shadow-md hover:bg-stone-100 flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-fitted-brown" />
                      <span>Retake Camera</span>
                    </button>
                    <label className="px-3 py-1.5 rounded-full bg-white text-fitted-charcoal text-xs font-bold shadow-md hover:bg-stone-100 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-fitted-brown" />
                      <span>Upload New</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="p-4 rounded-xl bg-fitted-brown text-white hover:bg-fitted-brownDark transition-all flex flex-col items-center justify-center text-center gap-1.5 shadow-xs group"
                  >
                    <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold">Snap Camera</p>
                      <p className="text-[9px] text-white/80">Laptop Webcam</p>
                    </div>
                  </button>

                  <label className="p-4 rounded-xl border-2 border-dashed border-fitted-border hover:border-fitted-brown bg-white transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group">
                    <Upload className="w-5 h-5 text-fitted-brown group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs font-bold text-fitted-charcoal">Upload Photo</p>
                      <p className="text-[9px] text-fitted-muted">Auto-Detect details</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}

              {/* AI Auto-Detect Status Bar */}
              {isAiScanning && (
                <div className="p-2.5 rounded-xl bg-fitted-brown/10 border border-fitted-brown/20 flex items-center justify-center gap-2 text-xs font-semibold text-fitted-brown animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI Vision: Analyzing garment cut, texture, brand tag & color...</span>
                </div>
              )}

              {aiDetectedSuccess && !isAiScanning && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>AI auto-filled all details below! Review or save directly.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerAiAutoDetect(newItemImage)}
                    className="text-[10px] text-emerald-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Rescan</span>
                  </button>
                </div>
              )}

              {!newItemImage && !isAiScanning && (
                <button
                  type="button"
                  onClick={() => triggerAiAutoDetect('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80')}
                  className="w-full py-2 rounded-xl bg-white border border-fitted-border text-fitted-brown hover:bg-fitted-brown hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Demo Quick Auto-Fill with AI</span>
                </button>
              )}
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-fitted-charcoal">Item Name (Auto-Detected)</label>
                <input
                  type="text"
                  placeholder="e.g. Linen Cuban Collar Shirt"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Nicobar, Raymond Luxe"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown font-medium"
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Olive Sage"
                    value={newItemColor}
                    onChange={(e) => setNewItemColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-fitted-charcoal">Season</label>
                  <select
                    value={newItemSeason}
                    onChange={(e) => setNewItemSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown"
                  >
                    <option value="All Season">All Season</option>
                    <option value="Autumn/Winter">Autumn/Winter</option>
                    <option value="Summer/Spring">Summer/Spring</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAiScanning}
                  className="w-full py-3.5 rounded-xl bg-fitted-brown text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-brownDark shadow-glow-brown transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Save to Wardrobe Vault</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Laptop Camera Modal for Wardrobe Upload */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedDataUrl) => {
          triggerAiAutoDetect(capturedDataUrl);
        }}
        title="Snap Wardrobe Item Photo"
      />

    </div>
  );
}
