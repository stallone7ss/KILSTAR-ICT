import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          // Sync user to Cloud SQL database
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
          }).catch((err) => console.error('Failed to sync user with database:', err));
        } catch (err) {
          console.error('Failed to get user ID token:', err);
          setToken(null);
        }
      } else {
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      }).catch((err) => console.error('Failed to sync user with database:', err));
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Sign-Out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
