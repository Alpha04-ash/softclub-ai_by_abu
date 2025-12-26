'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';
import Button from './ui/Button';

interface RegisterProps {
  onRegister: (username: string, password: string, confirmPassword: string) => Promise<boolean>;
  error: string | null;
}

export default function Register({ onRegister, error }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Reinitialize Visme forms if script is loaded
    if (typeof window !== 'undefined' && (window as any).Visme) {
      setTimeout(() => {
        (window as any).Visme.runVismeInjection?.();
      }, 500);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    
    setIsLoading(true);
    try {
      await onRegister(username, password, confirmPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;
  const isFormValid = username && password && confirmPassword && passwordsMatch;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="ui-card p-8 sm:p-10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t('createAccount')}
            </h1>
            <p className="text-sm text-muted">{t('joinToday')}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-error/15 border border-error/30 rounded-md animate-slide-in-down">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="group">
              <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2 group-focus-within:text-primary transition-colors">
                {t('username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-surface/50 text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-muted/50"
                  placeholder={t('chooseUsername')}
                  required
                  minLength={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2 group-focus-within:text-primary transition-colors">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-surface/50 text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-muted/50"
                  placeholder={t('createPassword')}
                  required
                  minLength={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2 group-focus-within:text-primary transition-colors">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border bg-surface/50 text-foreground rounded-md focus:outline-none focus:ring-4 transition-all text-sm placeholder:text-muted/50 ${
                    password && confirmPassword && !passwordsMatch
                      ? 'border-error focus:border-error focus:ring-error/10'
                      : 'border-border focus:border-primary focus:ring-primary/10'
                  }`}
                  placeholder="Confirm your password"
                  required
                  minLength={3}
                  disabled={isLoading}
                />
              </div>
              {password && confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-sm text-error flex items-center gap-1 animate-fade-in-up">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t('passwordsNoMatch')}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !isFormValid}
            >
              {t('create')}
            </Button>
          </form>

          {/* Visme Animation */}
          <div className="my-8 w-full">
            <div 
              className="visme_d"
              data-title="Webinar Registration Form"
              data-url="g7ddqxx0-untitled-project?fullPage=true"
              data-domain="forms"
              data-full-page="true"
              data-min-height="100vh"
              data-form-id="133190"
            />
          </div>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-muted bg-background">{t('or')}</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-sm text-muted">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

