import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { 
  CreditCard, 
  Lock, 
  ShoppingBag, 
  Building, 
  Check,
  ShieldCheck
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: 'Dixita Mishra',
    street: '742 Evergreen Terrace',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [testOtp, setTestOtp] = useState('123456');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF6ED] min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-fitted-muted mx-auto" />
        <h2 className="text-xl font-bold text-fitted-charcoal font-display">Your bag is empty</h2>
        <button
          onClick={() => navigate('/recommendations')}
          className="px-6 py-3 rounded-2xl bg-fitted-brown text-white font-bold text-xs shadow-glow-brown hover:bg-fitted-brownDark transition-all"
        >
          Browse Recommendations
        </button>
      </div>
    );
  }

  const handleInitiateRazorpay = async () => {
    setIsProcessing(true);
    // Create payment order via backend API
    await api.payments.createOrder(cart, subtotal);
    setIsProcessing(false);
    setRazorpayModalOpen(true);
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    // Verify signature with backend
    const verifyRes = await api.payments.verifyPayment({
      razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 10)}`,
      razorpay_order_id: `ord_${Math.random().toString(36).substring(2, 10)}`,
      razorpay_signature: 'mock_signature_valid'
    });

    setIsProcessing(false);
    setRazorpayModalOpen(false);
    clearCart();
    navigate('/order-success', { state: { transaction: verifyRes } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown text-xs font-bold uppercase tracking-wider border border-fitted-brown/20">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Razorpay Integration Gateway</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-fitted-charcoal">Express Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Shipping Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-fitted-border shadow-cream-card">
            <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
              <Building className="w-4 h-4 text-fitted-brown" />
              <span>1. Shipping & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="text-fitted-charcoal font-semibold">Full Recipient Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown transition-colors"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-fitted-charcoal font-semibold">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fitted-charcoal font-semibold">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fitted-charcoal font-semibold">PIN / Postal Code</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal focus:outline-none focus:border-fitted-brown transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Order Summary & Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl space-y-6 border border-fitted-border shadow-cream-card">
            <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-fitted-brown" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-center text-xs p-3 rounded-2xl bg-fitted-bg border border-fitted-border">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-12 rounded-lg object-cover border border-fitted-border" />
                    <div>
                      <p className="text-fitted-charcoal font-bold truncate max-w-[140px]">{item.product.name}</p>
                      <p className="text-[10px] text-fitted-muted">Size {item.size} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-fitted-brown font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-fitted-border text-xs">
              <div className="flex justify-between text-fitted-muted">
                <span>Subtotal</span>
                <span className="text-fitted-charcoal font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-fitted-muted">
                <span>Express Fit Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-fitted-charcoal pt-2 border-t border-fitted-border">
                <span>Total Amount</span>
                <span className="text-fitted-brown font-extrabold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleInitiateRazorpay}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-fitted-brownDark transition-all shadow-glow-brown"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Connecting Gateway...' : 'Pay with Razorpay'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-fitted-muted">
              <Lock className="w-3.5 h-3.5 text-fitted-brown" />
              <span>Razorpay Live Test Sandbox • 256-bit Encrypted SSL</span>
            </div>

          </div>
        </div>

      </div>

      {/* Razorpay Test Modal Simulation */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-fitted-border rounded-3xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95 text-fitted-charcoal">
            
            {/* Razorpay Branding Header */}
            <div className="flex items-center justify-between border-b border-fitted-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">Razorpay</span>
                <span className="text-xs font-bold text-fitted-charcoal font-display">Test Mode Sandbox</span>
              </div>
              <span className="text-sm font-extrabold text-fitted-brown">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Test Card Simulation Details */}
            <div className="p-4 rounded-2xl bg-fitted-bg border border-fitted-border space-y-2 text-xs">
              <div className="flex justify-between text-fitted-muted">
                <span>Simulated Card:</span>
                <span className="font-mono text-fitted-charcoal font-bold">4111 •••• •••• 1111</span>
              </div>
              <div className="flex justify-between text-fitted-muted">
                <span>Expiry / CVV:</span>
                <span className="font-mono text-fitted-charcoal font-bold">12/28 • 123</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-fitted-charcoal">Enter Test 3D-Secure OTP</label>
              <input
                type="text"
                value={testOtp}
                onChange={(e) => setTestOtp(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-fitted-bg border border-fitted-border text-fitted-charcoal text-center font-mono tracking-widest text-sm focus:outline-none focus:border-fitted-brown"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSimulatePaymentSuccess}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying Signature...' : 'Simulate Successful Payment'}</span>
              </button>

              <button
                onClick={() => setRazorpayModalOpen(false)}
                className="w-full text-center text-xs text-fitted-muted hover:text-fitted-charcoal py-1"
              >
                Cancel Transaction
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-fitted-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated Instant Payment Verification</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
