import { CategoryKey, Item } from '../types/vending';

export const INVENTORY: Record<CategoryKey, Item[]> = {
  snacks: [
    { id: 'A1', name: 'Munchee Cream Cracker', price: 120, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80' },
    { id: 'A2', name: 'Maliban Choco Cream', price: 150, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=300&q=80' },
    { id: 'A3', name: 'Ritz Biscuit', price: 140, image: 'https://images.unsplash.com/photo-1605666807753-1e58cb300d81?auto=format&fit=crop&w=300&q=80' },
    { id: 'A4', name: 'Maliban Lemon Puff', price: 150, image: 'https://images.unsplash.com/photo-1590080874088-eec64895f423?auto=format&fit=crop&w=300&q=80' },
    { id: 'A5', name: 'Chocolate Bar', price: 200, image: 'https://images.unsplash.com/photo-1604382595914-72688846747d?auto=format&fit=crop&w=300&q=80' },
    { id: 'A6', name: 'Wafer Biscuit', price: 160, image: 'https://images.unsplash.com/photo-1585802525164-9f20610360a8?auto=format&fit=crop&w=300&q=80' },
  ],
  coldDrinks: [
    { id: 'B1', name: 'Coca Cola Can', price: 250, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
    { id: 'B2', name: 'Sprite Can', price: 250, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=300&q=80' },
    { id: 'B3', name: 'Fanta Can', price: 250, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=300&q=80' },
    { id: 'B4', name: 'Bottled Water', price: 120, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=300&q=80' },
    { id: 'B5', name: 'Cream Soda Bottle', price: 220, image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=300&q=80' },
    { id: 'B6', name: 'Orange Soda Bottle', price: 220, image: 'https://images.unsplash.com/photo-1620861113524-2c672abf0a3d?auto=format&fit=crop&w=300&q=80' },
  ],
  coffee: [
    { id: 'C1', name: 'Espresso', price: 180, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=300&q=80' },
    { id: 'C2', name: 'Cappuccino', price: 220, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=300&q=80' },
    { id: 'C3', name: 'Latte', price: 220, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=300&q=80' },
    { id: 'C4', name: 'Mocha', price: 240, image: 'https://images.unsplash.com/photo-1572442388796-11668aa44f15?auto=format&fit=crop&w=300&q=80' },
  ],
  freshDrinks: [
    { id: 'D1', name: 'Milo Drink', price: 150, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
    { id: 'D2', name: 'Hot Chocolate', price: 150, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=300&q=80' },
    { id: 'D3', name: 'Milk Tea', price: 150, image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=300&q=80' },
    { id: 'D4', name: 'Lemon Tea', price: 150, image: 'https://images.unsplash.com/photo-1648039239843-c64a8523b08e?auto=format&fit=crop&w=300&q=80' },
  ],
};
