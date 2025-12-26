'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Register from '../components/Register';
import Header from '../components/Header';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (username: string, password: string, confirmPassword: string): Promise<boolean> => {
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters');
      return false;
    }

    try {
      const success = await register(username, password);
      if (success) {
        setError(null);
        router.push('/dashboard');
        return true;
      } else {
        // Try to get error from API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        setError(data.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Register onRegister={handleRegister} error={error} />
    </>
  );
}

