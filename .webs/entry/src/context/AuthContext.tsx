"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export type AdminRole = "super-admin" | "admin" | "none";

interface AuthContextType {
  user: User | null;
  role: AdminRole;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "none",
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole>("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser && currentUser.email) {
        setUser(currentUser);
        const email = currentUser.email.toLowerCase();

        // 1. Hardcoded Super Admin check
        if (email === "hello@dotfreelancer.in") {
          setRole("super-admin");
        } else {
          // 2. Standard Admin Firestore database check
          try {
            const docRef = doc(db, "admin_access", email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setRole("admin");
            } else {
              setRole("none");
            }
          } catch (error) {
            console.error("Error checking admin privileges:", error);
            setRole("none");
          }
        }
      } else {
        setUser(null);
        setRole("none");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force select account to prevent stuck login loop
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In failed:", error);
      alert("Google Sign-In failed: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
