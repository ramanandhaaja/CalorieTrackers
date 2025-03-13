'use client';

import React, { useEffect, useState } from 'react';
import { useFoodEntries, MealType } from '@/hooks/useFoodEntries';
import type { FoodEntry } from '../../payload-types';
import FoodEntryModal, { FoodData } from '../modal/FoodEntryModal';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Emoji map for meal types
const MEAL_TYPE_EMOJIS: Record<MealType, string> = {
  breakfast: '🥣',
  lunch: '🥗',
  dinner: '🍲',
  snack: '🍎'
};

// Color map for meal types
const MEAL_TYPE_COLORS: Record<MealType, { bg: string, text: string, dot: string }> = {
  breakfast: { bg: 'bg-blue-50', text: 'text-blue-500', dot: 'bg-blue-500' },
  lunch: { bg: 'bg-green-50', text: 'text-green-500', dot: 'bg-green-500' },
  dinner: { bg: 'bg-purple-50', text: 'text-purple-500', dot: 'bg-purple-500' },
  snack: { bg: 'bg-amber-50', text: 'text-amber-500', dot: 'bg-amber-500' }
};

interface FoodEntriesWidgetProps {
  onFoodEntriesUpdated?: () => void;
}

export default function FoodEntriesWidget({ onFoodEntriesUpdated }: FoodEntriesWidgetProps) {
  const { 
    mealGroups,
    mealTotals,
    isLoading,
    error,
    refreshFoodEntries
  } = useFoodEntries();
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for editing a food entry
  const [editingFood, setEditingFood] = useState<FoodEntry | null>(null);
  // State for confirming deletion
  const [deletingFoodId, setDeletingFoodId] = useState<string | null>(null);

  // Listen for food-added events from other components
  useEffect(() => {
    const handleFoodAdded = () => {
      console.log('Food added event received, refreshing data...');
      refreshFoodEntries();
      
      // Notify parent component that food entries have been updated
      if (onFoodEntriesUpdated) {
        onFoodEntriesUpdated();
      }
    };
    
    // Add event listener
    window.addEventListener('food-added', handleFoodAdded);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('food-added', handleFoodAdded);
    };
  }, [refreshFoodEntries, onFoodEntriesUpdated]);

  const handleAddFood = () => {
    // Reset editing state to ensure we're adding a new entry
    setEditingFood(null);
    // Open the food entry modal
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
  };
  
  const handleSubmitFood = (foodData: FoodData) => {
    // The FoodEntryModal already handles the API call and toast notification
    // We just need to refresh the food entries data
    console.log('Food submitted from modal:', foodData);
    refreshFoodEntries();
    
    // Notify parent component that food entries have been updated
    if (onFoodEntriesUpdated) {
      onFoodEntriesUpdated();
    }
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('food-entries-updated'));
  };

  // Handle edit food entry
  const handleEditFood = (entry: FoodEntry) => {
    setEditingFood(entry);
    setIsModalOpen(true);
  };

  // Handle delete food entry
  const handleDeleteFood = async (id: string) => {
    try {
      // Set the deleting state to show loading spinner
      setDeletingFoodId(id);
      
      const response = await fetch(`/api/food?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete food entry');
      }
      
      // Show success toast
      toast.success('Food entry deleted successfully');
      
      // Refresh food entries
      refreshFoodEntries();
      
      // Notify parent component that food entries have been updated
      if (onFoodEntriesUpdated) {
        onFoodEntriesUpdated();
      }

      // Dispatch event to refresh NutrientGoalsWidget
      window.dispatchEvent(new Event('food-entries-updated'));
    } catch (error) {
      console.error('Error deleting food entry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete food entry');
    } finally {
      // Clear the deleting state
      setDeletingFoodId(null);
    }
  };

  // Render a single food entry
  const renderFoodEntry = (entry: FoodEntry, mealType: MealType) => {
    const colors = MEAL_TYPE_COLORS[mealType];
    const isDeleting = deletingFoodId === String(entry.id);
    
    return (
      <div key={entry.id} className="flex justify-between py-2 border-b border-gray-50">
        <div className="flex items-center">
          <div className={`w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center`}>
            <span className={`text-sm ${colors.text}`}>{MEAL_TYPE_EMOJIS[mealType]}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{entry.name}</p>
            <p className="text-sm text-gray-500">{entry.portion}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-3">
            <p className="text-sm font-medium">{entry.calories} cal</p>
            <div className="flex text-sm text-gray-500 space-x-2">
              <span>P: {entry.protein}g</span>
              <span>C: {entry.carbs}g</span>
              <span>F: {entry.fat}g</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <button 
              onClick={() => handleEditFood(entry)}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Edit food entry"
              disabled={isDeleting}
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => handleDeleteFood(String(entry.id))}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete food entry"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render a meal section (breakfast, lunch, dinner, snack)
  const renderMealSection = (mealType: MealType, entries: FoodEntry[], totalCalories: number) => {
    if (entries.length === 0 && mealType !== 'breakfast') {
      return null; // Don't show empty sections except breakfast
    }
    
    const colors = MEAL_TYPE_COLORS[mealType];
    const mealTypeLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
    
    return (
      <div className="py-3">
        <div className="flex items-center mb-2">
          <div className={`w-2 h-2 ${colors.dot} rounded-full mr-2`}></div>
          <h3 className="text-sm font-medium text-gray-800">{mealTypeLabel}</h3>
          <p className="ml-auto text-sm text-gray-500">{totalCalories} cal</p>
        </div>
        <div className="pl-4">
          {entries.length > 0 ? (
            entries.map(entry => renderFoodEntry(entry, mealType))
          ) : (
            <p className="text-sm text-gray-400 italic py-2">No entries yet</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Today's Meals</h2>
        <button 
          onClick={handleAddFood}
          className="text-base font-medium text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Food
        </button>
      </div>
      
      <div className="px-5 py-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-5 text-base">
            Error loading food data. Please try again.
          </div>
        ) : (
          <>
            {renderMealSection('breakfast', mealGroups.breakfast, mealTotals.breakfast)}
            {renderMealSection('lunch', mealGroups.lunch, mealTotals.lunch)}
            {renderMealSection('dinner', mealGroups.dinner, mealTotals.dinner)}
            {renderMealSection('snack', mealGroups.snack, mealTotals.snack)}
          </>
        )}
      </div>
      
      {/* Food Entry Modal */}
      <FoodEntryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFood}
        initialFoodData={editingFood ? {
          id: String(editingFood.id),
          name: editingFood.name as string,
          portion: editingFood.portion as string,
          calories: editingFood.calories as number,
          protein: editingFood.protein as number,
          carbs: editingFood.carbs as number,
          fat: editingFood.fat as number,
          mealType: editingFood.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        } : undefined}
      />
    </div>
  );
}
