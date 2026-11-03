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
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  return (
    <aside
      className={`${styles.sidebar} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      {/* ===== Header ===== */}
      <div className={styles.sidebarHeader}>
        <div className={styles.brand}>
          {!collapsed && "RBAC Admin"}
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* ===== Navigation ===== */}
      <nav className={styles.nav}>
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${styles.navItem} ${
              isActive ? styles.active : ""
            }`
          }
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Entities parent */}
        <NavLink
          to="/entities"
          className={({ isActive }) =>
            `${styles.navItem} ${
              isActive ? styles.active : ""
            }`
          }
        >
          <Database size={18} />
          {!collapsed && <span>Entities</span>}
        </NavLink>

        {/* Sub-items (only when expanded) */}
        {!collapsed && (
          <>
            {/* View Entities */}
            <NavLink
              to="/entities"
              className={({ isActive }) =>
                `${styles.navItem} ${styles.subItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Eye size={14} />
              <span>View Entities</span>
            </NavLink>

            {/* Create Entity */}
            {(user.role === "admin" ||
              user.role === "manager") && (
              <NavLink
                to="/entities/new"
                className={({ isActive }) =>
                  `${styles.navItem} ${styles.subItem} ${
                    isActive ? styles.active : ""
                  }`
                }
              >
                <Plus size={14} />
                <span>Create Entity</span>
              </NavLink>
            )}
          </>
        )}

        {/* Users */}
        {user.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <Users size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        )}
      </nav>

      {/* ===== Logout ===== */}
      <button className={styles.logout} onClick={logout}>
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
