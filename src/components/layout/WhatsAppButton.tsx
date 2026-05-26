'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';

const PRE_FILLED = 'Hi CT Diamond! I\'m interested in your jewelry collection.';
const WHATSAPP_URL = `https://wa.me/85561626789?text=${encodeURIComponent(PRE_FILLED)}`;

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ctd_whatsapp_dismissed');
    if (stored === 'true') setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('ctd_whatsapp_dismissed', 'true');
    setOpen(false);
  };

  if (dismissed && !open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden animate-fade-in">
          <div className="bg-green-500 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">CT Diamond Jewelry</p>
              <p className="text-white/80 text-xs">Typically replies within 1 hour</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <ChevronDown size={18} />
            </button>
          </div>
          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mb-4 max-w-[80%]">
              {PRE_FILLED}
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white rounded-xl py-3 font-medium hover:bg-green-600 transition-colors text-sm"
            >
              <MessageCircle size={18} />
              Start Chat on WhatsApp
            </a>
            <button
              onClick={handleDismiss}
              className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600 transition-colors"
            >
              Don&apos;t show again
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        {open ? <X size={24} /> : <MessageCircle size={28} fill="white" />}
      </button>
    </div>
  );
}
