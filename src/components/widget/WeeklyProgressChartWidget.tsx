'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  BarController,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

interface WeeklyProgressChartProps {
  dailyAverage?: number;
  weeklyData?: number[];
  refreshTrigger?: number; // Prop to trigger refresh when food entries change
}

interface WeeklyDataItem {
  date: string;
  calories: number;
  entryCount: number;
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  dailyAverage: propsDailyAverage,
  weeklyData: propsWeeklyData,
  refreshTrigger = 0
}) => {
  // Initialize with default values to ensure chart renders immediately
  const [weeklyData, setWeeklyData] = useState<number[]>([1500, 1850, 1625, 2000, 1750, 1375, 1625]);
  const [dailyAverage, setDailyAverage] = useState<number>(1675);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current date and calculate the dates for the current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Create an array of dates for the current week (Monday to Sunday)
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    // Calculate the date for each day of the week
    const date = new Date(today);
    // Adjust to make Monday (1) the first day of the week
    // If today is Sunday (0), we need to handle it differently
    const dayDiff = dayOfWeek === 0 
      ? i - 6  // For Sunday, show the week ending today
      : i + 1 - dayOfWeek; // For other days, show the current week
    date.setDate(today.getDate() + dayDiff);
    return date;
  });
  
  // Format dates in YYYY-MM-DD format for consistent comparison with API data
  const formattedWeekDates = weekDates.map(date => {
    return date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
  });
  
  // Log the dates we're using for the chart for debugging
  console.log('Chart dates (formatted):', formattedWeekDates);
  
  // Function to check if a date is today
  const isToday = (date: Date): boolean => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Get today's date in YYYY-MM-DD format for comparison
  const todayFormatted = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
  
  // Fetch weekly data from API
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching weekly data from API...');
        const response = await axios.get('/api/food?period=week');
        console.log('API Response:', response.data);
        
        const { weeklyData, dailyAverage, calorieValues } = response.data;
        
        // Check if we have the new calorieValues array directly from the API
        if (calorieValues && Array.isArray(calorieValues) && calorieValues.length === 7) {
          console.log('Using calorieValues from API:', calorieValues);
          setWeeklyData(calorieValues);
          setDailyAverage(dailyAverage || 0);
        }
        // Fallback to extracting from weeklyData if calorieValues is not available
        else if (weeklyData && Array.isArray(weeklyData) && weeklyData.length === 7) {
          console.log('Weekly data received:', weeklyData);
          
          // Log the dates from the API for debugging
          const apiDates = weeklyData.map((item: WeeklyDataItem) => item.date);
          console.log('API dates:', apiDates);
          
          // Extract calorie values from the API response
          const calorieData = weeklyData.map((item: WeeklyDataItem) => item.calories || 0);
          console.log('Calorie data extracted:', calorieData);
          setWeeklyData(calorieData);
          setDailyAverage(dailyAverage || 0);
        } else {
          console.log('No valid weekly data received, using dummy data');
          // If no data, generate dummy data
          generateDummyData();
        }
      } catch (err) {
        console.error('Error fetching weekly data:', err);
        setError('Failed to load weekly data');
        // Fall back to dummy data
        generateDummyData();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Generate random calorie data between 1200-2200 calories
    const generateDummyData = () => {
      const data = Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * (2200 - 1200 + 1) + 1200)
      );
      
      // Calculate average
      const avg = Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);
      
      setWeeklyData(data);
      setDailyAverage(avg);
    };
    
    // Use props data if provided, otherwise fetch from API
    if (propsWeeklyData && propsWeeklyData.length === 7) {
      setWeeklyData(propsWeeklyData);
      setDailyAverage(propsDailyAverage || 1465);
    } else {
      fetchWeeklyData();
    }
  }, [propsWeeklyData, propsDailyAverage, refreshTrigger]); // formattedWeekDates is defined outside useEffect

  // Ensure we have valid data to display
  const displayData = weeklyData.length === 7 ? weeklyData : [1500, 1850, 1625, 2000, 1750, 1375, 1625];

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 2500, // Max daily calorie target
        ticks: {
          stepSize: 500,
          font: {
            size: 10,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10
          }
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw} calories`,
        },
      },
    },
    barPercentage: 0.6,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Weekly Progress</h2>
        <div className="flex">
          <button className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mr-2">Calories</button>
          <button className="text-sm font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-md">Macros</button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-base font-medium">Daily Average: {dailyAverage.toLocaleString()} cal</p>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-sm text-gray-500 mr-3">Calories</span>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-sm text-gray-500 mr-3">Target</span>
          </div>
        </div>
        
        {/* Chart visualization using Chart.js */}
        <div className="h-60 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <Chart
            type='bar'
            data={{
              labels: weekDates.map((date, index) => {
                const day = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index];
                
                // Format this date for comparison
                const dateFormatted = date.getFullYear() + '-' + 
                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(date.getDate()).padStart(2, '0');
                
                // Add a special marker for today's date
                const label = dateFormatted === todayFormatted
                  ? `${day} ( ${date.getDate()}* )` 
                  : `${day} ( ${date.getDate()} )`;
                return label;
              }),
              datasets: [
                {
                  label: 'Calories',
                  data: displayData, // Use actual calorie values
                  backgroundColor: weekDates.map(date => 
                    isToday(date) ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.5)'
                  ),
                  borderColor: 'rgba(59, 130, 246, 0.8)',
                  borderWidth: 1,
                  borderRadius: 4,
                  type: 'bar',
                },
                {
                  label: 'Target',
                  data: Array(7).fill(2000), // Daily target of 2000 calories
                  type: 'line',
                  borderColor: 'rgba(34, 197, 94, 0.7)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                  pointRadius: 0,
                  order: 0,
                }
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressChart;