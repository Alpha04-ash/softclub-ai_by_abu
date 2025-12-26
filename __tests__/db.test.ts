import { createUser, getUserByUsername, User } from '@/lib/db';
import fs from 'fs';
import bcrypt from 'bcryptjs';

jest.mock('fs');
jest.mock('bcryptjs');

describe('DB Operations', () => {
  const mockUsers: User[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs.readFileSync to return empty array or mock data
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));
    // Mock fs.existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    // Mock bcrypt.hashSync
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed_password');
  });

  it('should create a user with hashed password', () => {
    const newUser = createUser('testuser', 'password123');

    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    expect(newUser.username).toBe('testuser');
    expect(newUser.password).toBe('hashed_password');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should get user by username', () => {
    const user = {
        id: '1',
        username: 'testuser',
        password: 'hashed_password',
        role: 'user' as const,
        createdAt: 'date'
    };
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([user]));

    const foundUser = getUserByUsername('testuser');
    expect(foundUser).toEqual(user);
  });
});
