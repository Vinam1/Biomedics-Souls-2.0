import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin' || user?.email === 'anderson2050eth@gmail.com';
  const isSuperAdmin = userProfile?.role === 'superadmin' || user?.email === 'anderson2050eth@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to profile changes in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ uid: firebaseUser.uid, ...docSnap.data() });
          } else {
            // Create initial profile if it doesn't exist
            const newProfile = {
              email: firebaseUser.email,
              name: firebaseUser.displayName?.split(' ')[0] || 'Usuario',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              role: firebaseUser.email === 'anderson2050eth@gmail.com' ? 'admin' : 'cliente',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile({ uid: firebaseUser.uid, ...newProfile });
          }
          setLoading(false);
          setIsAuthReady(true);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setLoading(false);
          setIsAuthReady(true);
        });

        return () => unsubProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAuthReady, isAdmin, isSuperAdmin }}>
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
