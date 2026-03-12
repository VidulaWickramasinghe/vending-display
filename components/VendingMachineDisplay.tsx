'use client';

import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Phone,
  Cookie,
  CupSoda,
  GlassWater,
  ArrowLeft,
  Coins,
  CreditCard,
  QrCode,
  PhoneCall,
  Delete,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- Data ---
const INVENTORY = {
  snacks: [
    { id: 'A1', name: 'Munchee Cream Cracker', price: 120 },
    { id: 'A2', name: 'Maliban Choco Cream', price: 150 },
    { id: 'A3', name: 'Ritz Biscuit', price: 140 },
    { id: 'A4', name: 'Maliban Lemon Puff', price: 150 },
    { id: 'A5', name: 'Chocolate Bar', price: 200 },
    { id: 'A6', name: 'Wafer Biscuit', price: 160 },
  ],
  coldDrinks: [
    { id: 'B1', name: 'Coca Cola Can', price: 250 },
    { id: 'B2', name: 'Sprite Can', price: 250 },
    { id: 'B3', name: 'Fanta Can', price: 250 },
    { id: 'B4', name: 'Bottled Water', price: 120 },
    { id: 'B5', name: 'Cream Soda Bottle', price: 220 },
    { id: 'B6', name: 'Orange Soda Bottle', price: 220 },
  ],
  coffee: [
    { id: 'C1', name: 'Espresso', price: 180 },
    { id: 'C2', name: 'Cappuccino', price: 220 },
    { id: 'C3', name: 'Latte', price: 220 },
    { id: 'C4', name: 'Mocha', price: 240 },
  ],
  freshDrinks: [
    { id: 'D1', name: 'Milo Drink', price: 150 },
    { id: 'D2', name: 'Hot Chocolate', price: 150 },
    { id: 'D3', name: 'Milk Tea', price: 150 },
    { id: 'D4', name: 'Lemon Tea', price: 150 },
  ]
};

export default function VendingMachineDisplay() {
  // --- State ---
  const [currentScreen, setCurrentScreen] = useState('home'); // home, snacks, coldDrinks, coffee, freshDrinks, phone, dispensing
  const [credit, setCredit] = useState(0);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  // Purchase State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dispenseProgress, setDispenseProgress] = useState(0);
  const [dispenseMessage, setDispenseMessage] = useState('');

  // Coffee specific
  const [sugarLevel, setSugarLevel] = useState(2); // 0 to 4

  // Phone specific
  const [dialedNumber, setDialedNumber] = useState('');
  const [phoneActive, setPhoneActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // --- Effects ---
  // Handle Dispensing Animation
  useEffect(() => {
    if (currentScreen === 'dispensing' && selectedItem) {
      setDispenseProgress(0);
      setDispenseMessage('Initiating...');

      const interval = setInterval(() => {
        setDispenseProgress(prev => {
          const next = prev + 5; // 5% increments

          if (next <= 30) setDispenseMessage('Preparing your selection...');
          else if (next <= 60 && ['coffee', 'freshDrinks'].includes(selectedItem.category)) setDispenseMessage('Mixing ingredients...');
          else if (next <= 60) setDispenseMessage('Locating item...');
          else if (next <= 90) setDispenseMessage('Dispensing...');
          else setDispenseMessage('Done! Please take your item.');

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentScreen('home');
              setSelectedItem(null);
            }, 3000);
          }
          return next;
        });
      }, 250); // total time ~5 seconds

      return () => clearInterval(interval);
    }
  }, [currentScreen, selectedItem]);

  // Handle Phone Call Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneActive) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          // Deduct Rs 10 every 60 seconds (simplified for demo to every 10 seconds to show it working)
          if ((prev + 1) % 10 === 0) {
            setCredit(c => {
              if (c >= 10) return c - 10;
              handleEndCall(); // Auto end if out of money
              showToast("Call ended: Insufficient funds");
              return c;
            });
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneActive]);

  // Handle Toast Timeout
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- Handlers ---
  const showToast = (message: string, type = 'error') => {
    setToast({ message, type });
  };

  const handleAddCredit = (amount: number) => {
    setCredit(prev => prev + amount);
    showToast(`Added Rs ${amount}`, 'success');
  };

  const handlePurchase = (item: any, category: string) => {
    if (credit >= item.price) {
      setCredit(prev => prev - item.price);
      setSelectedItem({ ...item, category });
      setCurrentScreen('dispensing');
    } else {
      showToast(`Insufficient funds. Need Rs ${item.price - credit} more.`);
    }
  };

  const handleDial = (digit: string) => {
    if (dialedNumber.length < 15) setDialedNumber(prev => prev + digit);
  };

  const handleBackspaceNumber = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleStartCall = () => {
    if (dialedNumber.length === 0) {
      showToast("Please enter a number");
      return;
    }
    if (credit < 10) {
      showToast("Rs 10 minimum required to call");
      return;
    }
    setCredit(prev => prev - 10);
    setPhoneActive(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setPhoneActive(false);
    setDialedNumber('');
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- Sub-components ---
  const TopBar = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between px-8 py-6 bg-slate-800/80 backdrop-blur-md border-b border-white/10 shrink-0">
      {currentScreen !== 'home' ? (
        <button
          onClick={() => currentScreen === 'dispensing' ? null : setCurrentScreen('home')}
          className="flex items-center gap-3 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all text-xl font-medium"
        >
          <ArrowLeft size={28} />
          Back
        </button>
      ) : (
        <div className="w-[120px]"></div>
      )}
      <h1 className="text-3xl font-bold text-white tracking-wider uppercase text-center flex-1">
        {title}
      </h1>
      <div className="w-[120px] text-right text-cyan-400 font-mono text-2xl">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );

  const Footer = () => (
    <div className="mt-auto bg-slate-900 border-t border-white/10 p-6 flex flex-col gap-4 shrink-0 z-10">
      <div className="flex justify-between items-center text-white bg-slate-800 p-6 rounded-3xl border border-white/5 shadow-inner">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-3 opacity-70">
            <Coins size={28} /> <span className="text-xl">Coin/Note</span>
          </div>
          <div className="flex items-center gap-3 opacity-70">
            <CreditCard size={28} /> <span className="text-xl">Tap Card</span>
          </div>
          <div className="flex items-center gap-3 opacity-70">
            <QrCode size={28} /> <span className="text-xl">Scan QR</span>
          </div>
        </div>
        <div className="text-right flex items-center gap-6">
          <span className="text-gray-400 text-2xl uppercase tracking-widest">Credit</span>
          <span className="text-5xl font-mono font-bold text-green-400">Rs {credit}</span>
        </div>
      </div>

      {/* Simulation Controls (Hidden in real hardware, used for demo) */}
      <div className="flex justify-center gap-4 pt-2">
        <span className="text-gray-500 text-sm self-center mr-4">SIMULATE INSERT:</span>
        {[10, 50, 100, 500].map(amt => (
          <button
            key={amt}
            onClick={() => handleAddCredit(amt)}
            className="bg-green-600/20 text-green-400 border border-green-500/30 px-6 py-2 rounded-full hover:bg-green-600/40 transition-colors font-bold"
          >
            +Rs {amt}
          </button>
        ))}
      </div>
    </div>
  );

  // --- Screens ---
  const renderHome = () => (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 p-8 overflow-y-auto">
      <button onClick={() => setCurrentScreen('snacks')} className="w-full max-w-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:scale-[1.02] transition-transform p-8 rounded-3xl flex items-center gap-8 shadow-2xl shadow-amber-500/20">
        <div className="bg-white/20 p-6 rounded-2xl"><Cookie size={64} className="text-white" /></div>
        <span className="text-4xl font-bold text-white tracking-wide">Snacks & Biscuits</span>
      </button>

      <button onClick={() => setCurrentScreen('coldDrinks')} className="w-full max-w-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] transition-transform p-8 rounded-3xl flex items-center gap-8 shadow-2xl shadow-blue-500/20">
        <div className="bg-white/20 p-6 rounded-2xl"><CupSoda size={64} className="text-white" /></div>
        <span className="text-4xl font-bold text-white tracking-wide">Cold Drinks</span>
      </button>

      <button onClick={() => setCurrentScreen('coffee')} className="w-full max-w-2xl bg-gradient-to-r from-stone-700 to-stone-600 hover:scale-[1.02] transition-transform p-8 rounded-3xl flex items-center gap-8 shadow-2xl shadow-stone-500/20">
        <div className="bg-white/20 p-6 rounded-2xl"><Coffee size={64} className="text-white" /></div>
        <span className="text-4xl font-bold text-white tracking-wide">Hot Coffee</span>
      </button>

      <button onClick={() => setCurrentScreen('freshDrinks')} className="w-full max-w-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.02] transition-transform p-8 rounded-3xl flex items-center gap-8 shadow-2xl shadow-emerald-500/20">
        <div className="bg-white/20 p-6 rounded-2xl"><GlassWater size={64} className="text-white" /></div>
        <span className="text-4xl font-bold text-white tracking-wide">Fresh Drinks</span>
      </button>

      <button onClick={() => setCurrentScreen('phone')} className="w-full max-w-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] transition-transform p-8 rounded-3xl flex items-center gap-8 shadow-2xl shadow-purple-500/20">
        <div className="bg-white/20 p-6 rounded-2xl"><Phone size={64} className="text-white" /></div>
        <span className="text-4xl font-bold text-white tracking-wide">Public Phone</span>
      </button>
    </div>
  );

  const renderProductGrid = (items: any[], category: string, iconName: string) => (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePurchase(item, category)}
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all active:scale-95 group"
          >
            <div className="text-slate-400 group-hover:text-white transition-colors">
              {iconName === 'cookie' && <Cookie size={48} />}
              {iconName === 'soda' && <CupSoda size={48} />}
              {iconName === 'coffee' && <Coffee size={48} />}
              {iconName === 'glass' && <GlassWater size={48} />}
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-mono text-sm mb-1">{item.id}</div>
              <div className="text-2xl font-bold text-white mb-3">{item.name}</div>
              <div className="text-3xl font-mono text-green-400">Rs {item.price}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCoffeeScreen = () => (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      {/* Sugar Controls */}
      <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold text-white">Sugar Level</span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSugarLevel(Math.max(0, sugarLevel - 1))}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <Minus size={32} />
          </button>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(level => (
              <div key={level} className={`w-8 h-4 rounded-full transition-colors ${level <= sugarLevel ? 'bg-amber-400' : 'bg-slate-600'}`} />
            ))}
          </div>
          <button
            onClick={() => setSugarLevel(Math.min(4, sugarLevel + 1))}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <Plus size={32} />
          </button>
        </div>
      </div>

      {/* Coffee Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {INVENTORY.coffee.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePurchase({ ...item, name: `${item.name} (Sugar: ${sugarLevel})` }, 'coffee')}
            className="bg-white/5 border border-white/10 hover:bg-white/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 active:scale-95 group"
          >
            <Coffee size={48} className="text-stone-400 group-hover:text-stone-300" />
            <div className="text-center">
              <div className="text-gray-400 font-mono text-sm mb-1">{item.id}</div>
              <div className="text-2xl font-bold text-white mb-3">{item.name}</div>
              <div className="text-3xl font-mono text-green-400">Rs {item.price}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPhoneScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
      <div className="bg-slate-800/80 p-8 rounded-[3rem] border border-white/10 w-full shadow-2xl">

        {/* Phone Display */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 text-center min-h-[140px] flex flex-col justify-center relative overflow-hidden">
          {phoneActive ? (
            <div className="animate-pulse">
              <div className="text-green-400 text-xl font-medium mb-2">Calling...</div>
              <div className="text-white text-3xl font-mono tracking-widest mb-2">{dialedNumber}</div>
              <div className="text-gray-400 text-lg">{formatTime(callDuration)}</div>
            </div>
          ) : (
            <>
              <div className="text-gray-400 text-sm mb-3">Insert Coin to Start Call<br />Rs 10 = 1 minute</div>
              <div className="text-white text-4xl font-mono tracking-widest min-h-[40px]">
                {dialedNumber || 'Dial Number'}
              </div>
            </>
          )}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
            <button
              key={key}
              onClick={() => handleDial(key)}
              disabled={phoneActive}
              className="aspect-square bg-white/5 hover:bg-white/15 rounded-full flex items-center justify-center text-3xl text-white font-medium border border-white/5 transition-colors disabled:opacity-50"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!phoneActive ? (
            <button
              onClick={handleStartCall}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-600/20"
            >
              <PhoneCall size={28} /> CALL
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-full py-5 text-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-red-600/20"
            >
              <PhoneCall size={28} className="rotate-[135deg]" /> END
            </button>
          )}

          {!phoneActive && dialedNumber.length > 0 && (
            <button
              onClick={handleBackspaceNumber}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-full px-6 flex items-center justify-center transition-colors"
            >
              <Delete size={28} />
            </button>
          )}
        </div>

      </div>
    </div>
  );

  const renderDispensing = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12">
      <div className="w-full max-w-2xl bg-slate-800/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">

        {dispenseProgress < 100 ? (
          <div className="mb-12 relative flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute w-48 h-48 bg-cyan-500/20 rounded-full animate-ping" />
            <div className="absolute w-32 h-32 bg-cyan-500/40 rounded-full animate-pulse" />
            <div className="relative bg-slate-900 rounded-full p-8 border border-white/10 z-10">
              {selectedItem?.category === 'coffee' && <Coffee size={64} className="text-cyan-400" />}
              {selectedItem?.category === 'freshDrinks' && <GlassWater size={64} className="text-cyan-400" />}
              {selectedItem?.category === 'coldDrinks' && <CupSoda size={64} className="text-cyan-400" />}
              {selectedItem?.category === 'snacks' && <Cookie size={64} className="text-cyan-400" />}
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <CheckCircle2 size={120} className="text-green-500 animate-bounce" />
          </div>
        )}

        <h2 className="text-4xl font-bold text-white mb-4">
          {dispenseProgress < 100 ? 'Processing Order' : 'Order Complete!'}
        </h2>
        <p className="text-2xl text-cyan-400 mb-12 font-medium">
          {selectedItem?.name}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900 h-8 rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300 ease-out"
            style={{ width: `${dispenseProgress}%` }}
          />
        </div>

        <div className="mt-6 flex justify-between w-full text-gray-400 text-xl font-mono">
          <span>{dispenseMessage}</span>
          <span>{dispenseProgress}%</span>
        </div>

      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-900 flex justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black select-none">

      {/* Main Machine Display Container */}
      <div className="w-full max-w-[1080px] h-screen flex flex-col bg-slate-900/50 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black">

        {/* Global Toast Notification */}
        {toast && (
          <div className={`absolute top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl animate-in slide-in-from-top-4 fade-in ${
            toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
            <span className="text-xl font-medium">{toast.message}</span>
          </div>
        )}

        {/* Dynamic Top Bar */}
        <TopBar
          title={
            currentScreen === 'home' ? 'SMART VENDING STATION' :
            currentScreen === 'snacks' ? 'SNACKS & BISCUITS' :
            currentScreen === 'coldDrinks' ? 'COLD DRINKS' :
            currentScreen === 'coffee' ? 'HOT COFFEE' :
            currentScreen === 'freshDrinks' ? 'FRESH DRINKS' :
            currentScreen === 'phone' ? 'PUBLIC PHONE' :
            'DISPENSING'
          }
        />

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {currentScreen === 'home' && renderHome()}
          {currentScreen === 'snacks' && renderProductGrid(INVENTORY.snacks, 'snacks', 'cookie')}
          {currentScreen === 'coldDrinks' && renderProductGrid(INVENTORY.coldDrinks, 'coldDrinks', 'soda')}
          {currentScreen === 'freshDrinks' && renderProductGrid(INVENTORY.freshDrinks, 'freshDrinks', 'glass')}
          {currentScreen === 'coffee' && renderCoffeeScreen()}
          {currentScreen === 'phone' && renderPhoneScreen()}
          {currentScreen === 'dispensing' && renderDispensing()}
        </div>

        {/* Persistent Footer */}
        <Footer />

      </div>
    </div>
  );
}