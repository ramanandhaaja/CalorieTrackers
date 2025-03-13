'use client';

import React, { useState, useEffect } from 'react';
import NutrientGoalsWidget from './NutrientGoalsWidget';

// This is a client component wrapper that manages the refresh state
// for the NutrientGoalsWidget
export default function NutrientGoalsWidgetWrapper() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Subscribe to food entry updates
  useEffect(() => {
    // Create a custom event listener for food entry updates
    const handleFoodEntryUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    // Add event listener
    window.addEventListener('food-entries-updated', handleFoodEntryUpdate);

    // Clean up
    return () => {
      window.removeEventListener('food-entries-updated', handleFoodEntryUpdate);
    };
  }, []);

  return <NutrientGoalsWidget refreshTrigger={refreshTrigger} />;
}
