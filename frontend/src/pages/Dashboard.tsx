import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import MetricCard from "../components/MetricCard";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user) return null;

  const { role, employeeId } = authContext.user;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back. Here’s a snapshot of your system.
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.identity}>
            <span className={styles.label}>Employee ID</span>
            <span className={styles.value}>{employeeId}</span>
          </div>
          <div className={styles.identity}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>{role}</span>
          </div>
        </div>
      </header>

      {/* Metrics Overview */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>Overview</h2>

        <div className={styles.metrics}>
          {role === "admin" && (
            <>
              <MetricCard label="Total Users" value={24} />
              <MetricCard label="Total Entities" value={112} />
              <MetricCard
                label="System Roles"
                value={3}
                hint="Admin · Manager · User"
              />
            </>
          )}

          {role === "manager" && (
            <>
              <MetricCard label="Assigned Entities" value={18} />
              <MetricCard label="Pending Updates" value={3} />
            </>
          )}

          {role === "user" && (
            <>
              <MetricCard label="My Entities" value={5} />
              <MetricCard label="Last Activity" value="2 days ago" />
            </>
          )}
        </div>
      </section>

      {/* Role panel */}
      <section className={styles.panel}>
        {role === "admin" && (
          <>
            <h2>Admin Overview</h2>
            <p>
              You have full system access. Manage users, review all entities,
              and configure system-wide settings.
            </p>
          </>
        )}

        {role === "manager" && (
          <>
            <h2>Manager Overview</h2>
            <p>
              You can create and manage entities assigned to your scope and
              review operational data.
            </p>
          </>
        )}

        {role === "user" && (
          <>
            <h2>User Overview</h2>
            <p>
              You can view and manage entities that you own or are assigned to.
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
