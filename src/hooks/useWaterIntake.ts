import { useState, useEffect } from 'react';

export type WaterIntakeData = {
  totalMilliliters: number;
  totalLiters: string;
  dailyGoalLiters: number;
  remainingLiters: string;
  percentComplete: number;
  entries: any[];
  isLoading: boolean;
  error: string | null;
};

const defaultData: Omit<WaterIntakeData, 'isLoading' | 'error'> = {
  totalMilliliters: 0,
  totalLiters: '0.0',
  dailyGoalLiters: 2.0,
  remainingLiters: '2.0',
  percentComplete: 0,
  entries: [],
};

export function useWaterIntake() {
  const [data, setData] = useState<Omit<WaterIntakeData, 'isLoading' | 'error'>>(defaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaterIntake = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/water');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch water intake: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching water intake:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch water intake data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch water intake data on component mount
  useEffect(() => {
    fetchWaterIntake();
  }, []);

  // Return a function to manually refresh the data
  const refreshWaterIntake = () => {
    fetchWaterIntake();
  };

  return {
    ...data,
    isLoading,
    error,
    refreshWaterIntake,
  };
}
