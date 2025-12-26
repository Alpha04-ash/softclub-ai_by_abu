'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

interface EditProfileProps {
  onClose: () => void;
  targetUser?: { id: string; username: string; role: 'admin' | 'user' }; // If provided, editing this user (admin mode)
}

export default function EditProfile({ onClose, targetUser }: EditProfileProps) {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(targetUser?.username || user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isSelf = !targetUser || targetUser.id === user?.id;
  const editingUser = targetUser || user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser?.id,
          username,
          password: password || undefined,
          currentUsername: user?.username, // For auth check
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      if (isSelf) {
        updateProfile({ username });
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-md p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isSelf ? 'Edit Profile' : `Edit User: ${editingUser?.username}`}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-lg font-medium text-success">Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md text-sm text-error">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                New Password <span className="text-muted font-normal">(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                minLength={3}
              />
            </div>

            {password && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background border rounded-md focus:ring-2 outline-none transition-all ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-error focus:ring-error/50 focus:border-error'
                      : 'border-border focus:ring-primary/50 focus:border-primary'
                  }`}
                  required
                />
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
