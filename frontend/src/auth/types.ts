import type { EntityPermission } from "../api/permissions";

export type UserRole = "admin" | "manager" | "user";
export type PermissionAction = "READ" | "WRITE";

export interface AuthUser {
  userId: string;
  employeeId: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  permissions: EntityPermission[];
  hasPermission: (entityId: string, action: PermissionAction) => boolean;
  refreshPermissions: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
}
