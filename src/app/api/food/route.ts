import { getPayload } from 'payload';
import { NextRequest, NextResponse } from 'next/server';
import type { FoodEntry } from '../../../payload-types';
import config from '@/payload.config';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDateRange, getWeekDateRange, getDateRange, groupEntriesByDate } from '@/lib/date-utils';

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
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Log the received date for debugging
    console.log('Received date from client:', body.date);
    
    // Use the provided date or create a new date in the user's timezone
    const entryDate = body.date || new Date().toISOString();
    console.log('Using date for food entry:', entryDate);
    
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
        date: entryDate,
        user: user.id, // Use the authenticated user's ID
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

// PUT handler to update a food entry
export async function PUT(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const body = await req.json();
    
    // Validate required fields
    if (!body.id || !body.name || !body.portion || body.calories === undefined || 
        body.protein === undefined || body.carbs === undefined || body.fat === undefined || 
        !body.mealType) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, portion, calories, protein, carbs, fat, and mealType are required' },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Update the food entry
    const updatedFoodEntry = await payload.update({
      collection: 'food-entries',
      id: body.id,
      data: {
        name: body.name,
        portion: body.portion,
        calories: Number(body.calories),
        protein: Number(body.protein),
        carbs: Number(body.carbs),
        fat: Number(body.fat),
        mealType: body.mealType,
        // Don't update the date or user fields
      },
    });
    
    return NextResponse.json(updatedFoodEntry, { status: 200 });
  } catch (error) {
    console.error('Error updating food entry:', error);
    return NextResponse.json(
      { error: `Error updating food entry: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}

// DELETE handler to delete a food entry
export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Delete the food entry
    const deletedFoodEntry = await payload.delete({
      collection: 'food-entries',
      id: Number(id), // Convert string ID to number
    });
    
    return NextResponse.json({ success: true, deletedEntry: deletedFoodEntry }, { status: 200 });
  } catch (error) {
    console.error('Error deleting food entry:', error);
    return NextResponse.json(
      { error: `Error deleting food entry: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}

// GET handler to fetch food entries
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || 'today';
    const period = url.searchParams.get('period');
    
    // If period is 'historical', use the historical data handler
    if (period === 'historical') {
      return getHistoricalData(req);
    }
    
    // If period is 'week', use the weekly data handler
    if (period === 'week') {
      return getWeeklyData(req);
    }
    
    let dateQuery: any = {};
    
    if (timeframe === 'today') {
      const { startOfDay, endOfDay } = getTodayDateRange();
      console.log('Fetching food entries for today:', { startOfDay, endOfDay });
      dateQuery = {
        date: {
          greater_than_equal: startOfDay,
          less_than_equal: endOfDay
        }
      };
    } else if (timeframe === 'week') {
      const { startOfWeek, endOfWeek } = getWeekDateRange();
      console.log('Fetching food entries for week:', { startOfWeek, endOfWeek });
      dateQuery = {
        date: {
          greater_than_equal: startOfWeek,
          less_than_equal: endOfWeek
        }
      };
    }
    
    // Fetch food entries for the user
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        user: {
          equals: user.id
        },
        ...dateQuery
      },
      sort: '-date', // Sort by date in descending order
    });
    
    // Process the food entries to calculate totals and group by meal type
    const entries = foodEntries.docs;
    
    // Calculate total calories and macros
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Group entries by meal type
    const mealGroups: { [key: string]: any[] } = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };
    
    // Calculate meal totals
    const mealTotals: { [key: string]: number } = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };
    
    // Process each entry
    entries.forEach(entry => {
      // Add to total calories and macros
      totalCalories += entry.calories || 0;
      totalProtein += entry.protein || 0;
      totalCarbs += entry.carbs || 0;
      totalFat += entry.fat || 0;
      
      // Add to meal group
      if (entry.mealType && mealGroups[entry.mealType]) {
        mealGroups[entry.mealType].push(entry);
        mealTotals[entry.mealType] += entry.calories || 0;
      }
    });
    
    // Return the response in the expected format
    return NextResponse.json({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealGroups,
      mealTotals,
      entries,
      // Add totals property to match the expected structure in the dashboard
      totals: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      }
    });
  } catch (error) {
    console.error('Error fetching food entries:', error);
    return NextResponse.json(
      { error: `Error fetching food entries: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}

// Handler for fetching weekly food data
async function getWeeklyData(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    
    // Get date range for the current week
    const { startOfWeek, endOfWeek } = getWeekDateRange();
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Query food entries for the week
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        and: [
          {
            user: {
              equals: user.id
            }
          },
          {
            date: {
              greater_than_equal: startOfWeek,
              less_than_equal: endOfWeek
            }
          }
        ]
      },
      sort: 'date',
      depth: 0, // Don't populate references
    });
    
    // Group by day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyData: Record<string, {
      totalMacros: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      entries: FoodEntry[];
    }> = {};
    
    // Initialize daily data structure
    days.forEach(day => {
      dailyData[day] = {
        totalMacros: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        entries: []
      };
    });
    
    // Process each food entry
    foodEntries.docs.forEach((entry: FoodEntry) => {
      const entryDate = new Date(entry.date);
      const dayOfWeek = days[entryDate.getDay()];
      
      // Add entry to the appropriate day
      dailyData[dayOfWeek].entries.push(entry);
      
      // Add to daily totals
      dailyData[dayOfWeek].totalMacros.calories += entry.calories || 0;
      dailyData[dayOfWeek].totalMacros.protein += entry.protein || 0;
      dailyData[dayOfWeek].totalMacros.carbs += entry.carbs || 0;
      dailyData[dayOfWeek].totalMacros.fat += entry.fat || 0;
    });
    
    // Calculate weekly totals
    const weeklyTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    Object.values(dailyData).forEach((day: any) => {
      weeklyTotals.calories += day.totalMacros.calories;
      weeklyTotals.protein += day.totalMacros.protein;
      weeklyTotals.carbs += day.totalMacros.carbs;
      weeklyTotals.fat += day.totalMacros.fat;
    });
    
    // Format data for the WeeklyProgressChartWidget
    // Reorder days to match chart display (starting from Monday)
    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Create the weeklyData array in the format expected by the component
    const weeklyData = orderedDays.map(day => ({
      date: day,
      calories: dailyData[day].totalMacros.calories,
      entryCount: dailyData[day].entries.length
    }));
    
    // Calculate daily average calories
    const dailyAverage = Math.round(weeklyTotals.calories / 7);
    
    // Create the calorieValues array (just the calorie values in order)
    const calorieValues = orderedDays.map(day => dailyData[day].totalMacros.calories);
    
    return NextResponse.json({
      weeklyTotals,
      dailyData,
      weeklyData,
      dailyAverage,
      calorieValues
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weekly food data:', error);
    return NextResponse.json(
      { error: `Error fetching weekly food data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}

// Handler for fetching historical food data
async function getHistoricalData(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    const { searchParams } = new URL(req.url);
    
    // Parse date range from query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const mealType = searchParams.get('mealType');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Create where clause for the query
    const whereClause: any = {
      and: [
        {
          user: {
            equals: (await getCurrentUser())?.id
          }
        }
      ]
    };
    
    // Add date range if provided
    if (startDate && endDate) {
      whereClause.and.push({
        date: {
          greater_than_equal: new Date(startDate).toISOString(),
          less_than_equal: new Date(endDate + 'T23:59:59.999Z').toISOString()
        }
      });
    }
    
    // Add meal type filter if provided
    if (mealType && mealType !== 'all') {
      whereClause.and.push({
        mealType: {
          equals: mealType
        }
      });
    }
    
    // If no user is authenticated, return an error
    if (!(await getCurrentUser())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Query food entries for the specified filters
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: whereClause,
      sort: '-date', // Sort by date descending (newest first)
      page,
      limit,
      depth: 0, // Don't populate references
    });
    
    // Group by date - using the full ISO string to preserve timezone information
    const entriesByDate: Record<string, FoodEntry[]> = {};
    
    // Process each food entry
    foodEntries.docs.forEach((entry: FoodEntry) => {
      // Extract just the date part (YYYY-MM-DD) for grouping
      const date = new Date(entry.date);
      const dateStr = date.toISOString().split('T')[0];
      
      // Initialize date group if it doesn't exist
      if (!entriesByDate[dateStr]) {
        entriesByDate[dateStr] = [];
      }
      
      // Add entry to the date group
      entriesByDate[dateStr].push(entry);
    });
    
    // Calculate overall totals
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    foodEntries.docs.forEach((entry: FoodEntry) => {
      totals.calories += entry.calories || 0;
      totals.protein += entry.protein || 0;
      totals.carbs += entry.carbs || 0;
      totals.fat += entry.fat || 0;
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
        hasNextPage: foodEntries.hasNextPage
      },
      totals
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching historical food data:', error);
    return NextResponse.json(
      { error: `Error fetching historical food data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 400 }
    );
  }
}
