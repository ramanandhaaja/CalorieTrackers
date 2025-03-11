'use client';

import React, { useState, useEffect } from 'react';
import FoodEntryModal, { FoodData } from '../modal/FoodEntryModal';
import WaterEntryModal, { WaterData } from '../modal/WaterEntryModal';

export default function FloatingActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalType, setModalType] = useState<'food' | 'water' | 'photo' | null>(null);
  const [animatedButtons, setAnimatedButtons] = useState<boolean[]>([false, false, false]);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenModal = (type: 'food' | 'water' | 'photo') => {
    setModalType(type);
    setIsModalOpen(true);
    setIsExpanded(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitFood = (foodData: FoodData) => {
    try {
      // The FoodEntryModal already sends the data to the backend,
      // so we only need to dispatch the event here
      console.log('Food data received from modal:', foodData);
      
      // Dispatch a custom event to notify other components
      const foodAddedEvent = new CustomEvent('food-added');
      window.dispatchEvent(foodAddedEvent);
    } catch (error) {
      console.error('Error handling food data:', error);
    }
  };
  
  const handleSubmitWater = async (waterData: WaterData) => {
    try {
      // Send the data to the backend
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waterData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add water');
      }
      
      console.log('Water data submitted successfully:', waterData);
      
      // Dispatch a custom event to notify other components
      const waterAddedEvent = new CustomEvent('water-added');
      window.dispatchEvent(waterAddedEvent);
    } catch (error) {
      console.error('Error submitting water data:', error);
    }
  };

  const toggleExpand = () => {
    if (isExpanded) {
      // Start closing animation
      setIsClosing(true);
      
      // Stagger the closing animations in reverse order
      setTimeout(() => setAnimatedButtons([true, true, false]), 50);
      setTimeout(() => setAnimatedButtons([true, false, false]), 100);
      setTimeout(() => setAnimatedButtons([false, false, false]), 150);
      
      // Actually close after animations complete
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, 300);
    } else {
      // Open immediately
      setIsExpanded(true);
      setIsClosing(false);
      
      // Reset animations when opening
      setAnimatedButtons([false, false, false]);
      
      // Stagger the opening animations
      setTimeout(() => setAnimatedButtons([true, false, false]), 50);
      setTimeout(() => setAnimatedButtons([true, true, false]), 150);
      setTimeout(() => setAnimatedButtons([true, true, true]), 250);
    }
  };

  return (
    <>
      {/* Main floating action button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end space-y-reverse space-y-3">
        {/* Secondary buttons with animations */}
        <div className="flex flex-col-reverse items-end space-y-reverse space-y-3">
          {(isExpanded || isClosing) && (
            <>
              <div 
                className={`transition-all duration-300 ease-out transform ${animatedButtons[0] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              >
                <button
                  onClick={() => handleOpenModal('photo')}
                  className="h-12 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 px-4"
                  aria-label="Take Photo"
                >
                  <span className="mr-2 font-medium">Take Photo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div 
                className={`transition-all duration-300 ease-out transform ${animatedButtons[1] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              >
                <button
                  onClick={() => handleOpenModal('water')}
                  className="h-12 rounded-full bg-cyan-500 text-white shadow-lg flex items-center justify-center hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 px-4"
                  aria-label="Add Water"
                >
                  <span className="mr-2 font-medium">Add Water</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div 
                className={`transition-all duration-300 ease-out transform ${animatedButtons[2] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              >
                <button
                  onClick={() => handleOpenModal('food')}
                  className="h-12 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 px-4"
                  aria-label="Add Food"
                >
                  <span className="mr-2 font-medium">Add Food</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Main button with animation */}
        <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
          <button
            onClick={toggleExpand}
            className={`h-14 w-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isExpanded ? 'shadow-xl' : 'shadow-lg'}`}
            aria-label="Toggle options"
            style={{
              transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ 
                transform: isExpanded ? 'rotate(45deg)' : 'rotate(0)', 
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
              }}
              className="h-6 w-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </button>
        </div>
      </div>

      <FoodEntryModal
        isOpen={isModalOpen && modalType === 'food'}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFood}
      />
      
      <WaterEntryModal
        isOpen={isModalOpen && modalType === 'water'}
        onClose={handleCloseModal}
        onSubmit={handleSubmitWater}
      />
      
      {/* TODO: Implement Photo modal */}
      {/* For now, photo button will use the food modal */}
    </>
  );
}
