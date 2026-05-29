import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/api/users/me');
      set({ user: data });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
