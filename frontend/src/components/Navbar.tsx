
import React from 'react';
import { User } from '../services/authService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'ledger', label: 'Material Ledger', icon: 'fa-boxes-stacked' },
    { id: 'milestones', label: 'Escrow & Milestones', icon: 'fa-shield-halved' },
    { id: 'permits', label: 'Permit Tracker', icon: 'fa-file-signature' },
    { id: 'fundis', label: 'Find Fundis', icon: 'fa-user-group' },
    { id: 'marketplace', label: 'Store', icon: 'fa-store' },
  ];

  return (
    <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <i className="fa-solid fa-building-columns text-white text-xl"></i>
        </div>
        <span className="text-2xl font-bold tracking-tighter text-white">Jenga<span className="text-blue-500">Hub</span></span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'}`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 p-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`} alt="Avatar" className="w-10 h-10 rounded-lg object-cover" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
