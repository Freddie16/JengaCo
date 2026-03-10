import React, { useState, useEffect, useCallback } from 'react';
import { Fundi } from '../types';
import { apiGetFundis, apiCreateFundi } from '../services/apiService';

const FundiDirectory: React.FC = () => {
  const [fundis, setFundis] = useState<Fundi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', category: 'Mason', phone: '', location: '', bio: '' });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  const loadFundis = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      const data = await apiGetFundis(params);
      setFundis(data.fundis.map((f: any) => ({
        id: f._id, name: f.name, category: f.category,
        rating: f.rating, reviews: f.reviews, verified: f.verified,
        avatar: f.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=1e3a5f&color=fff`
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => loadFundis(), 300);
    return () => clearTimeout(timer);
  }, [loadFundis]);

  const handleRegister = async () => {
    if (!registerData.name || !registerData.category) return;
    setRegistering(true);
    try {
      const data = await apiCreateFundi(registerData);
      const f = data.fundi;
      setFundis(prev => [{
        id: f._id, name: f.name, category: f.category,
        rating: f.rating, reviews: f.reviews, verified: f.verified,
        avatar: f.avatar
      }, ...prev]);
      setShowRegisterForm(false);
      setRegisterData({ name: '', category: 'Mason', phone: '', location: '', bio: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  const categories = ['Plumber', 'Electrician', 'Mason', 'Foreman'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Verified "Fundi" Network</h2>
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input type="text" placeholder="Search plumbers, masons..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
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
          {fundis.length === 0 ? (
            <div className="col-span-4 text-center py-12 text-slate-500">No fundis found. Try a different search.</div>
          ) : fundis.map((fundi) => (
            <div key={fundi.id} className="glass p-6 rounded-3xl group hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="relative mb-4">
                <img src={fundi.avatar} className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-slate-800 group-hover:ring-blue-500/30 transition-all" alt={fundi.name} />
                {fundi.verified && (
                  <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-blue-600 text-white p-1 rounded-full border-2 border-slate-950">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">{fundi.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-3">{fundi.category}</p>
                <div className="flex items-center justify-center gap-1 mb-6">
                  <i className="fa-solid fa-star text-amber-400 text-sm"></i>
                  <span className="text-white font-bold text-sm">{fundi.rating > 0 ? fundi.rating.toFixed(1) : 'New'}</span>
                  {fundi.reviews > 0 && <span className="text-slate-500 text-xs">({fundi.reviews} reviews)</span>}
                </div>
                <button className="w-full bg-slate-800 text-white group-hover:bg-blue-600 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  Hire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
            <button onClick={() => setShowRegisterForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Register as Fundi</h3>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Kamau' },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 712 345 678' },
                { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Nairobi, Westlands' },
                { key: 'bio', label: 'Short Bio', type: 'text', placeholder: '5 years experience in...' }
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{label}</label>
                  <input type={type} placeholder={placeholder} value={(registerData as any)[key]}
                    onChange={e => setRegisterData({...registerData, [key]: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Category</label>
                <select value={registerData.category} onChange={e => setRegisterData({...registerData, category: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleRegister} disabled={registering || !registerData.name}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-bold text-white transition-all mt-2">
                {registering ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Are you a skilled Fundi?</h3>
            <p className="text-slate-400 mb-6">Join our verified network and get high-quality project leads from homeowners across Kenya and the Diaspora.</p>
            <button onClick={() => setShowRegisterForm(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-blue-900/30 hover:bg-blue-700 transition-all">
              Register as Contractor
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl font-black text-white">{fundis.length}+</p>
              <p className="text-xs text-slate-500 uppercase font-bold">Listed Fundis</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl font-black text-white">KES 12M+</p>
              <p className="text-xs text-slate-500 uppercase font-bold">Earned Monthly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundiDirectory;