import React, { useState } from 'react';
import { Sparkles, ShoppingBag, UserCheck, Smartphone, Monitor, Globe, Award, Cpu, ShieldCheck, LogIn, LogOut, HelpCircle, User, Sun, Moon } from 'lucide-react';
import { UserRole, Language } from '../types';
import { AppLogo } from './AppLogo';
import { AuthUser } from './AuthModal';
import { translate } from '../services/translations';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCardModal: () => void;
  onOpenTutorial: () => void;
  isLightOn?: boolean;
  onToggleLightMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  language,
  setLanguage,
  isMobileFrame,
  setIsMobileFrame,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCardModal,
  onOpenTutorial,
  isLightOn = true,
  onToggleLightMode,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const t = (key: string) => translate(language, key);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 shadow-[0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-full transition-colors duration-250">
      {/* Government & Ministry Banner */}
      <div className="bg-amber-50/90 text-amber-950 border-b border-amber-200/80 dark:bg-stone-950 dark:text-stone-300 dark:border-stone-800 text-[10px] sm:text-xs px-3 sm:px-6 py-1.5 flex justify-between items-center gap-2 w-full max-w-full overflow-hidden transition-colors duration-250">
        <div className="flex items-center space-x-2 font-medium truncate min-w-0 flex-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="truncate text-stone-700 dark:text-stone-300 font-semibold">Ministry of Social Justice & Empowerment (MoSJE) • Govt of India</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-stone-600 dark:text-stone-400 shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <Award className="w-3.5 h-3.5 text-[#C85A32] dark:text-amber-400" />
            <span className="hidden sm:inline">Official Artisan Registry Partner</span>
            <span className="sm:hidden">Official Registry</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 w-full max-w-full">
        {/* Logo & Tagline */}
        <div className="cursor-pointer shrink-0" onClick={() => setRole('artisan')}>
          <div className="hidden sm:block">
            <AppLogo size="md" showTagline={true} />
          </div>
          <div className="sm:hidden">
            <AppLogo size="sm" showTagline={false} />
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800/90 p-1 rounded-xl border border-stone-200/90 dark:border-stone-700/60 shrink-0">
          <button
            onClick={() => setRole('artisan')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'artisan'
                ? 'bg-[#C85A32] dark:bg-amber-500 text-white dark:text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Artisan Studio</span>
            <span className="sm:hidden text-[11px] font-bold">Artisan</span>
<span className="hidden lg:inline text-[10px] opacity-80 font-normal">(कारीगर)</span>
          </button>
          <button
            onClick={() => setRole('buyer')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'buyer'
                ? 'bg-[#C85A32] dark:bg-amber-500 text-white dark:text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buyer Marketplace</span>
            <span className="sm:hidden text-[11px] font-bold">Buyer</span>
<span className="hidden lg:inline text-[10px] opacity-80 font-normal">(खरीदार)</span>
          </button>
        </div>

        {/* Controls: Language, Digital Card, Tutorial, Mobile View & User Auth */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Digital Smart ID Card Quick Button (Artisans) */}
          <button
            onClick={onOpenCardModal}
            title="View Official MoSJE Artisan Smart ID Card"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden lg:inline">Smart ID</span>
          </button>

          {/* Regional Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-500 absolute left-1.5 sm:left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 sm:py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-[11px] sm:text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-saffron-500 cursor-pointer shadow-2xs max-w-[68px] sm:max-w-none"
              title="Select Interface Language"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="bn">বাংলা</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="as">অসমীয়া</option>
              <option value="ur">اردو</option>
              <option value="sa">संस्कृतम्</option>
              <option value="mai">मैथिली</option>
              <option value="kok">कोंकणी</option>
              <option value="ne">नेपाली</option>
              <option value="sd">سنڌي</option>
              <option value="doi">डोगरी</option>
              <option value="brx">बड़ो</option>
              <option value="sat">ᱥᱟᱱᱛᱟᱲᱤ</option>
            </select>
          </div>

          {/* Tutorial / Help Button */}
          <button
            onClick={onOpenTutorial}
            title="App Guidance & Tutorial"
            className="hidden sm:flex p-1.5 sm:px-2 sm:py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-saffron-600" />
            <span className="hidden xl:inline">Guide</span>
          </button>

          {/* View Mode: Mobile Frame vs Desktop */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Switch to Fullscreen Desktop View" : "Simulate Mobile Smartphone Frame"}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-saffron-600" />
                <span className="hidden lg:inline">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-saffron-600" />
                <span className="hidden lg:inline">Mobile Frame</span>
              </>
            )}
          </button>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-saffron-500"
                />
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-bold text-stone-800 truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-stone-500 capitalize">{currentUser.role}</div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-scaleIn">
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{currentUser.phoneOrEmail}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-saffron-50 text-saffron-700 font-bold text-[9px] uppercase border border-saffron-200">
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenCardModal();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Digital Smart ID Card</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenTutorial();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>How to Use Shilp-AI</span>
                  </button>

                  <div className="border-t border-stone-100 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out / Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Light Mode ON / OFF Toggle Switch */}
          {onToggleLightMode && (
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              <button
                onClick={onToggleLightMode}
                type="button"
                role="switch"
                aria-checked={isLightOn}
                title={
                  isLightOn
                    ? 'Light Mode is ON (Click to turn Dark Mode ON)'
                    : 'Dark Mode is ON (Click to turn Light Mode ON)'
                }
                className={`relative inline-flex items-center h-8 w-15 rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C85A32] cursor-pointer shadow-inner ${
                  isLightOn
                    ? 'bg-gradient-to-r from-amber-400 to-[#C85A32] border border-amber-300'
                    : 'bg-stone-800 border border-stone-700'
                }`}
              >
                <span className="sr-only">Toggle Light/Dark Mode</span>

                {/* Moon on left (revealed when OFF / Dark) */}
                <Moon
                  className={`w-3.5 h-3.5 absolute left-1.5 text-amber-300 transition-opacity duration-300 ${
                    !isLightOn ? 'opacity-100' : 'opacity-20'
                  }`}
                />

                {/* Sun on right (revealed when ON / Light) */}
                <Sun
                  className={`w-3.5 h-3.5 absolute right-1.5 text-white transition-opacity duration-300 ${
                    isLightOn ? 'opacity-100' : 'opacity-20'
                  }`}
                />

                {/* Sliding knob: slides to the RIGHT when ON (Light), slides to the LEFT when OFF (Dark) */}
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    isLightOn ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  {isLightOn ? (
                    <Sun className="w-3.5 h-3.5 text-[#C85A32]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-stone-800" />
                  )}
                </span>
              </button>

              <span className="hidden lg:inline text-[11px] font-bold text-stone-700 dark:text-stone-300 select-none">
                {isLightOn ? '☀️ Light' : '🌙 Dark'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
