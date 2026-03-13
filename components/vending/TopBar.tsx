'use client';

import { ArrowLeft } from 'lucide-react';
import { Screen } from '../../types/vending';

interface Props {
  title: string;
  currentScreen: Screen;
  currentTimeLabel: string;
  onBack: () => void;
}

export function TopBar({ title, currentScreen, currentTimeLabel, onBack }: Props) {
  const showBack = !['categories', 'screensaver', 'dispensing', 'thankYou'].includes(currentScreen);

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shrink-0 z-20 relative">
      <div className="w-[140px]">
        {showBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-5 py-3 rounded-full transition-all text-lg font-medium">
            <ArrowLeft size={24} /> Back
          </button>
        )}
      </div>
      <h1 className="text-2xl font-bold text-white tracking-widest uppercase text-center flex-1">{title}</h1>
      <div className="w-[140px] flex flex-col items-end">
        <span className="text-cyan-400 font-mono text-2xl font-bold">{currentTimeLabel}</span>
        <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">SLST</span>
      </div>
    </div>
  );
}
