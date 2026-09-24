import React, { useState, useEffect, createContext, useContext } from 'react';
import { Wifi, Battery, Signal, X, Monitor, Smartphone, RotateCcw } from 'lucide-react';

export interface MobileModeContextValue {
  isMobileMode: boolean;
  isMobileFrame: boolean;
  setIsMobileFrame?: (val: boolean) => void;
}

export const MobileModeContext = createContext<MobileModeContextValue>({
  isMobileMode: false,
  isMobileFrame: false,
});

export const useMobileMode = () => useContext(MobileModeContext);

interface MobileFrameProps {
  isMobileFrame: boolean;
  setIsMobileFrame?: (val: boolean) => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ 
  isMobileFrame, 
  setIsMobileFrame, 
  children 
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const isMobileMode = isMobileFrame || isMobileScreen;

  // On native mobile screens or when frame is toggled off on desktop
  if (!isMobileFrame || isMobileScreen) {
    return (
      <MobileModeContext.Provider value={{ isMobileMode: isMobileScreen, isMobileFrame: false, setIsMobileFrame }}>
        <div className="w-full min-h-[100dvh] max-w-full overflow-x-hidden">
          {children}
        </div>
      </MobileModeContext.Provider>
    );
  }

  // Interactive Smartphone Frame Simulator (When toggled on desktop)
  return (
    <MobileModeContext.Provider value={{ isMobileMode: true, isMobileFrame: true, setIsMobileFrame }}>
      <div className="min-h-screen py-6 px-2 sm:px-4 flex flex-col justify-center items-center bg-stone-950/90 backdrop-blur-md transition-colors select-none">
        
        {/* Simulator Control Toolbar (Above Phone) */}
        <div className="mb-3 flex items-center justify-between gap-3 max-w-[420px] w-full px-2 text-stone-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-300 font-mono tracking-tight">SHILP-AI Mobile Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            {setIsMobileFrame && (
              <button
                onClick={() => setIsMobileFrame(false)}
                className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Switch back to full-width desktop view"
              >
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Exit Mobile</span>
              </button>
            )}
          </div>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="relative w-full max-w-[420px] h-[890px] bg-stone-900 rounded-[50px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-stone-700/80 flex flex-col overflow-hidden border-4 border-stone-800">
          
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 w-28 h-6 bg-black rounded-full border border-stone-800 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950"></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse"></div>
          </div>

          {/* Mobile Status Bar */}
          <div className="w-full h-8 bg-white dark:bg-[#0B1120] text-stone-900 dark:text-stone-100 px-6 flex justify-between items-center text-[11px] font-semibold select-none rounded-t-[38px] z-40 border-b border-stone-100 dark:border-stone-800 transition-colors">
            <span>{currentTime}</span>
            <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mr-0.5">5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center">
                <Battery className="w-4 h-4 fill-stone-700 dark:fill-stone-300" />
              </div>
            </div>
          </div>

          {/* Screen Viewport with internal scrolling */}
          <div 
            id="mobile-viewport-scroller" 
            className="flex-1 w-full bg-[#FAF8F5] dark:bg-[#070B14] overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar scroll-smooth"
          >
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="w-full h-6 bg-white dark:bg-[#0B1120] flex justify-center items-center rounded-b-[38px] z-40 border-t border-stone-100 dark:border-stone-800 transition-colors">
            <div className="w-32 h-1 bg-stone-400 dark:bg-stone-600 rounded-full"></div>
          </div>
        </div>

      </div>
    </MobileModeContext.Provider>
  );
};
