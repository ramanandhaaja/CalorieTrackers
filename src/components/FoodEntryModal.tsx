import React, { useState } from 'react';
import { Button } from './ui/button';

type FoodEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (foodData: FoodData) => void;
};

export type FoodData = {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

const initialFoodData: FoodData = {
  name: '',
  portion: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  mealType: 'breakfast',
};

export default function FoodEntryModal({ isOpen, onClose, onSubmit }: FoodEntryModalProps) {
  const [foodData, setFoodData] = useState<FoodData>(initialFoodData);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['calories', 'protein', 'carbs', 'fat'].includes(name)) {
      setFoodData({ ...foodData, [name]: parseFloat(value) || 0 });
    } else {
      setFoodData({ ...foodData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(foodData);
    setFoodData(initialFoodData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Add Food</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={foodData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="portion" className="block text-sm font-medium text-gray-700 mb-1">
              Portion Size
            </label>
            <input
              type="text"
              id="portion"
              name="portion"
              value={foodData.portion}
              onChange={handleChange}
              placeholder="e.g., 1 cup (250g)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={foodData.calories || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                id="mealType"
                name="mealType"
                value={foodData.mealType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={foodData.protein || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={foodData.carbs || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={foodData.fat || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Food
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
