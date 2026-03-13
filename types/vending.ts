export type Screen =
  | 'screensaver'
  | 'categories'
  | 'snacks'
  | 'coldDrinks'
  | 'coffee'
  | 'freshDrinks'
  | 'phone'
  | 'dispensing'
  | 'thankYou';

export type CategoryKey = 'snacks' | 'coldDrinks' | 'coffee' | 'freshDrinks';

export type PaymentType = 'cash' | 'card' | 'qr';

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ItemWithCategory extends Item {
  category: CategoryKey;
}

export interface ToastState {
  message: string;
  type: 'error' | 'success';
}

export interface PaymentModalState {
  isOpen: boolean;
  type: PaymentType | null;
  item: ItemWithCategory | null;
  insertedAmount: number;
}
