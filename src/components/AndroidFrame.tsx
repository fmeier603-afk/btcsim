import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: string;
}

export function AndroidFrame({ children, activeTab }: AndroidFrameProps) {
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:34');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Viewport switch toolbar */}
      <div className="w-full max-w-5xl flex items-center justify-between px-4 py-2 mb-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Cosmic Hash</span>
          <span className="text-slate-600">·</span>
          <span>Android Benchmark Engine</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
              isPhoneFrame
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Smartphone-Rahmen simulieren"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
              !isPhoneFrame
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vollbild-Layout verwenden"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vollbild</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] rounded-[42px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl shadow-amber-500/5 overflow-hidden flex flex-col min-h-[860px]'
            : 'max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl overflow-hidden'
        }`}
      >
        {/* Android Status Bar (Always present on phone frame, subtle on full screen) */}
        <div className="w-full bg-slate-950/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/60 select-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{currentTime}</span>
            <span className="text-[10px] text-emerald-400">5G+</span>
          </div>

          {/* Camera Notch on Phone Frame */}
          {isPhoneFrame && (
            <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-400">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span>98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>

        {/* Android Gesture Bar */}
        {isPhoneFrame && (
          <div className="w-full py-2 bg-slate-950 flex items-center justify-center border-t border-slate-900 select-none">
            <div className="w-32 h-1 rounded-full bg-slate-600/70" />
          </div>
        )}
      </div>
    </div>
  );
}
