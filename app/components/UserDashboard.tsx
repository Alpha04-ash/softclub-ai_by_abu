'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import EditProfile from './EditProfile';

interface Result {
  id: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: any[];
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [results, setResults] = useState<Result[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/results?username=${user.username}&role=${user.role}`);
          const data = await response.json();
          setResults(data.results || []);
        } catch (error) {
          console.error('Failed to fetch results:', error);
        }
      }
    };
    fetchResults();
  }, [user]);

  const handleStartNew = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-light mb-2 tracking-tight">{t('myResults')}</h1>
            <p className="text-sm text-muted">{t('welcomeBack')}, {user?.username}!</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-5 py-2.5 border border-white/10 bg-white/5 text-foreground rounded-md font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              {t('editProfile') || 'Edit Profile'}
            </button>
            <button
              onClick={handleStartNew}
              className="ui-btn primary px-5 py-2.5 text-sm"
            >
              {t('startNewAssessment')}
            </button>
            <button
              onClick={logout}
              className="px-5 py-2.5 border border-white/6 text-muted rounded-md font-medium hover:bg-white/2 transition-colors text-sm"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="ui-card p-12 text-center border-dashed border-2 border-border/50 bg-surface/30">
            <div className="flex justify-center mb-6 opacity-50">
              <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">{t('noResultsYet')}</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">{t('completeAssessment')}</p>
            <button
              onClick={handleStartNew}
              className="ui-btn primary px-8 py-3 text-base shadow-lg hover:shadow-primary/25"
            >
              {t('startYourFirstAssessment')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="ui-card p-6 hover:shadow-xl transition-all duration-300 group border-t-4 border-t-transparent hover:border-t-primary relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="text-6xl font-bold">{result.percentage}</span>
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-surface border border-border mb-3">
                      {result.subject}
                    </span>
                    <h3 className="text-3xl font-bold mb-1">
                      {result.percentage}%
                    </h3>
                    <p className="text-sm text-muted">
                      {result.score} / {result.totalQuestions} {t('correctCount')}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    result.percentage >= 80 ? 'border-success text-success bg-success/10' :
                    result.percentage >= 60 ? 'border-warning text-warning bg-warning/10' : 'border-error text-error bg-error/10'
                  }`}>
                    {result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '⭐' : '📝'}
                  </div>
                </div>

                <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.percentage >= 80 ? 'bg-success' :
                      result.percentage >= 60 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted border-t border-border pt-4 mt-2">
                  <span>{new Date(result.date).toLocaleDateString()}</span>
                  <span className="font-medium text-foreground">{result.percentage >= 80 ? 'Excellent' : result.percentage >= 60 ? 'Good' : 'Needs Practice'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
}
