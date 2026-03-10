import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<ModalProps & { onProjectCreated: (name: string, location: string, budget: number) => void }> = ({ isOpen, onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass w-full max-w-md p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
        <p className="text-slate-400 text-sm mb-6">Start tracking a new construction site in minutes.</p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Project Name</label>
            <input 
              type="text" 
              placeholder="e.g. Syokimau Rental Units"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Site Location</label>
            <input 
              type="text" 
              placeholder="e.g. Ruai, Bypass Area"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Total Budget (KES)</label>
            <input 
              type="number" 
              placeholder="e.g. 4500000"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onProjectCreated(projectName, location, Number(budget) || 0)}
              disabled={!projectName}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-900/20"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UpgradeModal: React.FC<ModalProps & { userRole: string }> = ({ isOpen, onClose, userRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass w-full max-w-2xl p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-slate-400">Unlock professional tools for site oversight and compliance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${userRole === 'Homeowner' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800'}`}>
            <h3 className="text-xl font-bold text-white mb-1">Standard Builder</h3>
            <p className="text-blue-400 text-2xl font-black mb-4">KES 2,500 <span className="text-xs text-slate-500 font-normal">/mo</span></p>
            <ul className="space-y-2 text-sm text-slate-400 mb-8">
              <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>AI Material Tracking</li>
              <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>Milestone Escrow</li>
              <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>NCA Permit Alerts</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white transition-all">
              {userRole === 'Homeowner' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>
          
          <div className={`p-6 rounded-2xl border-2 ${userRole === 'Diaspora' ? 'border-blue-500 bg-blue-500/5' : 'border-amber-500/50 bg-amber-500/5'}`}>
            <h3 className="text-xl font-bold text-white mb-1">Diaspora Premium</h3>
            <p className="text-amber-500 text-2xl font-black mb-4">KES 5,000 <span className="text-xs text-slate-500 font-normal">/mo</span></p>
            <ul className="space-y-2 text-sm text-slate-400 mb-8">
              <li><i className="fa-solid fa-check text-amber-500 mr-2"></i>Everything in Standard</li>
              <li><i className="fa-solid fa-check text-amber-500 mr-2"></i>Remote Legal Support</li>
              <li><i className="fa-solid fa-check text-amber-500 mr-2"></i>Drone Site Inspections</li>
              <li><i className="fa-solid fa-check text-amber-500 mr-2"></i>Direct M-Pesa Payouts</li>
            </ul>
            <button 
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${userRole === 'Diaspora' ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'}`}
            >
              {userRole === 'Diaspora' ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};