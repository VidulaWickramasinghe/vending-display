'use client';

import dynamic from 'next/dynamic';

// Dynamically import the actual vending machine component.
// The ssr: false flag prevents server-side rendering errors for browser-specific APIs.
const VendingMachineDisplay = dynamic(
  () => import('./VendingMachineDisplay'),
  { ssr: false }
);

export default function VendingMachineDisplayClient() {
  return <VendingMachineDisplay />;
}