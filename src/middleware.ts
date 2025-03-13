import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to protect routes and handle redirects
export async function middleware(request: NextRequest) {
  // Get the pathname from the request URL
  const { pathname } = request.nextUrl;

  // Check if user is authenticated by looking for the payload-token cookie
  const token = request.cookies.get('payload-token')?.value;
  
  // If there's no token and the user is trying to access a protected route, redirect to login
  if (!token && (pathname.startsWith('/dashboard') || pathname === '/onboarding')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access dashboard, check if they have completed onboarding
  if (token && pathname.startsWith('/dashboard')) {
    try {
      // Check if user has completed onboarding by making an API request
      const hasCompletedOnboarding = await checkOnboardingStatus(token, request);
      
      if (!hasCompletedOnboarding) {
        console.log('User has not completed onboarding, redirecting to /onboarding');
        return NextResponse.redirect(new URL('/onboarding', request.url));
      } else {
        console.log('User has completed onboarding, allowing access to dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If there's an error, let them proceed to dashboard
    }
  }

  return NextResponse.next();
}

// Helper function to check if user has completed onboarding
async function checkOnboardingStatus(token: string, request: NextRequest): Promise<boolean> {
  try {
    // Get the base URL from the request
    const protocol = request.nextUrl.protocol; // http: or https:
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}//${host}`;
    
    // Make a request directly to the user-details API
    // The API will handle authentication and return user details if they exist
    const userDetailsResponse = await fetch(
      `${baseUrl}/api/user-details`,
      {
        headers: {
          Cookie: `payload-token=${token}`
        },
        cache: 'no-store'
      }
    );
    
    if (!userDetailsResponse.ok) {
      // If the response is not OK (e.g., 401 unauthorized), the user is not authenticated
      // or there was another error
      console.error('Failed to fetch user details, status:', userDetailsResponse.status);
      return false;
    }
    
    const userDetailsData = await userDetailsResponse.json();
    console.log('User details data:', userDetailsData);
    
    // If there are any docs in the response, the user has completed onboarding
    return userDetailsData?.docs && userDetailsData.docs.length > 0;
  } catch (error) {
    console.error('Error in checkOnboardingStatus:', error);
    return false;
  }
}

// Export the matcher config separately from the middleware function
export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/login'],
};
