'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useStore } from '../store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser, setIsLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        let role: 'student' | 'teacher' = user.email?.toLowerCase().includes('moe') ? 'teacher' : 'student';
        
        if (userSnap.exists()) {
          role = userSnap.data().role || role;
        } else {
          // Create new user in Firestore
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
            createdAt: new Date().toISOString(),
          });
        }

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role,
        });
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setIsLoading]);

  return <>{children}</>;
}
