import { createContext, useEffect, useState } from "react";

/* ===== Types ===== */

export type UserRole = "admin" | "manager" | "user";

export interface AuthUser {
  userId: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

/* ===== Context ===== */

export const AuthContext = createContext<AuthContextType | null>(null);

/* ===== Helper ===== */

const decodeToken = (token: string): AuthUser => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return {
    userId: payload.userId,
    role: payload.role,
  };
};

/* ===== Provider ===== */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 🔑 NEW

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      setToken(storedToken);
      setUser(decodedUser);
    }

    setIsLoading(false); // 🔑 auth restore complete
  }, []);

  const login = (jwtToken: string) => {
    const decodedUser = decodeToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
