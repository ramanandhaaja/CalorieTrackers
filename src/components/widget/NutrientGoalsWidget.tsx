'use client';

import React, { useState, useEffect } from 'react';

interface NutrientData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export default function NutrientGoalsWidget() {
  const [nutrientData, setNutrientData] = useState<NutrientData>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define goals
  const goals = {
    calories: 2200,
    protein: 120,
    carbs: 200,
    fat: 65
  };

  // Fetch nutrient data
  const fetchNutrientData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/food');
      
      if (!response.ok) {
        throw new Error('Failed to fetch nutrient data');
      }
      
      const data = await response.json();
      setNutrientData({
        totalCalories: data.totalCalories || 0,
        totalProtein: data.totalProtein || 0,
        totalCarbs: data.totalCarbs || 0,
        totalFat: data.totalFat || 0
      });
    } catch (err) {
      console.error('Error fetching nutrient data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchNutrientData();
  }, []);

  // Calculate percentages
  const percentages = {
    calories: Math.min(Math.round((nutrientData.totalCalories / goals.calories) * 100), 100),
    protein: Math.min(Math.round((nutrientData.totalProtein / goals.protein) * 100), 100),
    carbs: Math.min(Math.round((nutrientData.totalCarbs / goals.carbs) * 100), 100),
    fat: Math.min(Math.round((nutrientData.totalFat / goals.fat) * 100), 100)
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-xl font-medium text-gray-900">Nutrient Goals</h2>
        </div>
        <div className="p-5 flex justify-center items-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-xl font-medium text-gray-900">Nutrient Goals</h2>
        </div>
        <div className="p-5">
          <p className="text-red-500 text-base">Error loading nutrient data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-xl font-medium text-gray-900">Nutrient Goals</h2>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Total Calories */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-700">Calories</p>
            <p className="text-sm text-gray-500">
              {nutrientData.totalCalories.toLocaleString()} / {goals.calories.toLocaleString()} kcal
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${percentages.calories}%` }}
            ></div>
          </div>
        </div>
        
        {/* Protein */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-700">Protein</p>
            <p className="text-sm text-gray-500">
              {Math.round(nutrientData.totalProtein)}g / {goals.protein}g
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${percentages.protein}%` }}
            ></div>
          </div>
        </div>
        
        {/* Carbs */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-700">Carbs</p>
            <p className="text-sm text-gray-500">
              {Math.round(nutrientData.totalCarbs)}g / {goals.carbs}g
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-purple-500 h-1.5 rounded-full" 
              style={{ width: `${percentages.carbs}%` }}
            ></div>
          </div>
        </div>
        
        {/* Fat */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-700">Fat</p>
            <p className="text-sm text-gray-500">
              {Math.round(nutrientData.totalFat)}g / {goals.fat}g
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-yellow-500 h-1.5 rounded-full" 
              style={{ width: `${percentages.fat}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
