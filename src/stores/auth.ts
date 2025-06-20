import { defineStore } from 'pinia';
import authService from '@/services/authService';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated()
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },

    async logout() {
      authService.logout();
      this.clearUser();
    }
  }
}); 