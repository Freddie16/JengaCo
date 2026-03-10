import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '../types';
import { apiGetActivity, apiGetMilestones, apiGetProject } from '../services/apiService';

interface DashboardProps {
  project: Project;
}

const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [spendingHistory, setSpendingHistory] = useState<any[]>([]);
  const [milestoneSummary, setMilestoneSummary] = useState({ completed: 0, total: 0 });
  const [budgetAllocation, setBudgetAllocation] = useState({ materials: 65, labor: 20, compliance: 10, miscellaneous: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [activityRes, milestonesRes, projectRes] = await Promise.all([
          apiGetActivity(project.id, 5),
          apiGetMilestones(project.id),
          apiGetProject(project.id)
        ]);

        setActivities(activityRes.activities || []);

        const milestones = milestonesRes.milestones || [];
        setMilestoneSummary({
          completed: milestones.filter((m: any) => m.status === 'Paid').length,
          total: milestones.length
        });

        if (projectRes.project?.spendingHistory?.length) {
          setSpendingHistory(projectRes.project.spendingHistory);
        }
        if (projectRes.project?.budgetAllocation) {
          setBudgetAllocation(projectRes.project.budgetAllocation);
        }
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [project.id]);

  const percentSpent = project.budget > 0 ? ((project.spent / project.budget) * 100).toFixed(1) : '0';
  const remaining = project.budget - project.spent;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <i className="fa-solid fa-wallet text-blue-500"></i>
            </div>
            <span className={`text-sm font-medium ${Number(percentSpent) < 70 ? 'text-green-500' : 'text-amber-500'}`}>
              {percentSpent}% used
            </span>
          </div>
          <h3 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Total Budget</h3>
          <p className="text-2xl font-bold text-white">KES {project.budget.toLocaleString()}</p>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-red-500/50">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-500/10 p-3 rounded-xl">
              <i className="fa-solid fa-money-bill-trend-up text-red-500"></i>
            </div>
          </div>
          <h3 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Total Spent</h3>
          <p className="text-2xl font-bold text-white">KES {project.spent.toLocaleString()}</p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl">
              <i className="fa-solid fa-circle-check text-emerald-500"></i>
            </div>
          </div>
          <h3 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Milestones</h3>
          <p className="text-2xl font-bold text-white">
            {loading ? '—' : `${milestoneSummary.completed}/${milestoneSummary.total}`}
          </p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <i className="fa-solid fa-clock text-amber-500"></i>
            </div>
          </div>
          <h3 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Est. Completion</h3>
          <p className="text-2xl font-bold text-white">
            {project.completionDate ? new Date(project.completionDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'TBD'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Spending Trends</h2>
          </div>
          <div className="h-64">
            {spendingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingHistory}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v: number) => `KES ${v.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="budget" stroke="#10b981" fillOpacity={1} fill="url(#colorBudget)" strokeWidth={2} strokeDasharray="5 5" name="Budget" />
                  <Area type="monotone" dataKey="spent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpent)" strokeWidth={3} name="Spent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>No spending data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Budget Allocation</h2>
          <div className="space-y-4">
            {[
              { label: 'Materials', key: 'materials', color: 'bg-blue-500' },
              { label: 'Labor', key: 'labor', color: 'bg-emerald-500' },
              { label: 'Compliance & Fees', key: 'compliance', color: 'bg-amber-500' },
              { label: 'Miscellaneous', key: 'miscellaneous', color: 'bg-slate-600' }
            ].map(({ label, key, color }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{budgetAllocation[key as keyof typeof budgetAllocation]}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full`} style={{ width: `${budgetAllocation[key as keyof typeof budgetAllocation]}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <p className="text-sm text-slate-300">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
              {remaining > 0
                ? `KES ${remaining.toLocaleString()} remaining in budget.`
                : `Over budget by KES ${Math.abs(remaining).toLocaleString()}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <i className="fa-solid fa-circle-notch fa-spin text-blue-400 text-2xl"></i>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-slate-500 text-center py-6">No activity yet for this project.</p>
        ) : (
          <div className="space-y-6">
            {activities.map((a: any) => (
              <div key={a._id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${a.icon || 'fa-circle-info'} ${a.iconColor || 'text-blue-400'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-medium">{a.title}</h4>
                    <span className="text-xs text-slate-500">{timeAgo(a.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;