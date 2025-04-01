import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import config from '@/payload.config';
import { getTodayDateRange } from '@/lib/date-utils';

export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    await payload.init({ config: await config });
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Get the user ID from query params
    const searchParams = req.nextUrl.searchParams;
    const requestedUserId = searchParams.get('userId');
    
    if (!requestedUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get today's date range
    const { startOfDay, endOfDay } = getTodayDateRange();

    // Get food entries for today
    const foodEntries = await payload.find({
      collection: 'food-entries',
      where: {
        user: {
          equals: requestedUserId
        },
        date: {
          greater_than_equal: startOfDay,
          less_than_equal: endOfDay
        }
      },
      sort: '-date'
    });

    if (!foodEntries.docs) {
      return NextResponse.json(
        { error: 'No food entries found' },
        { status: 404 }
      );
    }

    // Calculate total macros for the day
    const totalMacros = foodEntries.docs.reduce((acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein: acc.protein + (entry.protein || 0),
      carbs: acc.carbs + (entry.carbs || 0),
      fat: acc.fat + (entry.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return NextResponse.json({
      entries: foodEntries.docs,
      totalMacros,
      totalCount: foodEntries.totalDocs
    });
  } catch (error) {
    console.error('Error fetching food entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Payload
    await payload.init({ config: await config });
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.portion || body.calories === undefined || 
        body.protein === undefined || body.carbs === undefined || 
        body.fat === undefined || !body.mealType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the user ID from query params
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create the food entry
    const foodEntry = await payload.create({
      collection: 'food-entries',
      data: {
        name: body.name,
        portion: body.portion,
        calories: Number(body.calories),
        protein: Number(body.protein),
        carbs: Number(body.carbs),
        fat: Number(body.fat),
        mealType: body.mealType,
        date: body.date || new Date().toISOString(),
        user: Number(userId) // Pass user ID directly as a number
      },
    });
    
    return NextResponse.json(foodEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating food entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
