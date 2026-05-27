import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  loginWithGoogle,
} from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "agrogreen_auth";

function getStoredAuthData() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return null;
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Invalid stored auth data:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function setStoredAuthData(authData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
}

function clearStoredAuthData() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => getStoredAuthData());
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const token = authData?.token || null;
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setInitializing(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading current user:", error);
        clearStoredAuthData();
        setAuthData(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    setStoredAuthData(response);
    setAuthData(response);

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return response;
  };

  const register = async (registerData) => {
    const response = await registerUser(registerData);

    setStoredAuthData(response);
    setAuthData(response);

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return response;
  };

  const googleLogin = async (credential) => {
    const response = await loginWithGoogle(credential);

    setStoredAuthData(response);
    setAuthData(response);

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return response;
  };

  const logout = () => {
    clearStoredAuthData();
    setAuthData(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      authData,
      token,
      user,
      initializing,
      isAuthenticated,
      login,
      register,
      googleLogin,
      logout,
    }),
    [authData, token, user, initializing, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}