import { createContext, useContext, useMemo, useState } from "react";
import {
  clearStoredAuthData,
  getStoredAuthData,
  loginUser,
  registerUser,
  setStoredAuthData,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => getStoredAuthData());

  const isAuthenticated = Boolean(authData?.token);
  const isAdmin = authData?.role === "ADMIN";
  const isOperator = authData?.role === "OPERATOR";

  const hasRole = (role) => authData?.role === role;

  const hasAnyRole = (roles) => {
    return roles.includes(authData?.role);
    };

  const user = authData
    ? {
        id: authData.userId,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
      }
    : null;

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setStoredAuthData(response);
    setAuthData(response);
    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    setStoredAuthData(response);
    setAuthData(response);
    return response;
  };

  const logout = () => {
    clearStoredAuthData();
    setAuthData(null);
  };

  const value = useMemo(
  () => ({
    authData,
    user,
    isAuthenticated,
    isAdmin,
    isOperator,
    hasRole,
    hasAnyRole,
    login,
    register,
    logout,
  }),
  [authData, isAuthenticated, isAdmin, isOperator]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}