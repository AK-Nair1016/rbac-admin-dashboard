import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Sidebar from "../components/Sidebar";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {mobileSidebarOpen && (
        <button
          className={styles.backdrop}
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className={styles.shell}>
        <header className={styles.topNav}>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className={styles.topNavTitle}>
            <span className={styles.eyebrow}>API Access Governance</span>
            <strong>Admin Console</strong>
          </div>

          {user && (
            <div className={styles.userSummary}>
              <span>{user.employeeId}</span>
              <strong>{user.role}</strong>
            </div>
          )}
        </header>

        <main className={styles.content}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
