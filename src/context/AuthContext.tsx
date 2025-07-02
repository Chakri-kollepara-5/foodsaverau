import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, enableNetwork } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { sendWelcomeEmail } from '../config/emailjs';
import toast from 'react-hot-toast';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  userType: 'donor' | 'ngo' | 'volunteer' | 'admin';
  phone?: string;
  location?: string;
  organizationName?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  userType: 'donor' | 'ngo' | 'volunteer';
  phone?: string;
  location?: string;
  organizationName?: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
    if (!firebaseUser) return null;

    try {
      // Ensure network is enabled
      await enableNetwork(db);
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { displayName, email, photoURL, emailVerified } = firebaseUser;
        const createdAt = new Date().toISOString();

        await setDoc(userRef, {
          displayName: displayName || '',
          email: email || '',
          photoURL: photoURL || '',
          emailVerified,
          createdAt,
          userType: additionalData?.userType || 'donor',
          phone: additionalData?.phone || '',
          location: additionalData?.location || '',
          organizationName: additionalData?.organizationName || '',
        });
      }

      return getUserDocument(firebaseUser.uid);
    } catch (error: any) {
      console.error('Error creating user document:', error);
      
      // If Firestore is offline, create a fallback user object
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          userType: additionalData?.userType || 'donor',
          phone: additionalData?.phone || '',
          location: additionalData?.location || '',
          organizationName: additionalData?.organizationName || '',
          createdAt: new Date().toISOString(),
        } as User;
      }
      
      throw error;
    }
  };

  const getUserDocument = async (uid: string): Promise<User | null> => {
    try {
      // Ensure network is enabled
      await enableNetwork(db);
      
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          uid,
          email: userData.email || '',
          displayName: userData.displayName || '',
          photoURL: userData.photoURL,
          emailVerified: userData.emailVerified || false,
          userType: userData.userType || 'donor',
          phone: userData.phone,
          location: userData.location,
          organizationName: userData.organizationName,
          createdAt: userData.createdAt || new Date().toISOString(),
        };
      }
      return null;
    } catch (error: any) {
      console.error('Error getting user document:', error);
      
      // If offline, return null and let the auth state handler create a fallback
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Firestore is offline, user document unavailable');
        return null;
      }
      
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const user = await getUserDocument(firebaseUser.uid);
      
      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        toast.success('Welcome back! Login successful');
      } else {
        // Create fallback user if document doesn't exist
        const fallbackUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          userType: 'donor',
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'AUTH_SUCCESS', payload: fallbackUser });
        toast.success('Welcome back! Login successful');
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : error.message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      await updateProfile(firebaseUser, {
        displayName: userData.displayName,
      });

      const user = await createUserDocument(firebaseUser, {
        userType: userData.userType,
        phone: userData.phone,
        location: userData.location,
        organizationName: userData.organizationName,
      });

      try {
        await sendEmailVerification(firebaseUser);
        await sendWelcomeEmail(userData.email, userData.displayName);
      } catch (emailError) {
        console.warn('Email services failed:', emailError);
        // Don't fail registration if email fails
      }

      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        toast.success('🎉 Account created successfully! Please check your email for verification.');
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email is already registered'
        : error.message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out');
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.message;
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success('Verification email sent!');
      } catch (error: any) {
        toast.error('Error sending verification email');
      }
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await getUserDocument(firebaseUser.uid);
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            // Create fallback user object if document doesn't exist
            const fallbackUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              userType: 'donor',
              createdAt: new Date().toISOString(),
            };
            dispatch({ type: 'AUTH_SUCCESS', payload: fallbackUser });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Create fallback user even if there's an error
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            userType: 'donor',
            createdAt: new Date().toISOString(),
          };
          dispatch({ type: 'AUTH_SUCCESS', payload: fallbackUser });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        resendVerification,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}