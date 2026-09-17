import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Package, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  const [txnId] = useState(() => transaction?.transactionId || `TXN_FTD_${Date.now().toString(36).toUpperCase()}`);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 min-h-[70vh]">
      
      {/* Animated Check */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          Payment Verified • Razorpay Interface
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1E2229]">Style Order Confirmed!</h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Your order has been placed successfully and logged in your Fitted style activity.
        </p>
      </div>

      {/* Digital Receipt Card */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-3xl p-6 text-left space-y-4 text-xs text-[#1E2229]">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-mono text-fitted-brown font-bold text-sm">{txnId}</span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500">Est. Delivery Window</span>
          <span className="text-gray-900 font-semibold">2 - 3 Business Days (Express)</span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500">Fitted Style Points Earned</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            +340 Passport Points
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 space-y-1">
          <p className="text-fitted-brown font-bold text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-fitted-brown" />
            Automatic Wardrobe Sync
          </p>
          <p className="text-gray-700 text-[11px] leading-relaxed">
            Once delivered, your purchased items will automatically sync into your Digital Closet with auto-generated outfit combinations!
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={() => navigate('/wardrobe')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Package className="w-4 h-4" />
          <span>View Digital Closet</span>
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>

    </div>
  );
}
