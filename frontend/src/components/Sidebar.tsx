import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
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
      <div className={styles.sidebarHeader}>
  <div className={styles.brand}>
    {!collapsed && "RBAC Admin"}
  </div>

  <button
    className={styles.collapseBtn}
    onClick={() => setCollapsed(!collapsed)}
    aria-label="Toggle sidebar"
  >
    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
  </button>
</div>


      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/entities"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Database size={18} />
          {!collapsed && <span>Entities</span>}
        </NavLink>

        {user.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <Users size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        )}
      </nav>

      <button className={styles.logout} onClick={logout}>
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
