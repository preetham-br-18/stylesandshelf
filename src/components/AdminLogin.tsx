import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft
} from 'lucide-react';
import { loginWithEmail } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both admin email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await loginWithEmail(email.trim(), password.trim());
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Access denied: Invalid administrator email or password.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not yet enabled in Firebase Authentication.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF3F4] via-[#FCF9F9] to-white">
      <div className="max-w-md w-full space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#8E3B52] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>
          <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">
            Style &amp; Shelf Secure Portal
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-rose-100 p-6 sm:p-8 relative overflow-hidden">
          {/* Top Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8E3B52] via-[#B85D75] to-[#8E3B52]" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#8E3B52] flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Admin Portal Login
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Restricted to authorized store administrators only
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5 text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  placeholder="Enter administrator email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20 focus:border-[#8E3B52] transition-colors"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20 focus:border-[#8E3B52] transition-colors"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#8E3B52] hover:bg-[#783145] active:bg-[#632737] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In to Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-rose-100 text-center">
            <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Sign-up is disabled. Accounts must be provisioned in Firebase Console.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
