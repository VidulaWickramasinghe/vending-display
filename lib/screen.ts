import { Screen } from '../types/vending';

export const screenTitle = (screen: Screen): string => {
  switch (screen) {
    case 'categories':
      return 'CHOOSE CATEGORY';
    case 'snacks':
      return 'SNACKS & BISCUITS';
    case 'coldDrinks':
      return 'COLD DRINKS';
    case 'coffee':
      return 'HOT COFFEE';
    case 'freshDrinks':
      return 'FRESH DRINKS';
    case 'phone':
      return 'PUBLIC PHONE';
    case 'dispensing':
      return 'PREPARING...';
    default:
      return '';
  }
};
