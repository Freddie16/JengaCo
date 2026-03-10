import React, { useState, useEffect } from 'react';
import { analyzeMaterialPhoto } from '../services/geminiService';
import { MaterialLog, Project } from '../types';
import { apiGetMaterials, apiCreateMaterial, apiUpdateMaterial, apiDeleteMaterial } from '../services/apiService';

interface MaterialLedgerProps {
  project: Project;
}

const MaterialLedger: React.FC<MaterialLedgerProps> = ({ project }) => {
  const [logs, setLogs] = useState<MaterialLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ item: '', quantity: '', unit: 'Bags', cost: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await apiGetMaterials(project.id);
      setLogs(data.materials.map((m: any) => ({
        id: m._id,
        date: m.date,
        item: m.item,
        quantity: m.quantity,
        unit: m.unit,
        cost: m.cost,
        verified: m.verified,
        photoUrl: m.photoUrl
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMaterials(); }, [project.id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const result = await analyzeMaterialPhoto(base64String);
      setIsAnalyzing(false);
      if (result) {
        try {
          const data = await apiCreateMaterial(project.id, {
            item: result.item || 'Unknown Material',
            quantity: result.quantity || 1,
            unit: 'Units',
            cost: result.cost || 0,
            date: new Date().toISOString().split('T')[0],
            verified: false,
            photoUrl: reader.result as string
          });
          setLogs(prev => [{ id: data.material._id, ...data.material }, ...prev]);
        } catch (err: any) {
          setError(err.message);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualAdd = async () => {
    if (!formData.item || !formData.quantity || !formData.cost) return;
    setSaving(true);
    try {
      const data = await apiCreateMaterial(project.id, {
        item: formData.item,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        cost: Number(formData.cost),
        date: new Date().toISOString().split('T')[0],
        verified: false
      });
      setLogs(prev => [{ id: data.material._id, ...data.material }, ...prev]);
      setFormData({ item: '', quantity: '', unit: 'Bags', cost: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (log: MaterialLog) => {
    try {
      await apiUpdateMaterial(project.id, log.id, { verified: !log.verified });
      setLogs(prev => prev.map(l => l.id === log.id ? { ...l, verified: !l.verified } : l));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material log?')) return;
    try {
      await apiDeleteMaterial(project.id, id);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Digital Material Ledger</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus text-blue-400"></i> Add Manually
          </button>
          <div className="relative">
            <input type="file" id="site-photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
            <label
              htmlFor="site-photo"
              className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40 ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isAnalyzing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-camera"></i>}
              {isAnalyzing ? 'AI Analysing...' : 'Upload Photo'}
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
          <button onClick={() => setError('')} className="ml-4 underline">Dismiss</button>
        </div>
      )}

      {showAddForm && (
        <div className="glass p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <h3 className="text-lg font-bold text-white">Log New Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Material / Item</label>
              <input type="text" placeholder="e.g. Bamburi Cement" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quantity</label>
              <input type="number" placeholder="50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Unit</label>
              <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                {['Bags', 'Lorry', 'Pieces', 'Tonnes', 'Litres', 'Units'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Total Cost (KES)</label>
              <input type="number" placeholder="37500" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddForm(false)} className="py-2 px-5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
            <button onClick={handleManualAdd} disabled={saving || !formData.item || !formData.quantity || !formData.cost}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all">
              {saving ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
              Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="p-4 text-slate-400 font-medium text-sm">Date</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Item Description</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Quantity</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Total Cost (KES)</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">
                  <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading materials...
                </td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No material logs yet. Add your first entry above.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300">{log.date}</td>
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      {log.photoUrl && <img src={log.photoUrl} className="w-8 h-8 rounded object-cover border border-slate-700" alt="Material" />}
                      {log.item}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{log.quantity} {log.unit}</td>
                  <td className="p-4 font-bold text-white">{log.cost.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {log.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <button onClick={() => handleVerify(log)} className={`text-xs font-medium ${log.verified ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'}`}>
                      {log.verified ? 'Unverify' : 'Verify'}
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            {logs.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900/50 border-t border-slate-800">
                  <td colSpan={3} className="p-4 text-slate-400 font-bold text-sm">Total Spent on Materials</td>
                  <td className="p-4 font-black text-white">KES {totalCost.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-white mb-2">AI Cost Analysis</h3>
          <p className="text-slate-400 text-sm mb-4">Gemini detects your materials and compares with current hardware store rates in Kenya.</p>
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-brain text-blue-500"></i>
            </div>
            <div>
              <p className="text-white font-medium">Upload a receipt photo</p>
              <p className="text-xs text-slate-500">AI will auto-detect materials and log them.</p>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
          <h3 className="text-lg font-bold text-white mb-2">Ledger Summary</h3>
          <p className="text-slate-400 text-sm mb-4">Current material spend for this project.</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-emerald-500/10 p-3 rounded-xl text-center">
              <p className="text-xs text-slate-400 uppercase">Verified</p>
              <p className="text-xl font-bold text-emerald-400">{logs.filter(l => l.verified).length}</p>
            </div>
            <div className="flex-1 bg-amber-500/10 p-3 rounded-xl text-center">
              <p className="text-xs text-slate-400 uppercase">Pending</p>
              <p className="text-xl font-bold text-amber-400">{logs.filter(l => !l.verified).length}</p>
            </div>
            <div className="flex-1 bg-blue-500/10 p-3 rounded-xl text-center">
              <p className="text-xs text-slate-400 uppercase">Total Entries</p>
              <p className="text-xl font-bold text-blue-400">{logs.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialLedger;