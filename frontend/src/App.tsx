import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MaterialLedger from './components/MaterialLedger';
import FundiDirectory from './components/FundiDirectory';
import PermitTracker from './components/PermitTracker';
import MilestoneEscrow from './components/MilestoneEscrow';
import AIAssistant from './components/AIAssistant';
import LandingPage from './components/LandingPage';
import { NewProjectModal, UpgradeModal } from './components/ActionModals';
import { Project, ProjectStatus } from './types';
import { User, getStoredUser, logout } from './services/authService';
import { apiGetProjects, apiCreateProject } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = await getStoredUser();
      if (storedUser) setUser(storedUser);
      setAuthLoading(false);
    };
    checkSession();
  }, []);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    setProjectsLoading(true);
    try {
      const data = await apiGetProjects();
      const mapped: Project[] = data.projects.map((p: any) => ({
        id: p._id,
        name: p.name,
        location: p.location,
        budget: p.budget,
        spent: p.spent,
        status: p.status as ProjectStatus,
        completionDate: p.completionDate || ''
      }));
      setProjects(mapped);
      if (mapped.length > 0) setSelectedProject(mapped[0]);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setProjectsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleSetTab = (tab: string) => {
    if (tab !== activeTab) {
      setNavigationHistory(prev => [...prev, tab]);
      setActiveTab(tab);
    }
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      setNavigationHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setProjects([]);
    setSelectedProject(null);
    setNavigationHistory(['dashboard']);
    setActiveTab('dashboard');
  };

  const handleProjectCreated = async (name: string, location: string, budget: number) => {
    try {
      const data = await apiCreateProject({ name, location, budget, status: 'Planning', completionDate: '' });
      const newProject: Project = {
        id: data.project._id,
        name: data.project.name,
        location: data.project.location,
        budget: data.project.budget,
        spent: 0,
        status: ProjectStatus.PLANNING,
        completionDate: ''
      };
      setProjects(prev => [newProject, ...prev]);
      setSelectedProject(newProject);
      setShowNewProjectModal(false);
      setActiveTab('dashboard');
    } catch (err: any) {
      alert('Failed to create project: ' + err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fa-solid fa-building-columns text-white text-2xl"></i>
          </div>
          <p className="text-slate-400">Loading JengaHub...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LandingPage onAuthSuccess={setUser} />;

  const renderContent = () => {
    if (projectsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <i className="fa-solid fa-circle-notch fa-spin text-blue-400 text-3xl"></i>
        </div>
      );
    }
    if (!selectedProject) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center">
            <i className="fa-solid fa-folder-open text-slate-500 text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">No Projects Yet</h3>
            <p className="text-slate-400 mb-4">Create your first project to get started.</p>
            <button onClick={() => setShowNewProjectModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
              <i className="fa-solid fa-plus mr-2"></i> Create Project
            </button>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard': return <Dashboard project={selectedProject} />;
      case 'ledger': return <MaterialLedger project={selectedProject} />;
      case 'fundis': return <FundiDirectory />;
      case 'permits': return <PermitTracker project={selectedProject} />;
      case 'milestones': return <MilestoneEscrow project={selectedProject} />;
      default: return <Dashboard project={selectedProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={handleSetTab} onLogout={handleLogout} user={user} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {activeTab !== 'dashboard' && (
              <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 transition-all border border-slate-700 group" title="Go Back">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {activeTab === 'dashboard' ? (selectedProject?.name || 'Dashboard') : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h1>
              {selectedProject && (
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  <i className="fa-solid fa-location-dot text-blue-500"></i> {selectedProject.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {projects.length > 1 && (
              <select
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                value={selectedProject?.id || ''}
                onChange={(e) => { const found = projects.find(p => p.id === e.target.value); if (found) setSelectedProject(found); }}
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
            <button onClick={() => setShowNewProjectModal(true)} className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 text-white">
              <i className="fa-solid fa-plus text-blue-400"></i> <span className="hidden sm:inline">New Project</span>
            </button>
            <button onClick={() => setShowUpgradeModal(true)} className="bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 text-blue-400">
              <i className="fa-solid fa-crown text-amber-300"></i> <span className="hidden sm:inline">Upgrade</span>
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1"></div>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 p-2.5 rounded-lg text-red-400 transition-all flex items-center gap-2 text-sm font-bold">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">{renderContent()}</div>
      </main>
      {selectedProject && <AIAssistant project={selectedProject} />}
      <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} onProjectCreated={handleProjectCreated} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} userRole={user.role} />
    </div>
  );
};

export default App;