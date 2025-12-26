"use client";

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import Link from 'next/link';
import Logo from './Logo';
import Button from './ui/Button';
import { useState } from 'react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 site-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity duration-200">
            <Logo responsive={true} />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-3 lg:gap-4">
          {/* Theme Toggle */}
          <Button
            type="button"
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </Button>

          {/* Language Toggle */}
          <Button
            type="button"
            onClick={toggleLang}
            variant="ghost"
            size="sm"
            aria-label={lang === 'en' ? 'Switch to Russian' : 'Switch to English'}
          >
            <span className="text-xs font-bold">{lang === 'en' ? 'EN' : 'РУ'}</span>
          </Button>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 ml-1.5 sm:ml-4 pl-1.5 sm:pl-4 border-l border-border">
              <Link
                href={isAdmin ? '/admin' : '/dashboard'}
                className="text-xs sm:text-sm lg:text-base font-medium text-muted hover:text-primary transition-colors"
              >
                {isAdmin ? t('adminDashboard') : t('myDashboard')}
              </Link>
              <span className="text-xs sm:text-sm lg:text-base text-muted">{user.username}</span>
              <Button onClick={logout} variant="secondary" size="sm">
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-3 ml-1.5 sm:ml-4 pl-1.5 sm:pl-4 border-l border-border">
              <Link href="/register">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  {t('register')}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary" size="sm">
                  {t('login')}
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button & Settings */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            type="button"
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </Button>

          <Button
            type="button"
            onClick={toggleLang}
            variant="ghost"
            size="sm"
            className="p-2 text-xs font-bold"
          >
            {lang === 'en' ? 'EN' : 'РУ'}
          </Button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-muted rounded transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border">
          <nav className="flex flex-col gap-3 pt-4">
            {user ? (
              <>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAdmin ? t('adminDashboard') : t('myDashboard')}
                </Link>
                <span className="px-4 py-2 text-sm text-muted">{user.username}</span>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="secondary" size="sm" className="mx-4">
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm">
                    {t('register')}
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

