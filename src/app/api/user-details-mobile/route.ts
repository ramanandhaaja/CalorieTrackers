import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import config from '@/payload.config';

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

    // Get user from token
    const user = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: requestedUserId
        }
      }
    });

    if (!user.docs || user.docs.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user details
    const userDetails = await payload.find({
      collection: 'user-details',
      where: {
        user: {
          equals: requestedUserId
        }
      }
    });

    if (!userDetails.docs || userDetails.docs.length === 0) {
      return NextResponse.json(
        { error: 'User details not found' },
        { status: 404 }
      );
    }

    // Log successful user details fetch
    console.log(`User details fetched successfully for user: ${requestedUserId}`);
    
    return NextResponse.json(userDetails.docs[0]);
  } catch (error) {
    console.error('Error initializing payload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
