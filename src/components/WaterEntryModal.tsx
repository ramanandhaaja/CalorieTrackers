import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

type WaterEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (waterData: WaterData) => void;
};

export type WaterData = {
  amount: number;
  unit: 'ml' | 'oz' | 'cup';
  time: string;
};

const initialWaterData: WaterData = {
  amount: 250,
  unit: 'ml',
  time: new Date().toISOString().substring(0, 16), // Format: YYYY-MM-DDThh:mm
};

// Conversion factors to ml
const CONVERSION_FACTORS = {
  ml: 1,
  oz: 29.5735,
  cup: 236.588,
};

export default function WaterEntryModal({ isOpen, onClose, onSubmit }: WaterEntryModalProps) {
  const [waterData, setWaterData] = useState<WaterData>(initialWaterData);
  const [presetSelected, setPresetSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setWaterData({ ...waterData, [name]: parseFloat(value) || 0 });
      setPresetSelected(null); // Clear preset selection when manually changing amount
    } else {
      setWaterData({ ...waterData, [name]: value });
    }
  };

  const handlePresetClick = (amount: number, unit: 'ml' | 'oz' | 'cup') => {
    setWaterData({ ...waterData, amount, unit });
    setPresetSelected(`${amount}${unit}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the API endpoint using direct transaction
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waterData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add water entry');
      }
      
      const result = await response.json();
      
      // Call the onSubmit prop with the result
      onSubmit(waterData);
      toast.success('Water entry added successfully!');
      
      // Reset form
      setWaterData(initialWaterData);
      setPresetSelected(null);
      onClose();
    } catch (error) {
      console.error('Error adding water entry:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add water entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total ml for display
  const totalMl = Math.round(waterData.amount * CONVERSION_FACTORS[waterData.unit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center bg-cyan-50">
          <h2 className="text-lg font-medium text-cyan-900">Add Water</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Add
            </label>
            <div className="flex flex-wrap gap-2">
              <button 
                type="button"
                onClick={() => handlePresetClick(250, 'ml')}
                className={`px-3 py-2 rounded-full text-sm ${presetSelected === '250ml' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-800'} hover:bg-cyan-200 transition-colors`}
              >
                Glass (250ml)
              </button>
              <button 
                type="button"
                onClick={() => handlePresetClick(500, 'ml')}
                className={`px-3 py-2 rounded-full text-sm ${presetSelected === '500ml' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-800'} hover:bg-cyan-200 transition-colors`}
              >
                Bottle (500ml)
              </button>
              <button 
                type="button"
                onClick={() => handlePresetClick(8, 'oz')}
                className={`px-3 py-2 rounded-full text-sm ${presetSelected === '8oz' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-800'} hover:bg-cyan-200 transition-colors`}
              >
                8 oz
              </button>
              <button 
                type="button"
                onClick={() => handlePresetClick(1, 'cup')}
                className={`px-3 py-2 rounded-full text-sm ${presetSelected === '1cup' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-800'} hover:bg-cyan-200 transition-colors`}
              >
                1 cup
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={waterData.amount || ''}
                onChange={handleChange}
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={waterData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              >
                <option value="ml">Milliliters (ml)</option>
                <option value="oz">Fluid Ounces (oz)</option>
                <option value="cup">Cups</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="datetime-local"
              id="time"
              name="time"
              value={waterData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>
          
          {/* Summary display */}
          <div className="bg-cyan-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cyan-800">Total water:</span>
              <span className="text-lg font-semibold text-cyan-900">{totalMl} ml</span>
            </div>
            <div className="mt-1 h-3 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (totalMl / 2500) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-cyan-700 mt-1">
              Daily goal: 2500 ml
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline"
              className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Water'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
