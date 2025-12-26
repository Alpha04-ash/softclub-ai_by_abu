import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const resultsFile = path.join(dataDir, 'results.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

if (!fs.existsSync(resultsFile)) {
  fs.writeFileSync(resultsFile, JSON.stringify([]));
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Result {
  id: string;
  username: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: any[];
}

// Users operations
export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export function getUserByUsername(username: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  saveUsers(users);
  
  return updatedUser;
}

export function createUser(username: string, password: string, role: 'admin' | 'user' = 'user'): User {
  const users = getUsers();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Results operations
export function getResults(): Result[] {
  try {
    const data = fs.readFileSync(resultsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function saveResults(results: Result[]): void {
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
}

export function addResult(result: Result): void {
  const results = getResults();
  results.push(result);
  saveResults(results);
}

export function getResultsByUsername(username: string): Result[] {
  const results = getResults();
  return results.filter(r => r.username === username);
}



