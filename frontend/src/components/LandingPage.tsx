
import React, { useState } from 'react';
import AuthModal from './AuthModal';
import { User } from '../services/authService';

interface LandingPageProps {
  onAuthSuccess: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white scroll-smooth">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={onAuthSuccess} 
      />

      {/* Hero Section */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-building-columns text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold tracking-tighter">Jenga<span className="text-blue-500">Hub</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</button>
          <button onClick={() => scrollTo('pricing')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</button>
          <button onClick={() => scrollTo('diaspora')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Diaspora</button>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            Sign In
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold uppercase tracking-wider">
            Built for Kenya
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Build Your Home <br />
            <span className="text-gradient">Without the Chaos.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl">
            The #1 Construction management SaaS for Kenyan home builders. Stop material theft, track budgets in real-time, and manage your site from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-900/40 transform hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-lg font-bold transition-all hover:bg-slate-800">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-slate-950" />)}
            </div>
            <span>Join 2,500+ builders in Kenya</span>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -inset-4 bg-blue-600/20 blur-3xl rounded-full"></div>
          <div className="relative glass p-4 rounded-3xl border border-blue-500/20 shadow-2xl">
            <img src="https://picsum.photos/800/600?construction" className="rounded-2xl shadow-2xl" alt="Construction Site" />
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl border border-emerald-500/30 shadow-xl max-w-[200px] animate-bounce-slow">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span className="text-xs font-bold text-white">Verified Delivery</span>
              </div>
              <p className="text-sm font-black text-white">50 Bags of Cement</p>
              <p className="text-xs text-slate-500">Logged 5 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="bg-slate-900/30 py-24 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Builders Choose JengaHub</h2>
            <p className="text-slate-400">Localized tools designed for the unique Kenyan construction landscape.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl group hover:border-blue-500/50 transition-all">
              <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-2xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-boxes-stacked"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Material Ledger</h3>
              <p className="text-slate-400 leading-relaxed">Simply snap a photo of delivered materials. Our AI counts the bags and logs the cost automatically.</p>
            </div>
            <div className="glass p-8 rounded-3xl group hover:border-emerald-500/50 transition-all">
              <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Milestone Escrow</h3>
              <p className="text-slate-400 leading-relaxed">Pay into a secure vault. Funds are only released to contractors when you approve the photographic proof.</p>
            </div>
            <div id="diaspora" className="glass p-8 rounded-3xl group hover:border-amber-500/50 transition-all">
              <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 text-2xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Diaspora Premium</h3>
              <p className="text-slate-400 leading-relaxed">Special oversight features for Kenyans abroad. Get high-fidelity reports and local legal compliance tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Local Pricing</h2>
          <p className="text-slate-400">Pay as you build. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass p-10 rounded-3xl border border-slate-800">
            <h3 className="text-2xl font-bold mb-2">Standard Builder</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black">KES 2,500</span>
              <span className="text-slate-500">/ project month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                AI Material Ledger (Unlimited)
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                Milestone Escrow Vault
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                NCA/NEMA Compliance Tracker
              </li>
            </ul>
            <button onClick={() => setIsAuthModalOpen(true)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-white">
              Get Started
            </button>
          </div>
          <div className="glass p-10 rounded-3xl border-2 border-blue-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-widest">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Diaspora Premium</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black">KES 5,000</span>
              <span className="text-slate-500">/ project month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <i className="fa-solid fa-circle-check text-blue-500"></i>
                Everything in Standard
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <i className="fa-solid fa-circle-check text-blue-500"></i>
                Drone Site Visits (Optional Addon)
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <i className="fa-solid fa-circle-check text-blue-500"></i>
                Global Payment Support (PayPal/Stripe)
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <i className="fa-solid fa-circle-check text-blue-500"></i>
                Direct M-Pesa Fundi Disbursement
              </li>
            </ul>
            <button onClick={() => setIsAuthModalOpen(true)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40 text-white">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
