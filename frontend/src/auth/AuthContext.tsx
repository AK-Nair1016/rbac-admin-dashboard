import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMyPermissions } from "../api/permissions";

/* ===== Types ===== */

export type UserRole = "admin" | "manager" | "user";
export type PermissionAction = "READ" | "WRITE";
export type PermissionType = "READ" | "WRITE" | "READ_WRITE";

export interface AuthUser {
  userId: string;
  employeeId: string;
  role: UserRole;
}

export interface EntityPermission {
  entityId: string;
  permission: PermissionType;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  permissions: EntityPermission[];
  hasPermission: (
    entityId: string,
    action: PermissionAction
  ) => boolean;
  refreshPermissions: () => Promise<void>;
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
    employeeId: payload.employeeId,
    role: payload.role,
  };
};

/* ===== Provider ===== */

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<EntityPermission[]>([]);

  /* ---- Load token on boot ---- */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      setToken(storedToken);
      setUser(decodedUser);
    }

    setIsLoading(false);
  }, []);

  /* ---- Load permissions when user changes ---- */
  useEffect(() => {
    if (!user) {
      setPermissions([]);
      return;
    }

    refreshPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ---- Permission fetch ---- */
  const refreshPermissions = async () => {
    try {
      const data = await getMyPermissions();

      if (!Array.isArray(data)) {
        console.error(
          "❌ Permissions API returned invalid payload:",
          data
        );
        setPermissions([]);
        return;
      }

      setPermissions(data);
    } catch (error) {
      console.error("❌ Failed to fetch permissions:", error);
      setPermissions([]);
    }
  };

  /* ---- Auth actions ---- */
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

  /* ---- Permission check ---- */
  const hasPermission = (
    entityId: string,
    action: PermissionAction
  ): boolean => {
    // ✅ HARD OVERRIDE
    if (
      user?.role === "admin" ||
      user?.role === "manager"
    ) {
      return true;
    }

    if (!Array.isArray(permissions)) {
      return false;
    }

    const perm = permissions.find(
      (p) => p.entityId === entityId
    );

    if (!perm) return false;
    if (perm.permission === "READ_WRITE") return true;

    return perm.permission === action;
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

/* ===== Hook ===== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};
