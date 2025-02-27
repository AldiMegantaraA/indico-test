import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, InventoryItem, Recipe } from '../types/inventory';
import { initialInventory, initialRecipes } from '../data/inventory';

interface Store {
  auth: AuthState;
  inventory: InventoryItem[];
  recipes: Recipe[];
  setAuth: (auth: AuthState) => void;
  logout: () => void;
  setInventory: (inventory: InventoryItem[]) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: number) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      auth: {
        isAuthenticated: false,
        token: null,
        email: null,
      },
      inventory: initialInventory,
      recipes: initialRecipes,
      setAuth: (auth) => set({ auth }),
      logout: () =>
        set({
          auth: { isAuthenticated: false, token: null, email: null },
        }),
      setInventory: (inventory) => set({ inventory }),
      addInventoryItem: (item) =>
        set((state) => ({
          inventory: [...state.inventory, item],
        })),
      updateInventoryItem: (item) =>
        set((state) => ({
          inventory: state.inventory.map((i) =>
            i.id === item.id ? item : i
          ),
        })),
      deleteInventoryItem: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((i) => i.id !== id),
        })),
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [...state.recipes, recipe],
        })),
      updateRecipe: (recipe) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipe.id ? recipe : r
          ),
        })),
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'coffee-shop-storage',
    }
  )
);