'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '../context/I18nContext';
import Button from './ui/Button';

type Question = {
  en: {
    question: string;
    options: string[];
    topic: string;
  };
  ru: {
    question: string;
    options: string[];
    topic: string;
  };
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

type Answer = {
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
};

interface ScoreSummaryProps {
  subject: 'JavaScript' | 'TypeScript' | 'Python' | 'C#' | 'Flutter' | 'C++';
  correctCount: number;
  totalQuestions: number;
  questions: Question[];
  answers: Answer[];
  onRestart: () => void;
}

export default function ScoreSummary({
  subject,
  correctCount,
  totalQuestions,
  questions,
  answers,
  onRestart,
}: ScoreSummaryProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { t, lang } = useI18n();
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    if (user) {
      const saveResult = async () => {
        try {
          await fetch('/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user.username,
              subject,
              score: correctCount,
              totalQuestions,
              percentage,
              answers,
            }),
          });
        } catch (error) {
          console.error('Failed to save result:', error);
        }
      };
      saveResult();
    }
  }, [user, subject, correctCount, totalQuestions, percentage, answers]);

  const getScoreConfig = (score: number) => {
    if (score >= 90) return { color: 'text-success', bg: 'bg-success/15', border: 'border-success/30', message: '🎉 Outstanding!' };
    if (score >= 80) return { color: 'text-accent', bg: 'bg-accent/15', border: 'border-accent/30', message: '⭐ Excellent!' };
    if (score >= 70) return { color: 'text-primary', bg: 'bg-primary/15', border: 'border-primary/30', message: '👍 Great!' };
    if (score >= 60) return { color: 'text-warning', bg: 'bg-warning/15', border: 'border-warning/30', message: '📚 Good effort!' };
    return { color: 'text-error', bg: 'bg-error/15', border: 'border-error/30', message: '💪 Keep practicing!' };
  };

  const config = getScoreConfig(percentage);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className={`ui-card p-8 sm:p-12 mb-8 text-center border-2 ${config.border} relative overflow-hidden shadow-2xl`}>
          <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.bg}`} />
          
          <span className="relative z-10 text-sm font-bold text-primary uppercase tracking-widest mb-6 block">{t('assessmentComplete')}</span>
          
          <h1 className="relative z-10 text-4xl sm:text-5xl font-bold mb-8 tracking-tight">{subject}</h1>
          
          <div className="my-12 relative z-10">
            <div className="relative inline-block">
              <div className={`text-7xl sm:text-8xl font-black mb-4 ${config.color} drop-shadow-sm`}>
                {percentage}%
              </div>
              {percentage >= 90 && (
                <div className="absolute -top-6 -right-8 text-4xl animate-bounce">🏆</div>
              )}
            </div>
            <p className={`text-3xl font-bold ${config.color} mb-4`}>{config.message}</p>
            <p className="text-xl text-muted">
              <span className="font-bold text-foreground">{correctCount}</span> {t('outOf')} <span className="font-bold text-foreground">{totalQuestions}</span> {t('questionsAnswered')}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border relative z-10">
            <div className="p-4 rounded-md bg-surface/50 border border-border/50">
              <p className="text-4xl font-bold text-success mb-1">{correctCount}</p>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{t('correct')}</p>
            </div>
            <div className="p-4 rounded-md bg-surface/50 border border-border/50">
              <p className="text-4xl font-bold text-error mb-1">{totalQuestions - correctCount}</p>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{t('incorrect')}</p>
            </div>
            <div className="p-4 rounded-md bg-surface/50 border border-border/50">
              <p className="text-4xl font-bold text-primary mb-1">{totalQuestions}</p>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{t('results')}</p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('reviewYourAnswers')}</h2>
          
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers[index];
              const isAnswered = answer !== undefined;
              const isCorrect = answer?.isCorrect ?? false;
              const currentLangQuestion = lang === 'ru' ? question.ru : question.en;

              return (
                <div
                  key={index}
                  className={`ui-card overflow-hidden transition-all hover:shadow-lg ${
                    isCorrect ? 'border-success/50' : 'border-error/50'
                  }`}
                >
                  {/* Header */}
                  <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${
                    isCorrect ? 'bg-success/5' : 'bg-error/5'
                  }`}>
                    <div>
                      <p className="font-bold text-foreground">{t('question')} {index + 1}</p>
                      <p className="text-sm text-muted mt-0.5">{currentLangQuestion.topic} • {question.difficulty}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      !isAnswered
                        ? 'bg-muted/15 text-muted'
                        : isCorrect
                        ? 'bg-success/20 text-success'
                        : 'bg-error/20 text-error'
                    }`}>
                      {!isAnswered ? t('skipped') : isCorrect ? t('correctAnswer') : t('incorrectAnswer')}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="font-medium text-foreground mb-6">{currentLangQuestion.question}</p>

                    <div className="space-y-3">
                      {currentLangQuestion.options.map((option, optIndex) => {
                        const isSelected = answer?.selectedIndex === optIndex;
                        const isCorrectAnswer = optIndex === question.correctAnswerIndex;
                        const shouldHighlight = isCorrectAnswer || (isSelected && !isCorrectAnswer);

                        return (
                          <div
                            key={optIndex}
                            className={`p-4 rounded-md border-2 transition-all ${
                              isCorrectAnswer
                                ? 'border-success/50 bg-success/10'
                                : isSelected && !isCorrectAnswer
                                ? 'border-error/50 bg-error/10'
                                : 'border-border hover:border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isCorrectAnswer && (
                                <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <svg className="w-5 h-5 text-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className={`font-medium ${
                                isCorrectAnswer
                                  ? 'text-success'
                                  : isSelected && !isCorrectAnswer
                                  ? 'text-error'
                                  : 'text-muted'
                              }`}>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push(user?.role === 'admin' ? '/admin' : '/dashboard')}
            variant="primary"
            size="lg"
            className="sm:w-auto"
          >
            {t('viewDashboard')}
          </Button>
          <Button
            onClick={onRestart}
            variant="secondary"
            size="lg"
            className="sm:w-auto"
          >
            {t('startNewAssessment')}
          </Button>
        </div>
      </div>
    </div>
  );
}

