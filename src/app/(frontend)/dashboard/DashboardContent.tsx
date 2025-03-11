'use client';

import React, { useState } from 'react';
import FoodEntriesWidget from '@/components/widget/FoodEntriesWidget';
import WeeklyProgressChart from '@/components/widget/WeeklyProgressChartWidget';

export default function DashboardContent() {
  // State to track when food entries are updated
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the weekly chart
  const handleFoodEntriesUpdated = () => {
    // Increment the refresh trigger to cause the WeeklyProgressChart to refetch data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="lg:col-span-2 space-y-5">
      {/* Today's Meals Card */}
      <FoodEntriesWidget onFoodEntriesUpdated={handleFoodEntriesUpdated} />
      
      {/* Weekly Progress Chart Card */}
      <WeeklyProgressChart refreshTrigger={refreshTrigger} />
    </div>
  );
}
