import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'
import { serialize } from 'cookie'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config })
    const body = await req.json()
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Authenticate the user
    const result = await payload.login({
      collection: 'users',
      data: {
        email: body.email,
        password: body.password,
      },
    })
    
    // Ensure we have a token
    if (!result.token || typeof result.token !== 'string') {
      throw new Error('Authentication failed - invalid token received')
    }
    
    // Set the payload auth cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
    
    // Create the response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          username: result.user.username,
        }
      },
      { status: 200 }
    )
    
    // Set the cookie - using the token from the login result
    // Payload CMS v3 doesn't expose cookies config directly, so we use a standard name
    response.headers.set(
      'Set-Cookie',
      serialize('payload-token', result.token, cookieOptions)
    )
    
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }
}
