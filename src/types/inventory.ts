export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  uom: string;
  pricePerQty: number;
}

export interface RecipeItem {
  itemId: number;
  quantity: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  items: RecipeItem[];
  sellingPrice: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
}