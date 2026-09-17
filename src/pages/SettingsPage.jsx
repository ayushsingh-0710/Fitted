import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Server, 
  Lock,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mongoStatus, setMongoStatus] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const data = await res.json();
          setBackendStatus('online');
          setMongoStatus(Boolean(data.mongodb_connected));
        } else {
          setBackendStatus('demo');
        }
      } catch {
        setBackendStatus('demo');
      }
    }
    checkBackend();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF6ED] min-h-screen text-[#1E2229]">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown text-xs font-bold uppercase tracking-wider border border-fitted-brown/20">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Integration Status</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-fitted-charcoal">Application Settings</h1>
        <p className="text-xs text-fitted-muted">Inspect backend pipelines, database connectivity, and environment status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Architecture & Backend Health */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-fitted-border shadow-cream-card">
          <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
            <Server className="w-4 h-4 text-fitted-brown" />
            <span>FastAPI & Database Pipeline</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-fitted-bg border border-fitted-border">
              <span className="text-fitted-charcoal font-semibold">FastAPI Backend Server</span>
              {backendStatus === 'online' ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Online (localhost:8000)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-600" /> Standalone Demo Mode
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-fitted-bg border border-fitted-border">
              <span className="text-fitted-charcoal font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-fitted-brown" />
                <span>MongoDB Atlas Database</span>
              </span>
              {mongoStatus ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected (Atlas Cluster0)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-600" /> Async Memory Store
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-fitted-bg border border-fitted-border">
              <span className="text-fitted-charcoal font-semibold">Fashion Intelligence Engine</span>
              <span className="px-2.5 py-1 rounded-full bg-fitted-brown/10 text-fitted-brown border border-fitted-brown/20 font-bold">
                Qwen & Gemini Multimodal
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-fitted-bg border border-fitted-border">
              <span className="text-fitted-charcoal font-semibold">Payment Gateway Interface</span>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                Razorpay Test Sandbox Ready
              </span>
            </div>
          </div>
        </div>

        {/* Security & API Key Governance */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-fitted-border shadow-cream-card">
          <h3 className="text-base font-bold text-fitted-charcoal font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Security & Frontend Isolation</span>
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Security Compliance</span>
            </div>
            <p className="leading-relaxed text-[11px] text-emerald-800">
              No secret API keys, database passwords, or payment gateway secrets are exposed in client React code. All sensitive external integrations are abstracted through the FastAPI backend router layer.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-fitted-charcoal">Active API Endpoint</h4>
            <div className="p-3.5 rounded-xl bg-fitted-bg font-mono text-[11px] text-fitted-charcoal border border-fitted-border">
              http://localhost:8000/api
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
