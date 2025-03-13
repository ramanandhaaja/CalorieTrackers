import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config: await config });
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Find user details for the authenticated user
      const userDetails = await payload.find({
        collection: 'user-details',
        where: {
          user: {
            equals: user.id,
          },
        },
      });
      
      return NextResponse.json(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      
      // Provide more detailed error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return NextResponse.json(
        { error: `Failed to fetch user details: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config: await config });
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the data from the request
    const data = await req.json();
    
    try {
      // Find user details for the authenticated user
      const userDetailsQuery = await payload.find({
        collection: 'user-details',
        where: {
          user: {
            equals: user.id,
          },
        },
      });
      
      if (!userDetailsQuery.docs || userDetailsQuery.docs.length === 0) {
        return NextResponse.json(
          { error: 'User details not found' },
          { status: 404 }
        );
      }
      
      const userDetailsId = userDetailsQuery.docs[0].id;
      
      // Update user details
      const updatedUserDetails = await payload.update({
        collection: 'user-details',
        id: userDetailsId,
        data: data,
      });
      
      return NextResponse.json(updatedUserDetails);
    } catch (error) {
      console.error('Error updating user details:', error);
      
      // Provide more detailed error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return NextResponse.json(
        { error: `Failed to update user details: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config: await config });
    
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    // If no user is authenticated, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the data from the request
    const data = await req.json();
    
    console.log(user);

    try {
      // Create user details with the authenticated user ID
      const userDetails = await payload.create({
        collection: 'user-details',
        data: {
          ...data,
          user: user.id,
        },
      });
      
      return NextResponse.json(userDetails);
    } catch (error) {
      console.error('Error creating user details:', error);
      
      // Provide more detailed error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return NextResponse.json(
        { error: `Failed to create user details: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
