const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token helpers
export const getToken = (): string | null => localStorage.getItem('jenga_token');
export const setToken = (token: string) => localStorage.setItem('jenga_token', token);
export const removeToken = () => localStorage.removeItem('jenga_token');

// Base fetch wrapper
const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const apiLogin = (email: string, password: string) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiRegister = (payload: {
  name: string; email: string; password: string; phone?: string; role?: string;
}) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });

export const apiGetMe = () => apiFetch('/auth/me');

// ─── Projects ─────────────────────────────────────────────────────────────────
export const apiGetProjects = () => apiFetch('/projects');
export const apiGetProject = (id: string) => apiFetch(`/projects/${id}`);
export const apiCreateProject = (data: object) =>
  apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateProject = (id: string, data: object) =>
  apiFetch(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const apiDeleteProject = (id: string) =>
  apiFetch(`/projects/${id}`, { method: 'DELETE' });

// ─── Materials ────────────────────────────────────────────────────────────────
export const apiGetMaterials = (projectId: string) =>
  apiFetch(`/projects/${projectId}/materials`);
export const apiCreateMaterial = (projectId: string, data: object) =>
  apiFetch(`/projects/${projectId}/materials`, { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateMaterial = (projectId: string, materialId: string, data: object) =>
  apiFetch(`/projects/${projectId}/materials/${materialId}`, { method: 'PATCH', body: JSON.stringify(data) });
export const apiDeleteMaterial = (projectId: string, materialId: string) =>
  apiFetch(`/projects/${projectId}/materials/${materialId}`, { method: 'DELETE' });

// ─── Milestones ───────────────────────────────────────────────────────────────
export const apiGetMilestones = (projectId: string) =>
  apiFetch(`/projects/${projectId}/milestones`);
export const apiCreateMilestone = (projectId: string, data: object) =>
  apiFetch(`/projects/${projectId}/milestones`, { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateMilestone = (projectId: string, milestoneId: string, data: object) =>
  apiFetch(`/projects/${projectId}/milestones/${milestoneId}`, { method: 'PATCH', body: JSON.stringify(data) });
export const apiDeleteMilestone = (projectId: string, milestoneId: string) =>
  apiFetch(`/projects/${projectId}/milestones/${milestoneId}`, { method: 'DELETE' });

// ─── Fundis ───────────────────────────────────────────────────────────────────
export const apiGetFundis = (params?: { search?: string; category?: string }) => {
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return apiFetch(`/fundis${qs}`);
};
export const apiCreateFundi = (data: object) =>
  apiFetch('/fundis', { method: 'POST', body: JSON.stringify(data) });

// ─── Permits ──────────────────────────────────────────────────────────────────
export const apiGetPermits = (projectId: string) =>
  apiFetch(`/projects/${projectId}/permits`);
export const apiUpdatePermit = (projectId: string, permitId: string, data: object) =>
  apiFetch(`/projects/${projectId}/permits/${permitId}`, { method: 'PATCH', body: JSON.stringify(data) });

// ─── Activity ─────────────────────────────────────────────────────────────────
export const apiGetActivity = (projectId: string, limit = 10) =>
  apiFetch(`/projects/${projectId}/activity?limit=${limit}`);