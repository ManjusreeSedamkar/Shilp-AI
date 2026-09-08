import React, { useState } from 'react';
import { Sparkles, ShoppingBag, UserCheck, Smartphone, Monitor, Globe, Award, Cpu } from 'lucide-react';
import { UserRole, Language } from '../types';
import { AppLogo } from './AppLogo';
import { ApiSettingsModal } from './ApiSettingsModal';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  language,
  setLanguage,
  isMobileFrame,
  setIsMobileFrame
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      {/* Government & Ministry Banner */}
      <div className="bg-gradient-to-r from-saffron-700 via-stone-800 to-emerald-800 text-white text-xs px-4 py-1.5 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>सामाजिक न्याय और अधिकारिता मंत्रालय | Ministry of Social Justice and Empowerment (MoSJE)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-stone-200">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-saffron-300" />
            Shilp Samagam & GeM Certified
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Govt of India Initiative</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="cursor-pointer" onClick={() => setRole('artisan')}>
          <AppLogo size="md" showTagline={true} />
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setRole('artisan')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'artisan'
                ? 'bg-white text-saffron-700 shadow-sm border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Artisan App</span>
            <span className="hidden md:inline text-[10px] text-stone-400">(कारीगर)</span>
          </button>
          <button
            onClick={() => setRole('buyer')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'buyer'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>B2B & MoSJE Portal</span>
            <span className="hidden md:inline text-[10px] opacity-75">(खरीदार)</span>
          </button>
        </div>

        {/* Controls: Language & Mobile Simulator Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector & Quick Toggle */}
          <div className="flex items-center space-x-1.5">
            {/* Quick 1-Click EN / HI Toggle */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-saffron-700 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-white text-saffron-700 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Full Regional Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-stone-500 absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="pl-7 pr-2 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-saffron-500 cursor-pointer shadow-xs"
                title="Select Interface Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle: Mobile Frame vs Full Desktop */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Switch to Fullscreen Responsive View" : "Simulate Native Mobile App View"}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-saffron-600" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-saffron-600" />
                <span className="hidden sm:inline">Mobile App View</span>
              </>
            )}
          </button>

          {/* AI Engine & API Status Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="AI Architecture & Optional API Keys"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">AI Engines</span>
          </button>
        </div>
      </div>

      {/* API Settings Modal */}
      <ApiSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};
