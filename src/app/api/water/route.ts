import { getPayload } from 'payload';
import { NextRequest, NextResponse } from 'next/server';
import type { WaterEntry } from '../../../payload-types';
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
    if (!body.amount || !body.unit) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and unit are required' },
        { status: 400 }
      );
    }
    
    // For now, we'll use a mock user ID for testing
    // In production, you would implement proper authentication
    // Using a numeric ID as required by the WaterEntry interface
    const mockUserId = 1; // Replace with a valid user ID from your database
    
    const amount = Number(body.amount);
    const unit = body.unit || 'ml';
    
    // Calculate totalMilliliters based on unit conversion
    const CONVERSION_FACTORS = {
      ml: 1,
      oz: 29.5735,
      cup: 236.588,
    };
    
    // Calculate totalMilliliters for TypeScript compatibility
    const totalMilliliters = Math.round(amount * CONVERSION_FACTORS[unit as keyof typeof CONVERSION_FACTORS]);
    
    // Create the water entry with totalMilliliters included
    const waterEntry = await payload.create({
      collection: 'water-entries', // This matches the slug in Water.ts
      data: {
        amount: amount,
        unit: unit,
        time: body.time || new Date().toISOString(),
        totalMilliliters: totalMilliliters, // Include for TypeScript compatibility
        user: mockUserId, // Use a valid user ID from your database
      },
    });
    
    return NextResponse.json(waterEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating water entry:', error);
    return NextResponse.json(
      { error: 'Failed to create water entry', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET handler to fetch water intake data
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config });
    
    // Get date range for today
    const { startOfDay, endOfDay } = getTodayDateRange();
    
    // For now, we'll use a mock user ID for testing
    // In production, you would get this from authentication
    const mockUserId = 1;
    
    // Query water entries for today
    const waterEntries = await payload.find({
      collection: 'water-entries',
      where: {
        and: [
          {
            user: {
              equals: mockUserId
            }
          },
          {
            time: {
              greater_than_equal: startOfDay
            }
          },
          {
            time: {
              less_than_equal: endOfDay
            }
          }
        ]
      },
    });
    
    // Calculate total water intake in milliliters
    const totalMilliliters = waterEntries.docs.reduce((total, entry) => {
      return total + (entry.totalMilliliters as number);
    }, 0);
    
    // Convert to liters for display
    const totalLiters = (totalMilliliters / 1000).toFixed(1);
    
    // Set a daily goal (could be configurable in the future)
    const dailyGoalLiters = 2.0;
    const remainingLiters = Math.max(0, dailyGoalLiters - parseFloat(totalLiters)).toFixed(1);
    const percentComplete = Math.min(100, Math.round((parseFloat(totalLiters) / dailyGoalLiters) * 100));
    
    return NextResponse.json({
      totalMilliliters,
      totalLiters,
      dailyGoalLiters,
      remainingLiters,
      percentComplete,
      entries: waterEntries.docs
    });
  } catch (error) {
    console.error('Error fetching water intake data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch water intake data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
