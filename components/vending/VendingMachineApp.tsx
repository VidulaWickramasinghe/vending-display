'use client';

import { AlertCircle, CheckCircle2, Coins, CreditCard, QrCode } from 'lucide-react';
import { useClock } from '../../hooks/useClock';
import { useVendingMachine } from '../../hooks/useVendingMachine';
import { INVENTORY } from '../../lib/inventory';
import { screenTitle } from '../../lib/screen';
import { PaymentModal } from './PaymentModal';
import { CategoryScreen, CoffeeScreen, DispensingScreen, PhoneScreen, ProductGrid, Screensaver, ThankYouScreen } from './Screens';
import { TopBar } from './TopBar';

const formatSLSTTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: true });

export default function VendingMachineApp() {
  const currentTime = useClock();
  const vm = useVendingMachine();

  return (
    <div className="min-h-screen bg-black flex justify-center select-none font-sans text-slate-50">
      <div className="w-full max-w-[1080px] h-screen flex flex-col bg-slate-900 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border-x border-white/5">
        {vm.toast && (
          <div className={`absolute top-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-8 py-4 rounded-full ${vm.toast.type === 'error' ? 'bg-red-500/95' : 'bg-green-500/95'}`}>
            {vm.toast.type === 'error' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
            <span className="text-xl font-medium">{vm.toast.message}</span>
          </div>
        )}

        <PaymentModal
          paymentModal={vm.paymentModal}
          paymentProcessing={vm.paymentProcessing}
          onClose={() => vm.setPaymentModal({ isOpen: false, item: null, type: null, insertedAmount: 0 })}
          onInsertMoney={vm.handleInsertMoney}
          onConfirm={() => {
            if (vm.paymentModal.type === 'cash' && vm.paymentModal.item) {
              vm.completePurchase(vm.paymentModal.item, vm.paymentModal.item.price);
              return;
            }
            vm.processDigitalPayment();
          }}
        />

        {vm.currentScreen !== 'screensaver' && (
          <TopBar
            title={screenTitle(vm.currentScreen)}
            currentScreen={vm.currentScreen}
            currentTimeLabel={formatSLSTTime(currentTime)}
            onBack={() => vm.setCurrentScreen('categories')}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {vm.currentScreen === 'screensaver' && <Screensaver timeLabel={formatSLSTTime(currentTime)} onStart={() => vm.setCurrentScreen('categories')} />}
          {vm.currentScreen === 'categories' && <CategoryScreen onSelect={(screen) => vm.setCurrentScreen(screen)} />}
          {vm.currentScreen === 'snacks' && <ProductGrid items={INVENTORY.snacks} category={'snacks'} onBuy={vm.startPaymentFlow} />}
          {vm.currentScreen === 'coldDrinks' && <ProductGrid items={INVENTORY.coldDrinks} category={'coldDrinks'} onBuy={vm.startPaymentFlow} />}
          {vm.currentScreen === 'freshDrinks' && <ProductGrid items={INVENTORY.freshDrinks} category={'freshDrinks'} onBuy={vm.startPaymentFlow} />}
          {vm.currentScreen === 'coffee' && <CoffeeScreen sugarLevel={vm.sugarLevel} onSugarChange={vm.setSugarLevel} onBuy={vm.startPaymentFlow} />}
          {vm.currentScreen === 'phone' && (
            <PhoneScreen
              phoneActive={vm.phoneActive}
              dialedNumber={vm.dialedNumber}
              callDurationLabel={vm.callDurationLabel}
              onDial={vm.handleDial}
              onStartCall={vm.handleStartCall}
              onEndCall={vm.handleEndCall}
              onBackspace={vm.handleBackspaceNumber}
            />
          )}
          {vm.currentScreen === 'dispensing' && <DispensingScreen selectedName={vm.selectedItem?.name} selectedImage={vm.selectedItem?.image} progress={vm.dispenseProgress} message={vm.dispenseMessage} />}
          {vm.currentScreen === 'thankYou' && <ThankYouScreen selectedName={vm.selectedItem?.name} />}
        </div>

        {!['screensaver', 'dispensing', 'thankYou'].includes(vm.currentScreen) && (
          <div className="mt-auto bg-slate-950 border-t border-white/10 p-6 flex justify-between items-center z-10 shrink-0">
            <div className="flex gap-8 items-center pl-4">
              <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">Supported Payments</span>
              <div className="flex items-center gap-2 text-emerald-400"><Coins size={24} /> Cash</div>
              <div className="flex items-center gap-2 text-blue-400"><CreditCard size={24} /> Card</div>
              <div className="flex items-center gap-2 text-purple-400"><QrCode size={24} /> QR</div>
            </div>
            {vm.credit > 0 && <div className="bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl text-green-400 font-mono font-bold text-2xl">Rs {vm.credit}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
