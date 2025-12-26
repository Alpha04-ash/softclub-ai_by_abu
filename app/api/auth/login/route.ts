import { NextResponse } from 'next/server';
import { getUserByUsername, getUsers } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check admin credentials (fixed account)
    if (username.toLowerCase() === 'admin' && password === '1234!') {
      return NextResponse.json({
        success: true,
        user: {
          username: 'admin',
          role: 'admin',
        },
      });
    }

    // Check registered users
    const user = getUserByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

