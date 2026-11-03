import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getMyPermissions } from "../api/permissions";
import type { EntityPermission } from "../api/permissions";
import { AuthContext } from "./context";
import type { AuthUser, PermissionAction } from "./types";

const decodeToken = (token: string): AuthUser => {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    userId: payload.userId,
    employeeId: payload.employeeId,
    role: payload.role,
  };
};

const getStoredToken = () => localStorage.getItem("token");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = getStoredToken();
    return storedToken ? decodeToken(storedToken) : null;
  });
  const [permissions, setPermissions] = useState<EntityPermission[]>([]);
  const isLoading = false;

  const refreshPermissions = async () => {
    try {
      const data = await getMyPermissions();

      if (!Array.isArray(data)) {
        console.error("Permissions API returned an invalid payload", data);
        setPermissions([]);
        return;
      }

      setPermissions(data);
    } catch (permissionError) {
      console.error("Failed to fetch permissions", permissionError);
      setPermissions([]);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    const loadPermissions = async () => {
      try {
        const data = await getMyPermissions();

        if (!Array.isArray(data)) {
          console.error("Permissions API returned an invalid payload", data);

          if (!isCancelled) {
            setPermissions([]);
          }

          return;
        }

        if (!isCancelled) {
          setPermissions(data);
        }
      } catch (permissionError) {
        console.error("Failed to fetch permissions", permissionError);

        if (!isCancelled) {
          setPermissions([]);
        }
      }
    };

    void loadPermissions();

    return () => {
      isCancelled = true;
    };
  }, [user]);

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
    setPermissions([]);
  };

  const hasPermission = (
    entityId: string,
    action: PermissionAction
  ): boolean => {
    if (user?.role === "admin" || user?.role === "manager") {
      return true;
    }

    if (!Array.isArray(permissions)) {
      return false;
    }

    const permission = permissions.find((item) => item.entityId === entityId);

    if (!permission) {
      return false;
    }

    if (permission.permission === "READ_WRITE") {
      return true;
    }

    return permission.permission === action;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        permissions,
        hasPermission,
        refreshPermissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
