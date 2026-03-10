import React, { useState } from 'react';
import { mockLogin, mockSignup, User } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Homeowner'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await mockLogin(formData.email, formData.password);
      } else {
        user = await mockSignup(formData);
      }
      onAuthSuccess(user);
    } catch (error) {
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative border border-blue-500/20">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/40">
            <i className="fa-solid fa-building-columns text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join JengaHub'}
          </h2>
          <p className="text-slate-400 mt-2">
            {isLogin ? 'Manage your construction from anywhere' : 'The smarter way to build in Kenya'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Full Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g. David Karanja"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Email Address</label>
            <input
              required
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Phone Number (M-Pesa)</label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="+254 712 345 678"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Password</label>
            <input
              required
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">I am a...</label>
              <select
                name="role"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all appearance-none"
                onChange={handleChange}
              >
                <option value="Homeowner">Homeowner (Local)</option>
                <option value="Diaspora">Homeowner (Diaspora)</option>
                <option value="Contractor">Contractor / Foreman</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg mt-4 shadow-xl shadow-blue-900/30 transition-all transform hover:-translate-y-1"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;