'use client';

import { CheckCircle2, CreditCard, Plus, X } from 'lucide-react';
import { PaymentModalState } from '../../types/vending';

interface Props {
  paymentModal: PaymentModalState;
  paymentProcessing: boolean;
  onClose: () => void;
  onInsertMoney: (amount: number) => void;
  onConfirm: () => void;
}

export function PaymentModal({ paymentModal, paymentProcessing, onClose, onInsertMoney, onConfirm }: Props) {
  if (!paymentModal.isOpen || !paymentModal.item || !paymentModal.type) return null;
  const { type, item, insertedAmount } = paymentModal;
  const isReady = type === 'cash' ? insertedAmount >= item.price : true;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
      <div className="bg-slate-800 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="text-2xl font-bold text-white">{type === 'cash' ? 'Insert Cash' : type === 'card' ? 'Tap Card' : 'Scan QR Code'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"><X size={24} /></button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8 bg-black/30 w-full p-4 rounded-2xl border border-white/5">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
            <div className="flex-1">
              <div className="text-white font-bold">{item.name}</div>
              <div className="text-cyan-400 font-mono text-xl">Rs {item.price}</div>
            </div>
          </div>

          {type === 'cash' && (
            <div className="w-full flex flex-col items-center">
              <p className={`text-6xl font-mono font-bold ${insertedAmount >= item.price ? 'text-green-400' : 'text-white'}`}>Rs {insertedAmount}</p>
              {insertedAmount < item.price && <p className="text-red-400 text-sm mt-2">Need Rs {item.price - insertedAmount} more</p>}
              <div className="grid grid-cols-2 gap-4 w-full my-8">
                {[20, 50, 100, 500].map((amt) => (
                  <button key={amt} onClick={() => onInsertMoney(amt)} className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 py-4 rounded-xl hover:bg-emerald-600/40 transition-colors font-bold text-xl flex items-center justify-center gap-2">
                    <Plus size={20} /> Rs {amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'card' && <div className="text-white mb-8"><CreditCard size={64} className="mx-auto text-blue-400 mb-4" />Rs {item.price}</div>}
          {type === 'qr' && <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vending-payment-simulation" alt="QR Code" className="w-48 h-48 mb-8 bg-white p-2 rounded-xl" />}

          <button onClick={onConfirm} disabled={!isReady || paymentProcessing} className={`w-full py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${!isReady ? 'bg-slate-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'}`}>
            {paymentProcessing ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 size={24} />{type === 'cash' ? 'Complete Payment' : 'Proceed to Payment'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
