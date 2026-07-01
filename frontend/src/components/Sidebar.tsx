import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const getNavItemClass = (isActive: boolean, extraClass?: string) =>
    [styles.navItem, extraClass, isActive ? styles.active : ""]
      .filter(Boolean)
      .join(" ");

  const closeMobileNavigation = () => {
    onMobileClose?.();
  };

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${
        isMobileOpen ? styles.mobileOpen : ""
      }`}
      aria-label="Primary navigation"
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.brand} title="API Access Governance">
          {!collapsed && "Access Governance"}
        </div>

        <button
          className={styles.collapseBtn}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => getNavItemClass(isActive)}
          onClick={closeMobileNavigation}
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/entities"
          className={({ isActive }) => getNavItemClass(isActive)}
          onClick={closeMobileNavigation}
        >
          <Database size={18} />
          {!collapsed && <span>Entities</span>}
        </NavLink>

        {!collapsed && (
          <>
            <NavLink
              to="/entities"
              className={({ isActive }) =>
                getNavItemClass(isActive, styles.subItem)
              }
              onClick={closeMobileNavigation}
            >
              <Eye size={14} />
              <span>View Entities</span>
            </NavLink>

            {(user.role === "admin" ||
              user.role === "manager") && (
              <NavLink
                to="/entities/new"
                className={({ isActive }) =>
                  getNavItemClass(isActive, styles.subItem)
                }
                onClick={closeMobileNavigation}
              >
                <Plus size={14} />
                <span>Create Entity</span>
              </NavLink>
            )}
          </>
        )}

        {user.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={closeMobileNavigation}
          >
            <Users size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        )}
      </nav>

      <button className={styles.logout} type="button" onClick={logout}>
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
