import { getPayload } from 'payload';
import { NextRequest, NextResponse } from 'next/server';
import type { FoodEntry } from '../../../payload-types';
import config from '@/payload.config';

// Helper function to get the start and end of today
function getTodayDateRange() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  return {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString()
  };
}

// Helper function to get the start and end of the current week (Monday to Sunday)
function getWeekDateRange() {
  // Get current date without time
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = today.getDay();
  
  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(today);
  // If today is Sunday (0), go back 6 days to get to Monday
  // Otherwise, go back (dayOfWeek - 1) days
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - daysToSubtract);
  
  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  console.log(`Week date range: ${startOfWeek.toISOString()} to ${endOfWeek.toISOString()}`);
  
  return {
    startOfWeek: startOfWeek.toISOString(),
    endOfWeek: endOfWeek.toISOString()
  };
}

// This is a Next.js App Router API route
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.portion || !body.calories === undefined || 
        !body.protein === undefined || !body.carbs === undefined || !body.fat === undefined || 
        !body.mealType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, portion, calories, protein, carbs, fat, and mealType are required' },
        { status: 400 }
      );
    }
    
    // For now, we'll use a mock user ID for testing
    // In production, you would implement proper authentication
    const mockUserId = 1; // Replace with a valid user ID from your database
    
    // Create the food entry
    const foodEntry = await payload.create({
      collection: 'food-entries', // This matches the slug in Food.ts
      data: {
        name: body.name,
        portion: body.portion,
        calories: Number(body.calories),
        protein: Number(body.protein),
        carbs: Number(body.carbs),
        fat: Number(body.fat),
        mealType: body.mealType,
        date: body.date || new Date().toISOString(),
        user: mockUserId, // Use a valid user ID from your database
        // The totalMacros will be calculated by the collection hooks
      },
    });
    
    return NextResponse.json(foodEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating food entry:', error);
    return NextResponse.json(
      { error: `Error creating food entry: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}

// GET handler to fetch food entries for today
export async function GET(req: NextRequest) {
  // Check if we're requesting weekly data or historical data
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period');
  
  if (period === 'week') {
    return getWeeklyData(req);
  } else if (period === 'historical') {
    return getHistoricalData(req);
  }
  
  // Default to daily data
  try {
    const payload = await getPayload({ config: await config });
    
    // Get date range for today
    const { startOfDay, endOfDay } = getTodayDateRange();
    
    // For now, we'll use a mock user ID for testing
    // In production, you would get this from authentication
    const mockUserId = 1;
    
    // Query food entries for today grouped by meal type
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        and: [
          {
            user: {
              equals: mockUserId
            }
          },
          {
            date: {
              greater_than_equal: startOfDay
            }
          },
          {
            date: {
              less_than_equal: endOfDay
            }
          }
        ]
      },
      sort: 'date',
      limit: 100, // Reasonable limit for a day's entries
    });
    
    // Group entries by meal type
    const mealGroups: {
      breakfast: FoodEntry[],
      lunch: FoodEntry[],
      dinner: FoodEntry[],
      snack: FoodEntry[]
    } = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Process and group entries
    foodEntries.docs.forEach(entry => {
      const mealType = entry.mealType as keyof typeof mealGroups;
      if (mealGroups[mealType]) {
        mealGroups[mealType].push(entry);
      }
      
      // Add to daily totals
      totalCalories += entry.calories as number;
      totalProtein += entry.protein as number;
      totalCarbs += entry.carbs as number;
      totalFat += entry.fat as number;
    });
    
    // Calculate meal type totals
    const mealTotals = {
      breakfast: mealGroups.breakfast.reduce((sum, entry) => sum + (entry.calories as number), 0),
      lunch: mealGroups.lunch.reduce((sum, entry) => sum + (entry.calories as number), 0),
      dinner: mealGroups.dinner.reduce((sum, entry) => sum + (entry.calories as number), 0),
      snack: mealGroups.snack.reduce((sum, entry) => sum + (entry.calories as number), 0)
    };
    
    return NextResponse.json({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealGroups,
      mealTotals,
      entries: foodEntries.docs
    });
  } catch (error) {
    console.error('Error fetching food entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food entries', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Handler for fetching weekly food data
async function getWeeklyData(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    
    // Get date range for the current week (Monday to Sunday)
    const { startOfWeek, endOfWeek } = getWeekDateRange();
    console.log(`Using week range: ${startOfWeek} to ${endOfWeek}`);
    
    // For now, we'll use a mock user ID for testing
    // In production, you would get this from authentication
    const mockUserId = 1;
    
    // Query food entries for the past week
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        and: [
          {
            user: {
              equals: mockUserId
            }
          },
          {
            date: {
              greater_than_equal: startOfWeek
            }
          },
          {
            date: {
              less_than_equal: endOfWeek
            }
          }
        ]
      },
      sort: 'date',
      limit: 500, // Reasonable limit for a week's entries
    });
    
    // Group entries by day and calculate daily totals
    const dailyData: Record<string, { date: Date, calories: number, entries: FoodEntry[] }> = {};
    
    // Parse the start date from startOfWeek
    const startDate = new Date(startOfWeek);
    console.log('Start date of week:', startDate);
    
    // Create data for each day of the current week (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      // Clone the start date and add i days to get each day of the week
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Format date string in local timezone (YYYY-MM-DD)
      const dateString = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0');
      
      dailyData[dateString] = {
        date: new Date(date),
        calories: 0,
        entries: []
      };
    }
    
    // Process entries and group by day
    foodEntries.docs.forEach(entry => {
      // Parse the date from the entry and handle timezone correctly
      const entryDate = new Date(entry.date as string);
      
      // Format date string in local timezone (YYYY-MM-DD)
      const dateString = entryDate.getFullYear() + '-' + 
        String(entryDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(entryDate.getDate()).padStart(2, '0');
      
      console.log(`Entry date: ${entry.date}, parsed as: ${entryDate}, dateString: ${dateString}`);
      
      if (dailyData[dateString]) {
        dailyData[dateString].entries.push(entry);
        dailyData[dateString].calories += entry.calories as number;
      } else {
        console.log(`No matching date bucket for entry date: ${dateString}`);
      }
    });
    
    // Convert to array and keep the order (Monday to Sunday)
    // We don't need to sort since we created the data in the correct order
    const weeklyData = Object.values(dailyData);
    
    // Calculate weekly average
    const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const dailyAverage = Math.round(totalCalories / weeklyData.length);
    
    // Log what we're returning for debugging
    console.log('Weekly data being returned:', weeklyData);
    console.log('Daily average:', dailyAverage);
    
    // Format the data for the chart
    const formattedData = weeklyData.map(day => {
      // Format date in a consistent way for the frontend
      const formattedDate = day.date.getFullYear() + '-' + 
        String(day.date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(day.date.getDate()).padStart(2, '0');
      
      return {
        date: formattedDate,
        calories: day.calories,
        entryCount: day.entries.length
      };
    });
    
    return NextResponse.json({
      weeklyData: formattedData,
      dailyAverage,
      totalCalories,
      // Also include raw calorie values as an array for easier chart consumption
      calorieValues: weeklyData.map(day => day.calories)
    });
  } catch (error) {
    console.error('Error fetching weekly food data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly food data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Handler for fetching historical food data
async function getHistoricalData(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const { searchParams } = new URL(req.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Get date range parameters if provided
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Get meal type filter if provided
    const mealType = searchParams.get('mealType');
    
    // For now, we'll use a mock user ID for testing
    // In production, you would get this from authentication
    const mockUserId = 1;
    
    // Build the query conditions
    const whereConditions: any[] = [
      {
        user: {
          equals: mockUserId
        }
      }
    ];
    
    // Add date range conditions if provided
    if (startDate) {
      whereConditions.push({
        date: {
          greater_than_equal: new Date(startDate).toISOString()
        }
      });
    }
    
    if (endDate) {
      whereConditions.push({
        date: {
          less_than_equal: new Date(endDate).toISOString()
        }
      });
    }
    
    // Add meal type condition if provided
    if (mealType) {
      whereConditions.push({
        mealType: {
          equals: mealType
        }
      });
    }
    
    // Query food entries with pagination and filters
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        and: whereConditions
      },
      sort: '-date', // Sort by date descending (newest first)
      limit,
      page,
    });
    
    // Calculate totals for the returned entries
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    foodEntries.docs.forEach(entry => {
      totalCalories += entry.calories as number;
      totalProtein += entry.protein as number;
      totalCarbs += entry.carbs as number;
      totalFat += entry.fat as number;
    });
    
    // Group entries by date
    const entriesByDate: Record<string, FoodEntry[]> = {};
    
    foodEntries.docs.forEach(entry => {
      const entryDate = new Date(entry.date as string);
      const dateString = entryDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!entriesByDate[dateString]) {
        entriesByDate[dateString] = [];
      }
      
      entriesByDate[dateString].push(entry);
    });
    
    return NextResponse.json({
      entries: foodEntries.docs,
      entriesByDate,
      pagination: {
        totalDocs: foodEntries.totalDocs,
        totalPages: foodEntries.totalPages,
        page: foodEntries.page,
        prevPage: foodEntries.prevPage,
        nextPage: foodEntries.nextPage,
        hasPrevPage: foodEntries.hasPrevPage,
        hasNextPage: foodEntries.hasNextPage,
      },
      totals: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      }
    });
  } catch (error) {
    console.error('Error fetching historical food data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical food data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
