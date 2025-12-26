'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import EditProfile from './EditProfile';

interface Result {
  id: string;
  username: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: any[];
}

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { t } = useI18n();
  const [allResults, setAllResults] = useState<(Result & { username: string })[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'users'>('results');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, usersRes] = await Promise.all([
          fetch('/api/results?role=admin'),
          fetch('/api/users?role=admin')
        ]);
        
        const resultsData = await resultsRes.json();
        const usersData = await usersRes.json();
        
        setAllResults(resultsData.results || []);
        setAllUsers(usersData.users || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [editingUser]); // Refetch when editing is done

  const users = Array.from(new Set(allResults.map(r => r.username)));
  const filteredResults = selectedUser
    ? allResults.filter(r => r.username === selectedUser)
    : allResults;

  const handleStartNew = () => {
    window.location.href = '/';
  };

  const [stats, setStats] = useState({ totalAssessments: 0, uniqueUsers: 0, avgScore: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats({
          totalAssessments: data.totalAssessments || 0,
          uniqueUsers: data.uniqueUsers || 0,
          avgScore: data.avgScore || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [allResults]);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('adminDash')}</h1>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setActiveTab('results')}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'results' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {t('viewAllResults') || 'Results'}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                Manage Users
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleStartNew}
              className="ui-btn primary px-6 py-3 shadow-lg"
            >
              {t('startAssessment')}
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 border border-white/6 text-muted rounded-md font-medium hover:bg-white/2 transition-all"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="ui-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalAssessments}</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wide">{t('totalAssessments')}</div>
          </div>
          
          <div className="ui-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div className="mb-4 p-3 bg-accent/10 w-fit rounded-xl text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.uniqueUsers}</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wide">{t('activeUsers')}</div>
          </div>

          <div className="ui-card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-24 h-24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <div className="mb-4 p-3 bg-warning/10 w-fit rounded-xl text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.avgScore}%</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wide">{t('averageScore')}</div>
          </div>
        </div>

        {/* User Filter */}
        {activeTab === 'results' && users.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-muted mb-3">{t('filterByUser')}</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedUser(null)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedUser === null
                    ? 'ui-btn primary'
                    : 'ui-btn ghost'
                }`}
              >
                {t('allUsers')}
              </button>
              {users.map((username) => (
                <button
                  key={username}
                  onClick={() => setSelectedUser(username)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedUser === username
                      ? 'ui-btn primary'
                      : 'ui-btn ghost'
                  }`}
                >
                  {username}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'results' ? (
          filteredResults.length === 0 ? (
            <div className="ui-card p-12 text-center border-dashed border-2 border-border/50 bg-surface/30">
              <div className="flex justify-center mb-6 opacity-50">
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-muted">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('noResultsYet')}</h2>
              <p className="text-muted">{t('noAssessmentsCompleted')}</p>
            </div>
          ) : (
            <div className="ui-card overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface/50 border-b border-border">
                      <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">{t('user')}</th>
                      <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">{t('subject')}</th>
                      <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">{t('score')}</th>
                      <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">{t('date')}</th>
                      <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {result.username.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{result.username}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-xs font-medium">
                            {result.subject}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{result.percentage}%</span>
                            <span className="text-xs text-muted">({result.score}/{result.totalQuestions})</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted">
                          {new Date(result.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.percentage >= 80 ? 'bg-success/10 text-success' :
                            result.percentage >= 60 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                          }`}>
                            {result.percentage >= 80 ? 'Excellent' : result.percentage >= 60 ? 'Good' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="ui-card overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">User</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Role</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Joined</th>
                    <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-surface border-border text-muted'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {editingUser && (
        <EditProfile 
          targetUser={editingUser} 
          onClose={() => setEditingUser(null)} 
        />
      )}
    </div>
  );
}
