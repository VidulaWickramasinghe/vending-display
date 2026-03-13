'use client';

import { CategoryKey, Item } from '../../types/vending';
import { Coffee, Coins, Cookie, CreditCard, CupSoda, Delete, GlassWater, Minus, Phone, PhoneCall, Play, Plus, QrCode, CheckCircle2 } from 'lucide-react';
import { INVENTORY } from '../../lib/inventory';

export function Screensaver({ timeLabel, onStart }: { timeLabel: string; onStart: () => void }) {
  return (
    <div className="flex-1 relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-end pb-16">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
      <div className="absolute top-12 right-12 text-right text-white"><div className="text-5xl font-mono font-bold">{timeLabel}</div><div className="text-xl font-bold text-cyan-400 tracking-[0.3em] uppercase">Sri Lanka Time</div></div>
      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <h1 className="text-6xl font-black text-white text-center">Thirsty?<br/><span className="text-cyan-400">Grab a Drink.</span></h1>
        <button onClick={onStart} className="bg-white/10 hover:bg-white/20 text-white rounded-full px-16 py-6 text-3xl font-bold flex items-center gap-4"><Play fill="currentColor" size={32} /> START</button>
      </div>
    </div>
  );
}

export function CategoryScreen({ onSelect }: { onSelect: (screen: CategoryKey | 'phone') => void }) {
  const cats = [
    ['snacks', 'Snacks & Biscuits', Cookie],
    ['coldDrinks', 'Cold Drinks', CupSoda],
    ['coffee', 'Hot Coffee', Coffee],
    ['freshDrinks', 'Fresh Drinks', GlassWater],
    ['phone', 'Public Phone', Phone],
  ] as const;

  return <div className="flex-1 flex flex-col justify-center items-center gap-6 p-8 overflow-y-auto">{cats.map(([key, label, Icon]) => <button key={key} onClick={() => onSelect(key)} className="w-full max-w-2xl bg-slate-700 hover:bg-slate-600 transition-transform p-8 rounded-[2rem] flex items-center gap-8"><Icon size={56} className="text-white" /><span className="text-4xl font-bold text-white flex-1 text-left">{label}</span></button>)}</div>;
}

export function ProductGrid({ items, category, onBuy }: { items: Item[]; category: CategoryKey; onBuy: (item: Item, category: CategoryKey, payment: 'cash'|'card'|'qr') => void }) {
  return <div className="flex-1 overflow-y-auto p-8"><div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">{items.map((item) => (
    <div key={item.id} className="bg-slate-800/80 border border-white/10 p-6 rounded-[2rem] flex flex-col shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-2xl border border-white/10" />
        <div className="flex-1"><div className="text-gray-300 font-mono text-xs">{item.id}</div><div className="text-xl font-bold text-white">{item.name}</div><div className="text-2xl font-mono font-bold text-cyan-400">Rs {item.price}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-auto">
        <button onClick={() => onBuy(item, category, 'cash')} className="bg-emerald-600/20 text-emerald-400 py-3 rounded-xl flex items-center justify-center"><Coins size={20} /></button>
        <button onClick={() => onBuy(item, category, 'card')} className="bg-blue-600/20 text-blue-400 py-3 rounded-xl flex items-center justify-center"><CreditCard size={20} /></button>
        <button onClick={() => onBuy(item, category, 'qr')} className="bg-purple-600/20 text-purple-400 py-3 rounded-xl flex items-center justify-center"><QrCode size={20} /></button>
      </div>
    </div>
  ))}</div></div>;
}

export function CoffeeScreen({ sugarLevel, onSugarChange, onBuy }: { sugarLevel: number; onSugarChange: (n:number) => void; onBuy: (item: Item, category: CategoryKey, payment: 'cash'|'card'|'qr') => void }) {
  return <div className="flex-1 flex flex-col overflow-y-auto p-8 max-w-4xl mx-auto w-full">
    <div className="bg-slate-800/80 rounded-[2rem] p-6 mb-8 flex items-center justify-between"><span className="text-2xl font-bold text-white">Sugar Level</span><div className="flex items-center gap-4"><button onClick={() => onSugarChange(Math.max(0, sugarLevel - 1))}><Minus /></button><span className="text-white">{sugarLevel}/4</span><button onClick={() => onSugarChange(Math.min(4, sugarLevel + 1))}><Plus /></button></div></div>
    <ProductGrid items={INVENTORY.coffee.map((item) => ({...item, name: `${item.name} (Sugar: ${sugarLevel})`}))} category="coffee" onBuy={onBuy} />
  </div>;
}

export function PhoneScreen({ phoneActive, dialedNumber, callDurationLabel, onDial, onStartCall, onEndCall, onBackspace }: { phoneActive:boolean; dialedNumber:string; callDurationLabel:string; onDial:(key:string)=>void; onStartCall:()=>void; onEndCall:()=>void; onBackspace:()=>void }) {
  return <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto"><div className="bg-slate-800/80 p-8 rounded-[3rem] w-full"><div className="bg-black/40 rounded-2xl p-6 mb-8 text-center min-h-[140px]">{phoneActive ? <><div className="text-green-400">Calling...</div><div className="text-white text-3xl">{dialedNumber}</div><div className="text-gray-400">{callDurationLabel}</div></> : <><div className="text-gray-400">Rs 10 = 1 minute</div><div className="text-white text-4xl">{dialedNumber || 'Dial Number'}</div></>}</div>
  <div className="grid grid-cols-3 gap-4 mb-8">{['1','2','3','4','5','6','7','8','9','*','0','#'].map((k) => <button key={k} onClick={() => onDial(k)} disabled={phoneActive} className="aspect-square bg-white/5 rounded-full text-3xl text-white disabled:opacity-50">{k}</button>)}</div>
  <div className="flex gap-4">{!phoneActive ? <button onClick={onStartCall} className="flex-1 bg-green-600 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3"><PhoneCall size={28}/> CALL</button> : <button onClick={onEndCall} className="flex-1 bg-red-600 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3"><PhoneCall size={28} className="rotate-[135deg]"/> END</button>}
  {!phoneActive && dialedNumber && <button onClick={onBackspace} className="bg-slate-700 text-white rounded-full px-6"><Delete size={28}/></button>}</div></div></div>;
}

export function DispensingScreen({ selectedName, selectedImage, progress, message }: { selectedName?: string; selectedImage?: string; progress:number; message:string }) {
  return <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900"><div className="w-full max-w-2xl bg-slate-800/80 p-12 rounded-[3rem] text-center"><div className="relative bg-slate-900 rounded-full p-4 w-fit mx-auto mb-8">{selectedImage ? <img src={selectedImage} alt={selectedName} className="w-40 h-40 object-cover rounded-full" /> : <CheckCircle2 className="text-cyan-400" size={64} />}</div><h2 className="text-4xl text-white mb-2">Preparing Order</h2><p className="text-cyan-400 text-2xl mb-8">{selectedName}</p><div className="w-full bg-slate-900 h-8 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} /></div><div className="text-gray-300 mt-4">{message} ({progress}%)</div></div></div>;
}

export function ThankYouScreen({ selectedName }: { selectedName?: string }) {
  return <div className="flex-1 flex items-center justify-center"><div className="text-center"><CheckCircle2 size={100} className="text-green-400 mx-auto mb-4" /><h2 className="text-6xl font-black text-white mb-4">Thank You!</h2><p className="text-green-400">Enjoy your {selectedName}!</p></div></div>;
}
