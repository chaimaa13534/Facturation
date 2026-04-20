import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'ADMIN' ou 'USER'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
       
        const roleRef = ref(db, `users/${user.uid}/role`);
        const snapshot = await get(roleRef);
        if (snapshot.exists()) {
          setUserRole(snapshot.val());
        } else {
          setUserRole('USER');
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const value = { currentUser, userRole, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};