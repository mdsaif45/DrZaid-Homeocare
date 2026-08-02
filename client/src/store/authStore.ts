import { create } from 'zustand';
import authService, { User, LoginCredentials, RegisterData } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

const initialUser = authService.getStoredUser();
const initialIsAuthenticated = !!(initialUser && authService.isAuthenticated());

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: initialIsAuthenticated,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: () => {
    const storedUser = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();

    if (storedUser && isAuthenticated) {
      set({ user: storedUser, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
