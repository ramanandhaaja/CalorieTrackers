import { useState, useEffect } from 'react';
import type { FoodEntry } from '../payload-types';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodEntriesData = {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealGroups: {
    breakfast: FoodEntry[];
    lunch: FoodEntry[];
    dinner: FoodEntry[];
    snack: FoodEntry[];
  };
  mealTotals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  entries: FoodEntry[];
  isLoading: boolean;
  error: string | null;
};

const defaultData: Omit<FoodEntriesData, 'isLoading' | 'error'> = {
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
  mealGroups: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  },
  mealTotals: {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0
  },
  entries: []
};

export function useFoodEntries() {
  const [data, setData] = useState<Omit<FoodEntriesData, 'isLoading' | 'error'>>(defaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add a timestamp parameter to ensure we're using the client's timezone
      // This helps prevent caching and ensures consistent timezone handling
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/food?_t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch food entries: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching food entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch food entries');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch food entries data on component mount
  useEffect(() => {
    fetchFoodEntries();
  }, []);

  // Return a function to manually refresh the data
  const refreshFoodEntries = () => {
    fetchFoodEntries();
  };

  return {
    ...data,
    isLoading,
    error,
    refreshFoodEntries,
  };
}
