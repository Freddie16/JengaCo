import React, { useState, useEffect } from 'react';
import { Milestone, Project } from '../types';
import { apiGetMilestones, apiUpdateMilestone, apiCreateMilestone } from '../services/apiService';

interface Props { project: Project; }

const MilestoneEscrow: React.FC<Props> = ({ project }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalEscrow, setTotalEscrow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal'>('mpesa');
  const [paymentInput, setPaymentInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', cost: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const data = await apiGetMilestones(project.id);
      setMilestones(data.milestones.map((m: any) => ({
        id: m._id, title: m.title, description: m.description,
        cost: m.cost, status: m.status, photoProof: m.photoProof
      })));
      setTotalEscrow(data.totalEscrow || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMilestones(); }, [project.id]);

  const handleStatusUpdate = async (milestone: Milestone, status: string) => {
    try {
      await apiUpdateMilestone(project.id, milestone.id, { status });
      setMilestones(prev => prev.map(m => m.id === milestone.id ? { ...m, status: status as any } : m));
      if (status === 'Paid') {
        setTotalEscrow(prev => prev - milestone.cost);
        setShowPaymentModal(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title || !newMilestone.description || !newMilestone.cost) return;
    setSaving(true);
    try {
      const data = await apiCreateMilestone(project.id, {
        title: newMilestone.title,
        description: newMilestone.description,
        cost: Number(newMilestone.cost),
        order: milestones.length + 1
      });
      const m = data.milestone;
      setMilestones(prev => [...prev, { id: m._id, title: m.title, description: m.description, cost: m.cost, status: m.status, photoProof: m.photoProof }]);
      setTotalEscrow(prev => prev + m.cost);
      setNewMilestone({ title: '', description: '', cost: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Milestone-Based Escrow</h2>
          <p className="text-slate-400">Funds are held by JengaHub and released only upon your approval of the work.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-right">
          <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Currently In Escrow</p>
          <p className="text-2xl font-black text-white">KES {totalEscrow.toLocaleString()}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
          <button onClick={() => setError('')} className="ml-4 underline">Dismiss</button>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-white px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus text-blue-400"></i> Add Milestone
        </button>
      </div>

      {showAddForm && (
        <div className="glass p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <h3 className="text-lg font-bold text-white">New Milestone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
              <input type="text" placeholder="e.g. Roofing Structure" value={newMilestone.title}
                onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cost (KES)</label>
              <input type="number" placeholder="850000" value={newMilestone.cost}
                onChange={e => setNewMilestone({...newMilestone, cost: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label>
              <input type="text" placeholder="Describe the work to be done..." value={newMilestone.description}
                onChange={e => setNewMilestone({...newMilestone, description: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddForm(false)} className="py-2 px-5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
            <button onClick={handleAddMilestone} disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all">
              {saving ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}Save Milestone
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <i className="fa-solid fa-circle-notch fa-spin text-blue-400 text-3xl"></i>
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No milestones yet. Add your first one above.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
              {milestone.status === 'Paid' && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold uppercase">Completed</div>
              )}
              <div className="w-full md:w-64 shrink-0">
                {milestone.photoProof ? (
                  <img src={milestone.photoProof} alt="Proof" className="w-full h-40 object-cover rounded-xl border border-slate-800" />
                ) : (
                  <div className="w-full h-40 bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
                    <i className="fa-solid fa-image text-3xl mb-2"></i>
                    <span className="text-xs">No Proof Uploaded Yet</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                  <span className="text-blue-400 font-bold">KES {milestone.cost.toLocaleString()}</span>
                </div>
                <p className="text-slate-400 mb-4">{milestone.description}</p>
                <div className="flex flex-wrap gap-4">
                  {milestone.status === 'Pending' && (
                    <button onClick={() => handleStatusUpdate(milestone, 'Approved')}
                      className="bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 px-6 py-2 rounded-lg text-sm font-bold transition-all">
                      Mark as Approved
                    </button>
                  )}
                  {milestone.status === 'Approved' && (
                    <>
                      <button onClick={() => { setSelectedMilestone(milestone); setShowPaymentModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/40">
                        Release Payment
                      </button>
                      <button onClick={() => handleStatusUpdate(milestone, 'Pending')}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-6 py-2 rounded-lg text-sm font-bold transition-all">
                        Dispute Work
                      </button>
                    </>
                  )}
                  {milestone.status === 'Paid' && (
                    <button className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                      <i className="fa-solid fa-circle-check"></i> Funds Released to Contractor
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentModal && selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Release Funds</h3>
            <p className="text-slate-400 mb-6">You are authorizing the release of <span className="text-white font-bold">KES {selectedMilestone.cost.toLocaleString()}</span> to the main contractor.</p>
            <div className="space-y-4 mb-8">
              {(['mpesa', 'paypal'] as const).map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)}
                  className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${paymentMethod === method ? (method === 'mpesa' ? 'border-emerald-500 bg-emerald-500/5' : 'border-blue-500 bg-blue-500/5') : 'border-slate-800 hover:border-slate-700'}`}>
                  <div className={`w-12 h-12 ${method === 'mpesa' ? 'bg-emerald-500' : 'bg-blue-600'} rounded-xl flex items-center justify-center`}>
                    <i className={`fa-solid ${method === 'mpesa' ? 'fa-mobile-screen' : 'fa-credit-card'} text-white text-xl`}></i>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{method === 'mpesa' ? 'M-Pesa' : 'PayPal / Card'}</p>
                    <p className={`text-xs ${method === 'mpesa' ? 'text-emerald-500' : 'text-slate-400'}`}>{method === 'mpesa' ? 'Fast Kenyan Mobile Payment' : 'Best for Diaspora Users'}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold px-1">
                  {paymentMethod === 'mpesa' ? 'M-Pesa Number' : 'PayPal Email'}
                </label>
                <input type={paymentMethod === 'mpesa' ? 'tel' : 'email'}
                  placeholder={paymentMethod === 'mpesa' ? '0712 345 678' : 'user@example.com'}
                  value={paymentInput} onChange={e => setPaymentInput(e.target.value)}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none ${paymentMethod === 'mpesa' ? 'focus:border-emerald-500' : 'focus:border-blue-500'}`} />
              </div>
              <button
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg mt-4 transition-all ${paymentMethod === 'mpesa' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => handleStatusUpdate(selectedMilestone, 'Paid')}
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneEscrow;