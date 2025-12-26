'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Login from '../components/Login';
import Header from '../components/Header';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (username: string, password: string) => {
    setError(null);
    const success = await login(username, password);
    if (success) {
      setError(null);
      const user = JSON.parse(localStorage.getItem('sodtclub_user') || '{}');
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Login onLogin={handleLogin} error={error} />
    </>
  );
}

