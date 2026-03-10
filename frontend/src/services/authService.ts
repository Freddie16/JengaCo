import { apiLogin, apiRegister, apiGetMe, setToken, removeToken, getToken } from './apiService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Homeowner' | 'Contractor' | 'Diaspora';
}

export const mockLogin = async (email: string, password: string): Promise<User> => {
  const data = await apiLogin(email, password);
  setToken(data.token);
  return data.user;
};

export const mockSignup = async (formData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}): Promise<User> => {
  const data = await apiRegister(formData);
  setToken(data.token);
  return data.user;
};

export const logout = () => {
  removeToken();
};

export const getStoredUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;
  try {
    const data = await apiGetMe();
    return data.user;
  } catch {
    removeToken();
    return null;
  }
};