'use client';

import Image from 'next/image';
import { useI18n } from '../context/I18nContext';
import Button from './ui/Button';

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
        {/* Main Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/15 border border-primary/30 text-primary rounded-full text-sm font-semibold mb-4">
                {t('quickAssessment')}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                <span className="text-gradient">{t('testYourSkills')}</span>
                <span className="block text-foreground mt-2">{t('inAnyLanguage')}</span>
              </h1>
            </div>

            <p className="text-lg text-muted leading-relaxed max-w-lg">
              {t('heroSubtitle')}
            </p>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-error/15 border border-error/30 rounded-md animate-slide-in-down">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            )}

            <Button
              onClick={onGenerate}
              disabled={isLoading}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="group"
            >
              {isLoading ? t('generatingQuestions') : `${t('startAssessment')} →`}
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">10+</p>
                <p className="text-xs text-muted mt-1">{t('languages')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">100+</p>
                <p className="text-xs text-muted mt-1">{t('questions')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">5min</p>
                <p className="text-xs text-muted mt-1">{t('perTest')}</p>
              </div>
            </div>
          </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subjects.map((subject, index) => (
                <button
                  key={subject.name}
                  onClick={() => {
                    // This component is used inside page.tsx which handles the selection logic
                    // We need to pass the selection up, but the current props only have onGenerate
                    // The page.tsx actually renders the grid itself when !skillCheckData
                    // Wait, looking at page.tsx, SubjectSelection is only shown when !skillCheckData
                    // But page.tsx ALSO renders a grid of subjects when !selectedSubject
                    // This component seems to be the "Landing Page" before generation
                  }}
                  className="group relative p-6 text-center ui-card rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-md flex items-center justify-center bg-gradient-to-br ${subject.color} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Image
                      src={subject.icon}
                      alt={subject.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{subject.name}</h3>
                </button>
              ))}
            </div>
        </div>

        {/* Mobile Language List */}
        <div className="lg:hidden">
          <h3 className="text-lg font-bold mb-4">{t('availableLanguages')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div key={subject.name} className="ui-card p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br ${subject.color} p-2`}>
                  <Image
                    src={subject.icon}
                    alt={subject.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-sm">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

