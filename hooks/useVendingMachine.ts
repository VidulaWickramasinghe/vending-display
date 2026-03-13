'use client';

import { useEffect, useMemo, useState } from 'react';
import { Screen, ToastState, PaymentModalState, Item, CategoryKey, PaymentType, ItemWithCategory } from '../types/vending';

const INITIAL_PAYMENT_MODAL: PaymentModalState = {
  isOpen: false,
  type: null,
  item: null,
  insertedAmount: 0,
};

export const useVendingMachine = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('screensaver');
  const [credit, setCredit] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [paymentModal, setPaymentModal] = useState<PaymentModalState>(INITIAL_PAYMENT_MODAL);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(null);
  const [dispenseProgress, setDispenseProgress] = useState(0);
  const [dispenseMessage, setDispenseMessage] = useState('');

  const [sugarLevel, setSugarLevel] = useState(2);
  const [dialedNumber, setDialedNumber] = useState('');
  const [phoneActive, setPhoneActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const showToast = (message: string, type: ToastState['type'] = 'error') => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleEndCall = () => {
    setPhoneActive(false);
    setDialedNumber('');
    setCallDuration(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (phoneActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => {
          if ((prev + 1) % 10 === 0) {
            setCredit((c) => {
              if (c >= 10) return c - 10;
              handleEndCall();
              showToast('Call ended: Insufficient funds');
              return c;
            });
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phoneActive]);

  useEffect(() => {
    if (currentScreen !== 'dispensing' || !selectedItem) return;

    setDispenseProgress(0);
    setDispenseMessage('Initiating...');

    const interval = setInterval(() => {
      setDispenseProgress((prev) => {
        const next = prev + 5;
        if (next <= 30) setDispenseMessage('Preparing your selection...');
        else if (next <= 60 && ['coffee', 'freshDrinks'].includes(selectedItem.category)) setDispenseMessage('Mixing ingredients...');
        else if (next <= 60) setDispenseMessage('Locating item...');
        else if (next <= 90) setDispenseMessage('Dispensing...');
        else setDispenseMessage('Done! Please take your item.');

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentScreen('thankYou');
            setTimeout(() => {
              setCurrentScreen('screensaver');
              setSelectedItem(null);
              setCredit(0);
            }, 4000);
          }, 1000);
        }
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [currentScreen, selectedItem]);

  const completePurchase = (item: ItemWithCategory, cost: number) => {
    setCredit((prev) => (paymentModal.type === 'cash' ? paymentModal.insertedAmount - cost : prev));
    setSelectedItem(item);
    setPaymentModal(INITIAL_PAYMENT_MODAL);
    setCurrentScreen('dispensing');
  };

  const startPaymentFlow = (item: Item, category: CategoryKey, paymentType: PaymentType) => {
    if (credit >= item.price && paymentType === 'cash') {
      completePurchase({ ...item, category }, item.price);
      return;
    }

    setPaymentModal({
      isOpen: true,
      type: paymentType,
      item: { ...item, category },
      insertedAmount: paymentType === 'cash' ? credit : 0,
    });
  };

  const handleInsertMoney = (amount: number) => {
    setPaymentModal((prev) => ({ ...prev, insertedAmount: prev.insertedAmount + amount }));
  };

  const processDigitalPayment = () => {
    if (!paymentModal.item) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      completePurchase(paymentModal.item as ItemWithCategory, paymentModal.item!.price);
    }, 2000);
  };

  const handleDial = (digit: string) => {
    if (dialedNumber.length < 15) setDialedNumber((prev) => prev + digit);
  };

  const handleBackspaceNumber = () => setDialedNumber((prev) => prev.slice(0, -1));

  const handleStartCall = () => {
    if (dialedNumber.length === 0) return showToast('Please enter a number');
    if (credit < 10) return showToast('Rs 10 minimum required to call');
    setCredit((prev) => prev - 10);
    setPhoneActive(true);
    setCallDuration(0);
  };

  const callDurationLabel = useMemo(() => {
    const mins = Math.floor(callDuration / 60);
    const secs = (callDuration % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [callDuration]);

  return {
    currentScreen,
    setCurrentScreen,
    credit,
    toast,
    paymentModal,
    setPaymentModal,
    paymentProcessing,
    selectedItem,
    dispenseProgress,
    dispenseMessage,
    sugarLevel,
    setSugarLevel,
    dialedNumber,
    phoneActive,
    callDurationLabel,
    currentAdIndex,
    setCurrentAdIndex,
    showToast,
    startPaymentFlow,
    handleInsertMoney,
    processDigitalPayment,
    completePurchase,
    handleDial,
    handleBackspaceNumber,
    handleStartCall,
    handleEndCall,
  };
};
