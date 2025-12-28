'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from './context/AuthContext';
import { useI18n } from './context/I18nContext';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import SubjectSelection from './components/SubjectSelection';
import QuestionFlow from './components/QuestionFlow';
import ScoreSummary from './components/ScoreSummary';
import GlassButton from './components/glass/ui/GlassButton';
import GlassCard from './components/glass/ui/GlassCard';
import HeroBackground from './components/HeroBackground';
import LanguageCarousel from './components/LanguageCarousel';

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

type Subject = {
  subject: 'JavaScript' | 'TypeScript' | 'Python' | 'C#' | 'Flutter' | 'C++';
  questions: Question[];
};

type SkillCheckData = {
  generatedBy: string;
  subjects: Subject[];
};

type Answer = {
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [skillCheckData, setSkillCheckData] = useState<SkillCheckData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<'JavaScript' | 'TypeScript' | 'Python' | 'C#' | 'Flutter' | 'C++' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate questions');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSkillCheckData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectSelect = (subject: 'JavaScript' | 'TypeScript' | 'Python' | 'C#' | 'Flutter' | 'C++') => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (selectedIndex: number) => {
    if (!selectedSubject || !skillCheckData) return;

    const subject = skillCheckData.subjects.find(s => s.subject === selectedSubject);
    if (!subject) return;

    const question = subject.questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswerIndex;

    const newAnswer: Answer = {
      questionIndex: currentQuestionIndex,
      selectedIndex,
      isCorrect,
    };

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (!selectedSubject || !skillCheckData) return;

    const subject = skillCheckData.subjects.find(s => s.subject === selectedSubject);
    if (!subject) return;

    if (currentQuestionIndex < subject.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setSkillCheckData(null);
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setError(null);
  };

  const currentSubject = skillCheckData?.subjects.find(s => s.subject === selectedSubject);
  const currentQuestion = currentSubject?.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (showResults && selectedSubject && currentSubject) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = currentSubject.questions.length;
    return (
      <>
        <Header />
        <ScoreSummary
          subject={selectedSubject}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          questions={currentSubject.questions}
          answers={answers}
          onRestart={handleRestart}
        />
      </>
    );
  }

  if (!skillCheckData) {
    return (
      <>
        <Header />
        <SubjectSelection
          onGenerate={generateQuestions}
          isLoading={isLoading}
          error={error}
        />
      </>
    );
  }

  if (!selectedSubject) {
    return (
      <>
        <Header />
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
          <HeroBackground />
          <div className="max-w-5xl mx-auto px-4 py-16 z-10 w-full text-center">
            <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight text-white drop-shadow-lg">
              {t('selectSubject')}
            </h1>
            
            <LanguageCarousel 
              subjects={skillCheckData.subjects} 
              onSelect={handleSubjectSelect} 
            />

            <div className="text-center mt-12">
              <GlassButton onClick={handleRestart} variant="ghost" className="px-8 py-3 text-white border-white/10 hover:bg-white/5">
                {t('generateNewQuestions')}
              </GlassButton>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <>
      <Header />
      <QuestionFlow
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={currentSubject.questions.length}
      selectedAnswer={currentAnswer?.selectedIndex}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      onBack={handleBack}
      canGoNext={currentAnswer !== undefined}
      canGoBack={currentQuestionIndex > 0}
    />
    </>
  );
}

