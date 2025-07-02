export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
  avatar?: string;
  userType: 'donor' | 'ngo' | 'volunteer' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'donor' | 'ngo' | 'volunteer';
}

export interface ResetPasswordData {
  email: string;
}

export interface VerifyEmailData {
  token: string;
}