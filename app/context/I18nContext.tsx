"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'ru';

const dict: Record<Lang, Record<string, string>> = {
  en: {
    adminDashboard: 'Admin Dashboard',
    myDashboard: 'My Dashboard',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
    heroTitle: 'Learn Programming and Realize Your Dreams',
    heroSubtitle: 'Discover, learn, and succeed with AI-powered skill assessments',
    startAssessment: 'Start Assessment',
    generatingQuestions: 'Generating Questions...',
    selectSubject: 'Select a Subject',
    generateNewQuestions: 'Generate New Questions',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    back: 'Back',
    next: 'Next',
    viewResults: 'View Results',
    results: 'Results',
    questionReview: 'Question Review',
    notAnswered: 'Not Answered',
    correct: 'Correct',
    incorrect: 'Incorrect',
    signInToContinue: 'Sign in to your account',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    or: 'or',
    dontHaveAccount: "Don't have an account?",
    registerHere: 'Register here',
    adminAccount: 'Demo Admin Account',
    alreadyHaveAccount: 'Already have an account?',
    create: 'Create Account',
    passwordsNoMatch: 'Passwords do not match',
    joinToday: 'Join our community today',
    chooseUsername: 'Choose a username',
    createPassword: 'Create a password',
    quickAssessment: '🚀 Quick Assessment',
    testYourSkills: 'Test Your Skills',
    inAnyLanguage: 'In Any Language',
    availableLanguages: 'Available Languages',
    languages: 'Languages',
    questions: 'Questions',
    perTest: 'Per Test',
    assessmentComplete: 'Assessment Complete',
    outOf: 'out of',
    questionsAnswered: 'questions answered correctly',
    reviewYourAnswers: 'Review Your Answers',
    question: 'Question',
    skipped: '⊝ Skipped',
    correctAnswer: '✓ Correct',
    incorrectAnswer: '✗ Incorrect',
    viewDashboard: 'View Dashboard',
    startNewAssessment: 'Start New Assessment',
    usernameLabel: 'Username:',
    passwordLabel: 'Password:',
    myResults: 'My Results',
    welcomeBack: 'Welcome back',
    noResultsYet: 'No Results Yet',
    completeAssessment: 'Complete an assessment to see your results here.',
    startYourFirstAssessment: 'Start Your First Assessment',
    completedOn: 'Completed on',
    correctCount: 'correct',
    adminDash: 'Admin Dashboard',
    viewAllResults: 'View all user results and statistics',
    totalAssessments: 'Total Assessments',
    activeUsers: 'Active Users',
    averageScore: 'Average Score',
    filterByUser: 'Filter by User:',
    allUsers: 'All Users',
    noAssessmentsCompleted: 'No assessments have been completed yet.',
    questionOf: 'of',
    progressCheck: 'Progress Check',
    complete: 'Complete',
    backBtn: '← Back',
    nextBtn: 'Next →',
    viewResultsBtn: 'View Results →',
    selectAnswer: 'Please select an answer to continue',
  },
  ru: {
    adminDashboard: 'Админ панель',
    myDashboard: 'Мой кабинет',
    register: 'Регистрация',
    login: 'Войти',
    logout: 'Выйти',
    welcome: 'Привет',
    heroTitle: 'Учись программированию и реализуй свои мечты',
    heroSubtitle: 'Открывай, учись и достигай целей с AI‑тестами навыков',
    startAssessment: 'Начать тест',
    generatingQuestions: 'Генерируем вопросы...',
    selectSubject: 'Выберите предмет',
    generateNewQuestions: 'Сгенерировать новые вопросы',
    signIn: 'Войти',
    createAccount: 'Создать аккаунт',
    username: 'Имя пользователя',
    password: 'Пароль',
    confirmPassword: 'Повторите пароль',
    back: 'Назад',
    next: 'Далее',
    viewResults: 'Результаты',
    results: 'Результаты',
    questionReview: 'Разбор вопросов',
    notAnswered: 'Нет ответа',
    correct: 'Верно',
    incorrect: 'Неверно',
    signInToContinue: 'Войдите в свой аккаунт',
    enterUsername: 'Введите имя пользователя',
    enterPassword: 'Введите пароль',
    or: 'или',
    dontHaveAccount: 'Нет аккаунта?',
    registerHere: 'Зарегистрируйтесь здесь',
    adminAccount: 'Демо аккаунт администратора',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    create: 'Создать аккаунт',
    passwordsNoMatch: 'Пароли не совпадают',
    joinToday: 'Присоединись к нам сегодня',
    chooseUsername: 'Выберите имя пользователя',
    createPassword: 'Создайте пароль',
    quickAssessment: '🚀 Быстрая оценка',
    testYourSkills: 'Проверь свои навыки',
    inAnyLanguage: 'На любом языке',
    availableLanguages: 'Доступные языки',
    languages: 'Языков',
    questions: 'Вопросов',
    perTest: 'За тест',
    assessmentComplete: 'Оценка завершена',
    outOf: 'из',
    questionsAnswered: 'вопросов решено правильно',
    reviewYourAnswers: 'Просмотрите свои ответы',
    question: 'Вопрос',
    skipped: '⊝ Пропущено',
    correctAnswer: '✓ Верно',
    incorrectAnswer: '✗ Неверно',
    viewDashboard: 'Просмотреть панель',
    startNewAssessment: 'Начать новый тест',
    usernameLabel: 'Имя пользователя:',
    passwordLabel: 'Пароль:',
    myResults: 'Мои результаты',
    welcomeBack: 'Добро пожаловать',
    noResultsYet: 'Нет результатов',
    completeAssessment: 'Пройдите тест, чтобы увидеть результаты здесь.',
    startYourFirstAssessment: 'Начать первый тест',
    completedOn: 'Завершено',
    correctCount: 'правильно',
    adminDash: 'Админ панель',
    viewAllResults: 'Просмотр результатов всех пользователей и статистики',
    totalAssessments: 'Всего тестов',
    activeUsers: 'Активные пользователи',
    averageScore: 'Средний балл',
    filterByUser: 'Фильтр по пользователю:',
    allUsers: 'Все пользователи',
    noAssessmentsCompleted: 'Пока не пройдено ни одного теста.',
    questionOf: 'из',
    progressCheck: 'Проверка прогресса',
    complete: 'Завершено',
    backBtn: '← Назад',
    nextBtn: 'Далее →',
    viewResultsBtn: 'Смотреть результаты →',
    selectAnswer: 'Пожалуйста, выберите ответ для продолжения',
  },
};

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const STORAGE_KEY = 'sodtclub-ai-lang';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null;
    if (saved === 'en' || saved === 'ru') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ru' : 'en');

  const t = (key: string) => dict[lang]?.[key] ?? dict.en[key] ?? key;

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}


export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

