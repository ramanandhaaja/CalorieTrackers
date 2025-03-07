import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: await config })
    const body = await req.json()
    
    // Validate required fields
    if (!body.email || !body.password || !body.fullName || !body.username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate password match if confirmPassword is provided
    if (body.confirmPassword && body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }
    
    // Create the user
    const user = await payload.create({
      collection: 'users',
      data: {
        email: body.email,
        password: body.password,
        fullName: body.fullName,
        username: body.username,
        phone: body.phone || undefined,
        role: 'user', // Default role
      },
    })
    
    // Return success response
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle duplicate key errors
    if (error.message && error.message.includes('duplicate key')) {
      if (error.message.includes('email')) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }
      if (error.message.includes('username')) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
