'use client';

import Image from 'next/image';
import { useI18n } from '../context/I18nContext';
import Button from './ui/Button';
import HeroBackground from './HeroBackground';

interface SubjectSelectionProps {
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function SubjectSelection({ onGenerate, isLoading, error }: SubjectSelectionProps) {
  const { t } = useI18n();

  const subjects = [
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'from-yellow-500 to-yellow-600' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'from-blue-500 to-blue-600' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'from-green-500 to-green-600' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', color: 'from-purple-500 to-purple-600' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', color: 'from-sky-500 to-sky-600' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <HeroBackground />

      <div className="max-w-4xl mx-auto px-6 py-12 text-center z-10">
        {/* Main Hero Section */}
        <div className="space-y-8 flex flex-col items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/15 border border-primary/30 text-primary rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              {t('quickAssessment')}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              <span className="text-gradient block">{t('testYourSkills')}</span>
              <span className="block text-foreground mt-2">{t('inAnyLanguage')}</span>
            </h1>
          </div>

          <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-error/15 border border-error/30 rounded-md animate-slide-in-down max-w-md w-full">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={onGenerate}
              disabled={isLoading}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="group px-10 py-4 text-lg shadow-2xl shadow-primary/20"
            >
              {isLoading ? t('generatingQuestions') : `${t('startAssessment')} →`}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-12 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted mt-1 uppercase tracking-wider font-medium">{t('languages')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">100+</p>
              <p className="text-sm text-muted mt-1 uppercase tracking-wider font-medium">{t('questions')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">5min</p>
              <p className="text-sm text-muted mt-1 uppercase tracking-wider font-medium">{t('perTest')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

