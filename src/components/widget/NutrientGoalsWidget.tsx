'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NutrientData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface UserGoals {
  dailyCalorieTarget: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

interface NutrientGoalsWidgetProps {
  refreshTrigger?: number;
  userGoals?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export default function NutrientGoalsWidget({ refreshTrigger = 0, userGoals }: NutrientGoalsWidgetProps) {
  const [nutrientData, setNutrientData] = useState<NutrientData>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  const [goals, setGoals] = useState({
    calories: userGoals?.calories || 2200,
    protein: userGoals?.protein || 120,
    carbs: userGoals?.carbs || 200,
    fat: userGoals?.fat || 65
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user goals from the API
  const fetchUserGoals = async () => {
    try {
      const response = await fetch('/api/user-details');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user goals');
      }
      
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        const userDetails = data.docs[0];
        setGoals({
          calories: userDetails.dailyCalorieTarget || 2200,
          protein: userDetails.dailyProtein || 120,
          carbs: userDetails.dailyCarbs || 200,
          fat: userDetails.dailyFat || 65
        });
      }
    } catch (err) {
      console.error('Error fetching user goals:', err);
      // Fall back to default goals or provided userGoals
    }
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

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserGoals();
      await fetchNutrientData();
    };
    
    fetchData();
  }, [refreshTrigger]);

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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Nutrient Goals</h2>
            <div className="w-24 h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900">Nutrient Goals</h2>
          <Link href="/dashboard/settings" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Change Goals
          </Link>
        </div>
        
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
