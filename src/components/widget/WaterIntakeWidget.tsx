'use client';

import React, { useState, useEffect } from 'react';
import { useWaterIntake } from '@/hooks/useWaterIntake';
import WaterEntryModal from '../modal/WaterEntryModal';

export default function WaterIntakeWidget() {
  const { 
    totalMilliliters,
    totalLiters,
    dailyGoalLiters,
    remainingLiters,
    percentComplete,
    isLoading,
    error,
    refreshWaterIntake
  } = useWaterIntake();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waterAmount, setWaterAmount] = useState(200);
  const [isAddingWater, setIsAddingWater] = useState(false);

  // Listen for water-added events from other components (like FloatingActionButton)
  useEffect(() => {
    const handleWaterAdded = () => {
      console.log('Water added event received, refreshing data...');
      refreshWaterIntake();
    };
    
    // Add event listener
    window.addEventListener('water-added', handleWaterAdded);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('water-added', handleWaterAdded);
    };
  }, [refreshWaterIntake]);

  const handleAddWater = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleWaterSubmit = async (waterData: any) => {
    // After successful submission, refresh the water intake data
    setTimeout(() => {
      refreshWaterIntake();
    }, 500); // Small delay to ensure the API has processed the new entry
  };

  const handleIncreaseAmount = () => {
    setWaterAmount(prev => Math.min(prev + 50, 1000));
  };

  const handleDecreaseAmount = () => {
    setWaterAmount(prev => Math.max(prev - 50, 50));
  };

  const handleQuickAdd = async () => {
    try {
      setIsAddingWater(true);
      
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: waterAmount,
          unit: 'ml',
          time: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add water');
      }
      
      // Refresh data after adding water
      refreshWaterIntake();
    } catch (error) {
      console.error('Error adding water:', error);
    } finally {
      setIsAddingWater(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Water Intake</h2>
        <button 
          onClick={handleAddWater}
          className="text-base font-medium text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add
        </button>
      </div>
      
      <div className="p-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-base">
            Error loading water data. Please try again.
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    strokeDasharray="100, 100"
                  />
                  {/* Foreground circle - the progress */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray={`${percentComplete}, 100`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mt-1">{percentComplete}%</p>
                  <p className="text-sm text-gray-500">{totalLiters}/{dailyGoalLiters}L</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Daily Goal</p>
                <p className="text-sm font-medium">{dailyGoalLiters} L</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Consumed</p>
                <p className="text-sm font-medium">{totalLiters} L</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-sm font-medium">{remainingLiters} L</p>
              </div>
            </div>
            
            <p className="text-base font-medium text-center mb-3">Quick Add</p>
            
            <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={handleIncreaseAmount}
                className="bg-blue-50 p-2 rounded text-blue-500 hover:bg-blue-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div 
                className={`col-span-2 bg-gray-50 p-2 rounded text-center text-xs font-medium ${isAddingWater ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-100'}`}
                onClick={!isAddingWater ? handleQuickAdd : undefined}
              >
                {isAddingWater ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-1"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  `${waterAmount} ml`
                )}
              </div>
              <button 
                onClick={handleDecreaseAmount}
                className="bg-blue-50 p-2 rounded text-blue-500 hover:bg-blue-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Water Entry Modal */}
      <WaterEntryModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleWaterSubmit}
      />
    </div>
  );
}
