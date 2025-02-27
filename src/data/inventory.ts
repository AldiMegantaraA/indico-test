import { InventoryItem, Recipe } from '../types/inventory';

export const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Aren Sugar', quantity: 1, uom: 'kg', pricePerQty: 60000 },
  { id: 2, name: 'Milk', quantity: 1, uom: 'Liter', pricePerQty: 30000 },
  { id: 3, name: 'Ice Cube', quantity: 1, uom: 'Kg', pricePerQty: 15000 },
  { id: 4, name: 'Plastic Cup', quantity: 10, uom: 'pcs', pricePerQty: 5000 },
  { id: 5, name: 'Coffee Bean', quantity: 1, uom: 'kg', pricePerQty: 100000 },
  { id: 6, name: 'Mineral Water', quantity: 1, uom: 'Liter', pricePerQty: 5000 },
];

export const initialRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Classic Iced Coffee',
    description: 'Our signature iced coffee with milk and aren sugar',
    items: [
      { itemId: 1, quantity: 15 }, // aren sugar (g)
      { itemId: 2, quantity: 150 }, // milk (ml)
      { itemId: 3, quantity: 20 }, // ice cube (g)
      { itemId: 4, quantity: 1 }, // plastic cup (pcs)
      { itemId: 5, quantity: 20 }, // coffee bean (g)
      { itemId: 6, quantity: 50 }, // mineral water (ml)
    ],
    sellingPrice: 25000,
  },
];