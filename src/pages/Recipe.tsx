import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Recipe, RecipeItem } from '../types/inventory';
import { Plus, Edit2, Trash2, X, Coffee } from 'lucide-react';

export default function RecipePage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cups, setCups] = useState(1);
  const { recipes, inventory, addRecipe, updateRecipe, deleteRecipe } = useStore();

  const calculateCOGS = (items: RecipeItem[]) => {
    return items.reduce((total, recipe) => {
      const item = inventory.find((i) => i.id === recipe.itemId);
      if (!item) return total;

      let itemCost = 0;
      switch (item.uom.toLowerCase()) {
        case 'kg':
          itemCost = (recipe.quantity / 1000) * item.pricePerQty;
          break;
        case 'liter':
          itemCost = (recipe.quantity / 1000) * item.pricePerQty;
          break;
        case 'pcs':
          itemCost = (recipe.quantity / item.quantity) * item.pricePerQty;
          break;
        default:
          itemCost = (recipe.quantity / item.quantity) * item.pricePerQty;
      }
      return total + itemCost;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const recipeItems: RecipeItem[] = inventory.map((item) => ({
      itemId: item.id,
      quantity: Number(formData.get(`quantity-${item.id}`)) || 0,
    })).filter(item => item.quantity > 0);

    const recipe: Recipe = {
      id: editingRecipe?.id || recipes.length + 1,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      items: recipeItems,
      sellingPrice: Number(formData.get('sellingPrice')),
    };

    if (editingRecipe) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }
    setShowModal(false);
    setEditingRecipe(null);
  };

  const handleDelete = (recipe: Recipe) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      setSelectedRecipe(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recipes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipe List */}
        <div className="col-span-1 border-r pr-6">
          <h3 className="text-lg font-semibold mb-4">Recipe List</h3>
          <div className="space-y-2">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedRecipe?.id === recipe.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                } border`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{recipe.name}</h4>
                  <Coffee className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  COGS: Rp {calculateCOGS(recipe.items).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Detail */}
        <div className="col-span-1 md:col-span-2">
          {selectedRecipe ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedRecipe.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedRecipe.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingRecipe(selectedRecipe);
                      setShowModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRecipe)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients</h4>
                  <ul className="space-y-2">
                    {selectedRecipe.items.map((item) => {
                      const inventoryItem = inventory.find((i) => i.id === item.itemId);
                      return (
                        <li key={item.itemId} className="flex justify-between items-center">
                          <span>{inventoryItem?.name}</span>
                          <span>
                            {item.quantity} {item.quantity > 1000 ? 'kg/L' : inventoryItem?.uom === 'pcs' ? 'pcs' : 'g/ml'}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Calculate Multiple Cups</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Cups
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cups}
                        onChange={(e) => setCups(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="w-2/3 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span>Cost per Cup:</span>
                        <span>Rp {calculateCOGS(selectedRecipe.items).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2">
                        <span>Total COGS ({cups} cups):</span>
                        <span className="text-blue-600">
                          Rp {(calculateCOGS(selectedRecipe.items) * cups).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cost Analysis</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>COGS:</span>
                      <span>Rp {calculateCOGS(selectedRecipe.items).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selling Price:</span>
                      <span>Rp {selectedRecipe.sellingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Profit:</span>
                      <span className="text-green-600">
                        Rp {(selectedRecipe.sellingPrice - calculateCOGS(selectedRecipe.items)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                      <span>Total Profit ({cups} cups):</span>
                      <span className="text-green-600">
                        Rp {((selectedRecipe.sellingPrice - calculateCOGS(selectedRecipe.items)) * cups).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a recipe to view details
            </div>
          )}
        </div>
      </div>

      {/* Recipe Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingRecipe(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingRecipe?.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingRecipe?.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    defaultValue={editingRecipe?.sellingPrice}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                  <div className="space-y-2">
                    {inventory.map((item) => {
                      const recipeItem = editingRecipe?.items.find((r) => r.itemId === item.id);
                      return (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="flex-1">{item.name}</div>
                          <input
                            type="number"
                            name={`quantity-${item.id}`}
                            defaultValue={recipeItem?.quantity || 0}
                            className="w-32 rounded-md border-gray-300 shadow-sm"
                            placeholder="Quantity"
                          />
                          <div className="w-20">
                            {item.uom === 'kg' || item.uom === 'Liter' ? 'g/ml' : item.uom}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecipe(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {editingRecipe ? 'Update' : 'Add'} Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}