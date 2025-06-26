import axiosInstance from './axiosInstance';
import router from '@/router';

const API_URL = '/api/auth';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  email: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

class AuthService {
  constructor() {
    // Plus besoin des intercepteurs ici car gérés dans axiosInstance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        this.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, data);
      if (response.data.token) {
        this.setToken(response.data.token);
        console.log(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log(localStorage.getItem('token'));
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data.message || 'Une erreur est survenue');
    } else if (error.request) {
      return new Error('Pas de réponse du serveur');
    } else {
      return new Error('Erreur de configuration de la requête');
    }
  }
}

export default new AuthService();
