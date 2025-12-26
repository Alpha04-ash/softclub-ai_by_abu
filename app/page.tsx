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
        <div className="min-h-screen bg-background text-foreground px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-light mb-12 text-center tracking-tight">{t('selectSubject')}</h1>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {skillCheckData.subjects.map((subject) => (
                <button
                  key={subject.subject}
                  onClick={() => handleSubjectSelect(subject.subject)}
                  className="p-8 text-center ui-card rounded-md hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-6 h-16 items-center">
                    {subject.subject === 'JavaScript' && (
                      <div className="w-16 h-16 bg-white/6 rounded-md flex items-center justify-center border border-white/6 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                          alt="JavaScript"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                    {subject.subject === 'TypeScript' && (
                      <div className="w-16 h-16 bg-blue-50 rounded-md flex items-center justify-center border border-blue-100 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                          alt="TypeScript"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                    {subject.subject === 'Python' && (
                      <div className="w-16 h-16 bg-green-50 rounded-md flex items-center justify-center border border-green-100 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                          alt="Python"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                    {subject.subject === 'C#' && (
                      <div className="w-16 h-16 bg-purple-50 rounded-md flex items-center justify-center border border-purple-100 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
                          alt="C#"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                    {subject.subject === 'Flutter' && (
                      <div className="w-16 h-16 bg-sky-50 rounded-md flex items-center justify-center border border-sky-100 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
                          alt="Flutter"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                    {subject.subject === 'C++' && (
                      <div className="w-16 h-16 bg-indigo-50 rounded-md flex items-center justify-center border border-indigo-100 p-2.5">
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
                          alt="C++"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-medium mb-2">{subject.subject}</h2>
                  <p className="text-sm text-muted">{subject.questions.length} {t('questions')}</p>
                </button>
              ))}
            </div>
            <div className="text-center">
              <GlassButton onClick={handleRestart} variant="ghost">
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

