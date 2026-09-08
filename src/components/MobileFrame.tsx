import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isMobileFrame, children }) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-screen pb-12">{children}</div>;
  }

  return (
    <div className="min-h-screen py-6 px-2 sm:px-4 flex justify-center items-center bg-stone-900/90 backdrop-blur-md">
      {/* Smartphone Hardware Frame */}
      <div className="relative w-full max-w-[420px] h-[890px] bg-black rounded-[48px] p-3 shadow-2xl shadow-black/80 ring-1 ring-stone-700/60 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 w-28 h-6 bg-black rounded-full border border-stone-800">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-950"></div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
        </div>

        {/* Mobile Status Bar */}
        <div className="w-full h-8 bg-white text-stone-900 px-6 flex justify-between items-center text-[11px] font-semibold select-none rounded-t-[38px] z-40">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5 text-stone-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Viewport with internal scrolling */}
        <div className="flex-1 w-full bg-stone-50 overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full h-6 bg-white flex justify-center items-center rounded-b-[38px] z-40">
          <div className="w-32 h-1 bg-stone-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
