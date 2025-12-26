import { NextResponse } from 'next/server';
import { getUsers, updateUser, getUserById, getUserByUsername } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = getUsers();
  // Remove passwords from response
  const safeUsers = users.map(({ password, ...user }) => user);
  
  return NextResponse.json({ users: safeUsers });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, username, password, currentUsername, role } = body;

    if (!id || !currentUsername) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the user performing the action
    const actor = getUserByUsername(currentUsername);
    if (!actor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the target user
    const targetUser = getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions: Admin can update anyone, User can only update themselves
    if (actor.role !== 'admin' && actor.id !== targetUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates: any = {};

    // Update username if provided
    if (username && username !== targetUser.username) {
      // Check uniqueness
      const existing = getUserByUsername(username);
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
      updates.username = username;
    }

    // Update password if provided
    if (password) {
      if (password.length < 3) {
        return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
      }
      updates.password = bcrypt.hashSync(password, 10);
    }

    // Update role if provided (Admin only)
    if (role && actor.role === 'admin') {
      updates.role = role;
    }

    const updatedUser = updateUser(id, updates);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
