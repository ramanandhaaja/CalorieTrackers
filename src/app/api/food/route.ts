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
