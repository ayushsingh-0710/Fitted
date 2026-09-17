import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Star, 
  Shirt, 
  RefreshCw,
  ChevronLeft
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const data = await api.recommendations.getProductById(id);
      if (data) {
        setProduct(data);
        setSelectedImage(data.image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-fitted-brown animate-spin mx-auto mb-4" />
        <p className="text-sm text-fitted-muted">Loading personalized product intelligence...</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-fitted-muted hover:text-fitted-charcoal flex items-center gap-1 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Recommendations</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-fitted-border shadow-cream-card h-[480px]">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-fitted-brown/30 text-fitted-brown text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>{product.matchScore || 94}% Match Confidence</span>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-fitted-brown scale-105 shadow-sm' : 'border-fitted-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Intelligence Details */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-fitted-brown uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.8}</span>
                <span className="text-fitted-muted font-normal">({product.reviewsCount || 120} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-display font-bold text-fitted-charcoal">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-fitted-brown">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-fitted-muted line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* AI Synergy Box */}
          <div className="bg-white p-5 rounded-2xl space-y-3 border border-fitted-border shadow-sm">
            <div className="flex items-center gap-2 text-fitted-brown font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Fashion Intelligence Compatibility Note</span>
            </div>
            <p className="text-xs text-fitted-charcoal leading-relaxed">
              {product.matchReason || product.bodySuitability || "Curated to complement your wardrobe and proportions."}
            </p>
            {product.pairedItemName && (
              <div className="pt-2 border-t border-fitted-border flex items-center gap-2 text-xs text-fitted-brown font-semibold">
                <Shirt className="w-4 h-4 shrink-0" />
                <span>Direct pairing in your closet: {product.pairedItemName}</span>
              </div>
            )}
          </div>

          {/* Fabric & Fit Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-fitted-border space-y-1 shadow-xs">
              <span className="text-fitted-muted">Fabric Composition</span>
              <p className="text-fitted-charcoal font-semibold">{product.fabric || '100% Breathable Cotton'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-fitted-border space-y-1 shadow-xs">
              <span className="text-fitted-muted">Silhouette Fit</span>
              <p className="text-fitted-charcoal font-semibold">{product.fitType || `${product.fit || 'Regular'} Fit`}</p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-fitted-charcoal">Select Size</span>
              <span className="text-fitted-brown text-[11px] font-semibold">AI Fit Predictor: Size {selectedSize}</span>
            </div>
            <div className="flex items-center gap-3">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-fitted-brown text-white border border-fitted-brown shadow-glow-brown'
                      : 'bg-white text-fitted-charcoal border border-fitted-border hover:border-fitted-brown'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleAdd}
              className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-fitted-charcoal border border-fitted-border hover:border-fitted-brown'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{added ? 'Added to Bag' : 'Add to Fitted Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-glow-brown"
            >
              <span>Buy with Razorpay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-fitted-muted pt-2">
            <ShieldCheck className="w-4 h-4 text-fitted-brown" />
            <span>30-Day Guaranteed Fit Exchange & Free Express Shipping</span>
          </div>

        </div>

      </div>

    </div>
  );
}
