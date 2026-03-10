import React, { useState, useEffect } from 'react';
import { Permit, Project } from '../types';
import { apiGetPermits, apiUpdatePermit } from '../services/apiService';

interface Props { project: Project; }

const PermitTracker: React.FC<Props> = ({ project }) => {
  const [permits, setPermits] = useState<(Permit & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiGetPermits(project.id);
        setPermits(data.permits.map((p: any) => ({
          id: p._id, name: p.name, status: p.status,
          agency: p.agency, renewalDate: p.renewalDate
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [project.id]);

  const statusCycle: Record<string, string> = { Pending: 'Applied', Applied: 'Approved', Approved: 'Pending' };

  const handleStatusUpdate = async (permit: Permit & { id: string }) => {
    const next = statusCycle[permit.status];
    try {
      await apiUpdatePermit(project.id, permit.id, { status: next });
      setPermits(prev => prev.map(p => p.id === permit.id ? { ...p, status: next as any } : p));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance Monitor</h2>
          <p className="text-slate-400">Avoid "Kanjo" shutdowns by staying compliant with Kenyan authorities.</p>
        </div>
        <button className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i> Check Local Laws
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
          {error} <button onClick={() => setError('')} className="ml-4 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <i className="fa-solid fa-circle-notch fa-spin text-blue-400 text-3xl"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {permits.map((permit) => (
            <div key={permit.id} className="glass p-6 rounded-2xl relative">
              <div className={`absolute top-0 right-0 w-2 h-full rounded-r-2xl ${permit.status === 'Approved' ? 'bg-emerald-500' : permit.status === 'Applied' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${permit.agency === 'NCA' ? 'bg-red-500/10 text-red-500' : permit.agency === 'NEMA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <i className={`fa-solid ${permit.agency === 'NCA' ? 'fa-building-shield' : permit.agency === 'NEMA' ? 'fa-leaf' : 'fa-landmark'}`}></i>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase">{permit.agency}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{permit.name}</h3>
              <div className="flex items-center justify-between mt-4 mb-4">
                <span className={`text-xs px-2 py-1 rounded-lg font-bold ${permit.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : permit.status === 'Applied' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {permit.status}
                </span>
                <span className="text-xs text-slate-500">{permit.renewalDate || 'In Progress'}</span>
              </div>
              <button onClick={() => handleStatusUpdate(permit)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg transition-all font-medium">
                Mark as {statusCycle[permit.status]}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="glass p-8 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="hidden md:flex w-24 h-24 bg-blue-600/20 rounded-full items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-halved text-blue-500 text-4xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Legal Shield Protection</h3>
            <p className="text-slate-400 mb-6 max-w-2xl">Our AI constantly monitors Nairobi, Kajiado, and Machakos county gazettes for new building code updates. We notify you before inspections happen.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-slate-950 px-6 py-3 rounded-xl font-bold transition-all hover:bg-slate-200">Talk to a Consultant</button>
              <button className="bg-slate-800 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition-all hover:border-slate-500">View Official Documents</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermitTracker;