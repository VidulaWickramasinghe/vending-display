'use client';

import { CategoryKey, Item } from '../../types/vending';
import {
  CheckCircle2,
  Coffee,
  Coins,
  Cookie,
  CreditCard,
  CupSoda,
  Delete,
  GlassWater,
  Minus,
  Phone,
  PhoneCall,
  Play,
  Plus,
  QrCode,
} from 'lucide-react';
import { INVENTORY } from '../../lib/inventory';
import { AD_VIDEOS, FALLBACK_IMAGE, TAGLINES } from '../../lib/media';

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = FALLBACK_IMAGE;
};

export function Screensaver({
  timeLabel,
  currentAdIndex,
  onAdEnd,
  onStart,
}: {
  timeLabel: string;
  currentAdIndex: number;
  onAdEnd: () => void;
  onStart: () => void;
}) {
  const currentTagline = TAGLINES[Math.floor(currentAdIndex / 2) % TAGLINES.length];

  return (
    <div className="flex-1 relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-between py-16">
      <video
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        src={AD_VIDEOS[currentAdIndex]}
        onEnded={onAdEnd}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />

      <div className="absolute top-12 right-12 text-right z-20">
        <div className="text-5xl font-mono font-bold text-white bg-black/30 px-6 py-2 rounded-2xl backdrop-blur-sm border border-white/10">
          {timeLabel}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center mt-20">
        <h1 key={currentTagline.main} className="text-6xl font-black text-white text-center tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {currentTagline.main}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{currentTagline.sub}</span>
        </h1>
      </div>

      <div className="relative z-10 mb-8 mt-auto">
        <button
          onClick={onStart}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-[2rem] px-24 py-8 text-4xl font-black flex items-center gap-4 transition-all hover:scale-105 animate-pulse"
        >
          <Play fill="currentColor" size={40} /> START
        </button>
      </div>
    </div>
  );
}

export function CategoryScreen({ onSelect }: { onSelect: (screen: CategoryKey | 'phone') => void }) {
  const cats = [
    ['snacks', 'Snacks & Biscuits', Cookie, 'from-amber-600 to-orange-600'],
    ['coldDrinks', 'Cold Drinks', CupSoda, 'from-blue-600 to-cyan-600'],
    ['coffee', 'Hot Coffee', Coffee, 'from-stone-700 to-stone-800'],
    ['freshDrinks', 'Fresh Drinks', GlassWater, 'from-emerald-600 to-teal-600'],
    ['phone', 'Public Phone', Phone, 'from-purple-600 to-pink-600'],
  ] as const;

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 p-8 overflow-y-auto">
      {cats.map(([key, label, Icon, gradient]) => (
        <button key={key} onClick={() => onSelect(key)} className={`w-full max-w-2xl bg-gradient-to-r ${gradient} hover:scale-[1.02] transition-transform p-8 rounded-[2rem] flex items-center gap-8 shadow-2xl border border-white/10`}>
          <div className="bg-black/20 p-6 rounded-2xl backdrop-blur-sm"><Icon size={64} className="text-white" /></div>
          <span className="text-4xl font-bold text-white tracking-wide flex-1 text-left">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function ProductGrid({ items, category, onBuy }: { items: Item[]; category: CategoryKey; onBuy: (item: Item, category: CategoryKey, payment: 'cash' | 'card' | 'qr') => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800/80 border border-white/10 p-6 rounded-[2rem] flex flex-col shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <img src={item.image} alt={item.name} onError={handleImageError} className="w-28 h-28 object-cover rounded-2xl border border-white/10 shadow-inner bg-slate-700" />
              <div className="flex-1">
                <div className="bg-slate-900 text-gray-300 font-mono text-xs px-3 py-1 rounded-lg inline-block mb-2 font-bold border border-white/5">{item.id}</div>
                <div className="text-xl font-bold text-white leading-tight">{item.name}</div>
                <div className="text-2xl font-mono font-bold text-cyan-400 mt-2">Rs {item.price}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
              <button onClick={() => onBuy(item, category, 'cash')} className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white py-3 rounded-xl flex items-center justify-center transition-colors border border-emerald-500/30"><Coins size={20} /></button>
              <button onClick={() => onBuy(item, category, 'card')} className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl flex items-center justify-center transition-colors border border-blue-500/30"><CreditCard size={20} /></button>
              <button onClick={() => onBuy(item, category, 'qr')} className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white py-3 rounded-xl flex items-center justify-center transition-colors border border-purple-500/30"><QrCode size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoffeeScreen({ sugarLevel, onSugarChange, onBuy }: { sugarLevel: number; onSugarChange: (n: number) => void; onBuy: (item: Item, category: CategoryKey, payment: 'cash' | 'card' | 'qr') => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      <div className="bg-slate-800/80 border border-white/10 rounded-[2rem] p-6 mb-8 flex items-center justify-between shadow-xl">
        <span className="text-2xl font-bold text-white flex items-center gap-3"><Coffee className="text-amber-400" /> Sugar Level</span>
        <div className="flex items-center gap-6">
          <button onClick={() => onSugarChange(Math.max(0, sugarLevel - 1))} className="w-14 h-14 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white border border-white/5"><Minus size={28} /></button>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((level) => (
              <div key={level} className={`w-8 h-4 rounded-full ${level <= sugarLevel ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-slate-700'}`} />
            ))}
          </div>
          <button onClick={() => onSugarChange(Math.min(4, sugarLevel + 1))} className="w-14 h-14 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white border border-white/5"><Plus size={28} /></button>
        </div>
      </div>

      <ProductGrid items={INVENTORY.coffee.map((item) => ({ ...item, name: `${item.name} (Sugar: ${sugarLevel})` }))} category="coffee" onBuy={onBuy} />
    </div>
  );
}

export function PhoneScreen({ phoneActive, dialedNumber, callDurationLabel, onDial, onStartCall, onEndCall, onBackspace }: { phoneActive: boolean; dialedNumber: string; callDurationLabel: string; onDial: (key: string) => void; onStartCall: () => void; onEndCall: () => void; onBackspace: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
      <div className="bg-slate-800/80 p-8 rounded-[3rem] border border-white/10 w-full shadow-2xl">
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-center min-h-[140px] flex flex-col justify-center">
          {phoneActive ? (
            <div className="animate-pulse"><div className="text-green-400 text-xl font-medium mb-2">Calling...</div><div className="text-white text-3xl font-mono tracking-widest mb-2">{dialedNumber}</div><div className="text-gray-400 text-lg">{callDurationLabel}</div></div>
          ) : (
            <><div className="text-gray-400 text-sm mb-3">Insert Coin to Start Call<br />Rs 10 = 1 minute</div><div className="text-white text-4xl font-mono tracking-widest min-h-[40px]">{dialedNumber || 'Dial Number'}</div></>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <button key={k} onClick={() => onDial(k)} disabled={phoneActive} className="aspect-square bg-white/5 hover:bg-white/15 rounded-full flex items-center justify-center text-3xl text-white border border-white/5 disabled:opacity-50">{k}</button>
          ))}
        </div>

        <div className="flex gap-4">
          {!phoneActive ? (
            <button onClick={onStartCall} className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3"><PhoneCall size={28} /> CALL</button>
          ) : (
            <button onClick={onEndCall} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3"><PhoneCall size={28} className="rotate-[135deg]" /> END</button>
          )}

          {!phoneActive && dialedNumber.length > 0 && <button onClick={onBackspace} className="bg-slate-700 hover:bg-slate-600 text-white rounded-full px-6 flex items-center justify-center"><Delete size={28} /></button>}
        </div>
      </div>
    </div>
  );
}

export function DispensingScreen({ selectedName, selectedImage, progress, message }: { selectedName?: string; selectedImage?: string; progress: number; message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900">
      <div className="w-full max-w-2xl bg-slate-800/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">
        <div className="mb-12 relative flex items-center justify-center">
          <div className="absolute w-64 h-64 bg-cyan-500/20 rounded-full animate-ping" />
          <div className="absolute w-48 h-48 bg-cyan-500/40 rounded-full animate-pulse" />
          <div className="relative bg-slate-900 rounded-full p-4 border border-white/10 z-10 shadow-2xl overflow-hidden">
            {selectedImage ? <img src={selectedImage} alt={selectedName} onError={handleImageError} className="w-40 h-40 object-cover rounded-full" /> : <div className="w-40 h-40 flex items-center justify-center"><CheckCircle2 size={64} className="text-cyan-400" /></div>}
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-4">Preparing Order</h2>
        <p className="text-2xl text-cyan-400 mb-12 font-medium">{selectedName}</p>
        <div className="w-full bg-slate-900 h-8 rounded-full overflow-hidden border border-white/5 relative mb-4 shadow-inner">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300 ease-out relative" style={{ width: `${progress}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between w-full text-gray-400 text-xl font-mono"><span>{message}</span><span>{progress}%</span></div>
      </div>
    </div>
  );
}

export function ThankYouScreen({ selectedName }: { selectedName?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-green-900/40 to-slate-900">
      <div className="w-full max-w-2xl bg-slate-800/80 p-16 rounded-[3rem] border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <CheckCircle2 size={120} className="text-green-400 mb-8 animate-bounce" />
        <h2 className="text-6xl font-black text-white mb-6 tracking-tight">Thank You!</h2>
        <p className="text-2xl text-gray-300 mb-2">Please collect your item below.</p>
        <p className="text-xl text-green-400 font-medium">Enjoy your {selectedName}!</p>
      </div>
    </div>
  );
}
