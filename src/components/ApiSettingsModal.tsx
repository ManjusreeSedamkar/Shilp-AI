import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, Cpu, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setApiKey(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-stone-200 relative animate-scaleIn space-y-4 my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">AI Engine & API Architecture</h3>
            <p className="text-xs text-stone-500">SHILP-AI System Connectivity</p>
          </div>
        </div>

        {/* Active Native AI Services (Zero External API Needed) */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free & Local AI Engines Active
            </span>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
              Ready
            </span>
          </div>
          <ul className="text-[11px] text-stone-600 space-y-1 pl-5 list-disc">
            <li><strong>AI Image Studio</strong>: In-browser Canvas chroma/luma segmentation & lighting</li>
            <li><strong>Voice-to-Catalog</strong>: Native browser Web Speech Recognition & TTS</li>
            <li><strong>Dynamic Pricing</strong>: MoSJE Fair Artisan Wage ML regression</li>
            <li><strong>Artisan Copilot</strong>: Multi-intent knowledge & procedural assistant</li>
          </ul>
        </div>

        {/* Optional Gemini Key Input */}
        <div className="space-y-2 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-stone-500" />
              Optional: Google Gemini API Key
            </label>
            <span className="text-[10px] text-stone-400">Optional</span>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <p className="text-[10.5px] text-stone-500 leading-tight">
            The app is fully functional without any API key. If provided, the Copilot can optionally use Gemini 2.5 Flash for open-ended queries.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Sparkles className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save Setting'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
