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
    
    // Format the date with proper timezone handling
    const formatEntryDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
    };
    
    return (
      <div key={entry.id} className="mb-3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2">
          {/* Left side with meal icon and food name */}
          <div className="flex items-center">
            <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
              <span className={`text-base ${colors.text}`}>{MEAL_TYPE_EMOJIS[mealType]}</span>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate max-w-[150px] sm:max-w-[200px]">{entry.name}</p>
              <p className="text-xs text-gray-500">{entry.portion}</p>
              {entry.date && (
                <p className="text-xs text-gray-400 mt-0.5">{formatEntryDate(entry.date)}</p>
              )}
            </div>
          </div>
          
          {/* Right side with nutrition info and actions */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
            {/* Nutrition info */}
            <div className="text-left sm:text-right sm:mr-4">
              <p className="text-sm font-semibold text-gray-800">{entry.calories} cal</p>
              <div className="flex flex-wrap text-xs text-gray-500 gap-1 mt-0.5">
                <span className="px-1.5 py-0.5 bg-green-50 rounded-full">P: {entry.protein}g</span>
                <span className="px-1.5 py-0.5 bg-purple-50 rounded-full">C: {entry.carbs}g</span>
                <span className="px-1.5 py-0.5 bg-yellow-50 rounded-full">F: {entry.fat}g</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-1 flex-shrink-0">
              <button 
                onClick={() => handleEditFood(entry)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Edit food entry"
                disabled={isDeleting}
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={() => handleDeleteFood(String(entry.id))}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
          <div className="p-5">
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-5">
            <p className="text-red-500 text-base">Error loading food data: {error}</p>
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
