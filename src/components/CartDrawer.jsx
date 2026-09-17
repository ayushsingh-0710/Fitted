import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6ED] border-l border-fitted-border shadow-2xl flex flex-col text-fitted-charcoal">
          
          {/* Drawer Header */}
          <div className="p-6 bg-white border-b border-fitted-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-fitted-brown/10 text-fitted-brown border border-fitted-brown/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-fitted-charcoal font-display">Your Fitted Bag</h3>
                <p className="text-xs text-fitted-muted">{cart.length} item(s) selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-fitted-muted hover:text-fitted-charcoal hover:bg-fitted-bg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-fitted-muted mx-auto" />
                <p className="text-sm text-fitted-muted">Your bag is currently empty.</p>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/recommendations'); }}
                  className="px-5 py-2.5 text-xs font-bold bg-fitted-brown text-white rounded-xl shadow-glow-brown hover:bg-fitted-brownDark transition-all"
                >
                  Explore Recommendations
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-3.5 rounded-2xl bg-white border border-fitted-border shadow-sm relative group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover border border-fitted-border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-fitted-charcoal line-clamp-1">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-fitted-muted hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-fitted-muted">{item.product.brand} • Size {item.size}</p>
                      
                      {/* Match Badge */}
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-fitted-brown/10 text-fitted-brown text-[9px] font-bold border border-fitted-brown/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.product.matchScore || 94}% Style Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-fitted-bg px-2 py-1 rounded-lg border border-fitted-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="text-xs text-fitted-muted hover:text-fitted-charcoal px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-fitted-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="text-xs text-fitted-muted hover:text-fitted-charcoal px-1"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-fitted-brown">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-fitted-border space-y-4 bg-white shadow-lg">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-fitted-muted">
                  <span>Subtotal</span>
                  <span className="text-fitted-charcoal font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-fitted-muted">
                  <span>Personalized Styling Consultation</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-fitted-charcoal pt-2 border-t border-fitted-border">
                  <span>Total</span>
                  <span className="text-fitted-brown font-extrabold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-brownDark transition-all shadow-glow-brown"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-fitted-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-fitted-brown" />
                <span>Protected by Razorpay Test Sandbox Security</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
