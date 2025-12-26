'use client';

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

interface QuestionFlowProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  onAnswerSelect: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
}

export default function QuestionFlow({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onBack,
  canGoNext,
  canGoBack,
}: QuestionFlowProps) {
  const { t, lang } = useI18n();
  const progress = (questionNumber / totalQuestions) * 100;
  const currentLangQuestion = lang === 'ru' ? question.ru : question.en;

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { bg: 'bg-success/15', border: 'border-success/30', text: 'text-success' };
      case 'medium':
        return { bg: 'bg-warning/15', border: 'border-warning/30', text: 'text-warning' };
      case 'hard':
        return { bg: 'bg-error/15', border: 'border-error/30', text: 'text-error' };
      default:
        return { bg: 'bg-muted/15', border: 'border-muted/30', text: 'text-muted' };
    }
  };

  const difficulty = getDifficultyConfig(question.difficulty);

  return (
    <div className="min-h-screen bg-background text-foreground px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                Question {questionNumber} {t('questionOf')} {totalQuestions}
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t('progressCheck')}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{Math.round(progress)}%</p>
              <p className="text-xs text-muted">{t('complete')}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

          {/* Question Card */}
        <div className="ui-card p-6 sm:p-8 lg:p-10 mb-8 shadow-xl border-t-4 border-t-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <span className="text-9xl font-bold text-primary">{questionNumber}</span>
          </div>
          
          {/* Badges */}
          <div className="flex items-center gap-3 mb-8 flex-wrap relative z-10">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${difficulty.bg} ${difficulty.border} ${difficulty.text} border shadow-sm`}>
              {question.difficulty}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary shadow-sm">
              {currentLangQuestion.topic}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-10 leading-relaxed text-foreground relative z-10">
            {currentLangQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 relative z-10">
            {currentLangQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              
              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  className={`w-full text-left p-5 rounded-md border-2 transition-all duration-300 group flex items-center relative overflow-hidden ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                      : 'border-border hover:border-primary/40 hover:bg-surface/80 hover:shadow-sm'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />
                  
                  <div className="flex items-center gap-5 w-full relative z-10">
                    {/* Radio Button */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-primary bg-primary shadow-lg scale-110'
                        : 'border-muted/40 group-hover:border-primary/60'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Option Text */}
                    <span className={`text-base sm:text-lg leading-relaxed font-medium transition-colors ${
                      isSelected ? 'text-foreground' : 'text-muted group-hover:text-foreground'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 sm:gap-4">
          <Button
            onClick={onBack}
            disabled={!canGoBack}
            variant="secondary"
            size="md"
            className="flex-1 sm:flex-none px-4 sm:px-6 text-sm sm:text-base min-h-11 sm:min-h-12"
          >
            {t('backBtn')}
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none px-4 sm:px-6 text-sm sm:text-base min-h-11 sm:min-h-12"
          >
            {questionNumber === totalQuestions ? t('viewResultsBtn') : t('nextBtn')}
          </Button>
        </div>

        {/* Hint */}
        {!canGoNext && (
          <p className="text-center text-xs sm:text-sm text-muted mt-3 sm:mt-4 animate-fade-in-up">
            {t('selectAnswer')}
          </p>
        )}
      </div>
    </div>
  );
}

