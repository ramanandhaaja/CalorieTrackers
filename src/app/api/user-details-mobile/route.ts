import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { verify } from 'jsonwebtoken';
import config from '@/payload.config';
import { JWT_SECRET } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config: await config });
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = verify(token, JWT_SECRET) as { id: string };
      if (!decodedToken || !decodedToken.id) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get the user ID from query params
    const searchParams = req.nextUrl.searchParams;
    const requestedUserId = searchParams.get('userId');

    // Verify that the token's user ID matches the requested user ID
    if (decodedToken.id !== requestedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized to access this user\'s details' },
        { status: 403 }
      );
    }

    if (!requestedUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      // Find user details for the specified user
      const userDetails = await payload.find({
        collection: 'user-details',
        where: {
          user: {
            equals: requestedUserId,
          },
        },
      });

      if (!userDetails.docs || userDetails.docs.length === 0) {
        return NextResponse.json(
          { error: 'User details not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(userDetails);
    } catch (error) {
      console.error('Error finding user details:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user details' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing payload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
