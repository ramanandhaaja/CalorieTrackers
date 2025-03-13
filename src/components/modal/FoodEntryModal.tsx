import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

type FoodEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (foodData: FoodData) => void;
  initialFoodData?: FoodData & { id?: string };
};

export type FoodData = {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  id?: string;
};

const initialFoodData: FoodData = {
  name: '',
  portion: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  mealType: 'breakfast',
};

export default function FoodEntryModal({ isOpen, onClose, onSubmit, initialFoodData }: FoodEntryModalProps) {
  const defaultFoodData = useMemo<FoodData>(() => ({
    name: '',
    portion: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealType: 'breakfast'
  }), []);

  const [foodData, setFoodData] = useState<FoodData>(initialFoodData || defaultFoodData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('manual');
  const [showAiForm, setShowAiForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes or when initialFoodData changes
  useEffect(() => {
    if (isOpen) {
      if (initialFoodData) {
        setFoodData(initialFoodData);
        setIsEditing(true);
      } else {
        setFoodData(defaultFoodData);
        setIsEditing(false);
      }
      setAiPrompt('');
      setActiveTab('manual');
      setShowAiForm(false);
    }
  }, [isOpen, initialFoodData, defaultFoodData]);

  // Daily calorie goal - could be made configurable in the future
  const DAILY_CALORIE_GOAL = 2000;

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['calories', 'protein', 'carbs', 'fat'].includes(name)) {
      setFoodData({ ...foodData, [name]: parseFloat(value) || 0 });
    } else {
      setFoodData({ ...foodData, [name]: value });
    }
  };

  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const handleAskAiClick = () => {
    setActiveTab('ai');
    setShowAiForm(true);
  };

  const handleTakePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setIsAnalyzingPhoto(true);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('foodImage', file);
      
      toast.info('Analyzing your food photo...');
      
      // Upload and analyze the image
      const response = await fetch('/api/ai/nutrition/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze food image');
      }
      
      // Get the AI-generated description and nutritional data
      const data = await response.json();
      
      // Switch to manual tab to show the filled form
      setActiveTab('manual');
      setShowAiForm(false);
      
      // If nutritional data is available, update the form
      if (data.nutritionData) {
        setFoodData(data.nutritionData);
        toast.success('Food analyzed! Please review and edit if needed.');
      } else {
        toast.error('Could not extract nutritional data from the image');
      }
    } catch (error) {
      console.error('Error analyzing food photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze your food photo');
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description of your meal');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the AI nutrition analysis API
      toast.info('Processing your meal description...');
      
      const response = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealDescription: aiPrompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze meal');
      }
      
      // Get the AI-generated nutritional data
      const nutritionData = await response.json();
      
      // Update the form with the AI-generated data
      setFoodData(nutritionData);
      
      // Switch to manual tab to let user review and edit
      setActiveTab('manual');
      
      toast.success('Meal analyzed! Please review and edit if needed.');
    } catch (error) {
      console.error('Error processing AI prompt:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze your meal description');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Make API call to create or update food entry
      const url = '/api/food';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} food entry`);
      }
      
      // Show success toast
      toast.success(`Food entry ${isEditing ? 'updated' : 'added'} successfully`);
      
      // Call onSubmit callback
      onSubmit(foodData);
      
      // Close modal
      onClose();
      
      // Reset form
      setFoodData(defaultFoodData);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('food-added'));
    } catch (error) {
      console.error('Error submitting food entry:', error);
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} food entry`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center bg-green-50">
          <h2 className="text-lg font-medium text-gray-900">{isEditing ? 'Edit Food' : 'Add Food'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-5 pt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual" className="text-sm">Manual Entry</TabsTrigger>
              <TabsTrigger value="ai" className="text-sm">AI Assistant</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="manual" className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={foodData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <Button 
                    type="button" 
                    onClick={handleAskAiClick}
                    variant="outline"
                    className="whitespace-nowrap flex items-center space-x-1 h-[42px] px-3 text-sm border border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                      <path d="M12 8V4m0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                      <path d="M12 16v4"></path>
                      <path d="M4 12H2"></path>
                      <path d="M10 2l-2 2"></path>
                      <path d="M14 2l2 2"></path>
                      <path d="M20 12h2"></path>
                      <path d="M10 22l-2-2"></path>
                      <path d="M14 22l2-2"></path>
                    </svg>
                    Ask AI
                  </Button>
                </div>
              </div>
              
              <div>
                <label htmlFor="portion" className="block text-sm font-medium text-gray-700 mb-1">
                  Portion Size
                </label>
                <input
                  type="text"
                  id="portion"
                  name="portion"
                  value={foodData.portion}
                  onChange={handleChange}
                  placeholder="e.g., 1 cup (250g)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={foodData.calories || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    id="mealType"
                    name="mealType"
                    value={foodData.mealType}
                    onChange={handleChange}
                    className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={foodData.protein || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={foodData.carbs || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={foodData.fat || ''}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              
              {/* Summary display */}
              <div className="bg-green-50 p-3 rounded-md mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Total calories:</span>
                  <span className="text-lg font-semibold text-green-900">{foodData.calories} kcal</span>
                </div>
                <div className="mt-1 h-3 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, (foodData.calories / DAILY_CALORIE_GOAL) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Daily goal: {DAILY_CALORIE_GOAL} kcal
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3">
                <Button 
                  type="button" 
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : isEditing ? 'Update Food' : 'Add Food'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="ai" className="px-5 pb-5">
            {showAiForm ? (
              <form onSubmit={handleAiSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700">
                      Describe your meal
                    </label>
                    <button
                      type="button"
                      onClick={handleTakePhotoClick}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      disabled={isAnalyzingPhoto}
                    >
                      {isAnalyzingPhoto ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Take Photo
                        </>
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <textarea
                    id="aiPrompt"
                    value={aiPrompt}
                    onChange={handleAiPromptChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[120px]"
                    placeholder="Describe what you ate in detail. For example: 'I had a grilled chicken sandwich with lettuce, tomato, and mayo on whole wheat bread with a side of french fries and a diet coke.'"
                    required
                  />
                </div>
                
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">How it works:</span> Our AI will analyze your meal description and estimate the nutritional information. You can then review and adjust the details before adding it to your log.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-3">
                  <Button 
                    type="button" 
                    onClick={() => setShowAiForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Analyzing...' : 'Analyze Meal'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600">
                      <path d="M12 8V4m0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                      <path d="M12 16v4"></path>
                      <path d="M4 12H2"></path>
                      <path d="M10 2l-2 2"></path>
                      <path d="M14 2l2 2"></path>
                      <path d="M20 12h2"></path>
                      <path d="M10 22l-2-2"></path>
                      <path d="M14 22l2-2"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Let AI analyze your meal</h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Simply describe what you ate, and our AI will estimate the nutritional information for your meal.
                  </p>
                </div>
                <Button onClick={() => setShowAiForm(true)}>
                  Get Started
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
