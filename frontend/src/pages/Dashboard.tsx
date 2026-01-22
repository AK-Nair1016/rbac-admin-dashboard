import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getMetrics } from "../api/metrics";
import MetricCard from "../components/MetricCard";
import styles from "./Dashboard.module.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [metrics, setMetrics] = useState<any>(null);
  const [chartRawData, setChartRawData] = useState<
    { status: string; count: number }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();

        setMetrics(data.metrics);

        if (data.role === "admin") {
          setChartRawData(data.charts.entitiesByStatus);
        }
      } catch {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (!user) return null;
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  const { role, employeeId } = user;

  const normalizeStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const entityStatusChart =
    chartRawData && chartRawData.length > 0
      ? {
          labels: chartRawData.map((item) =>
            normalizeStatus(item.status)
          ),
          datasets: [
            {
              data: chartRawData.map((item) => item.count),
              backgroundColor: [
                "#2563eb",
                "#16a34a",
                "#f59e0b",
                "#dc2626",
              ],
              borderWidth: 1,
            },
          ],
        }
      : null;

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

      {/* Metrics */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>Overview</h2>

        <div className={styles.metrics}>
          {role === "admin" && metrics && (
            <>
              <MetricCard label="Total Users" value={metrics.totalUsers} />
              <MetricCard label="Total Entities" value={metrics.totalEntities} />
              <MetricCard label="System Roles" value={metrics.systemRoles} />
            </>
          )}

          {role === "manager" && metrics && (
            <>
              <MetricCard
                label="Assigned Entities"
                value={metrics.assignedEntities}
              />
              <MetricCard
                label="Active Entities"
                value={metrics.activeEntities}
              />
            </>
          )}

          {role === "user" && metrics && (
            <>
              <MetricCard label="My Entities" value={metrics.myEntities} />
              <MetricCard
                label="Active Entities"
                value={metrics.activeEntities}
              />
            </>
          )}
        </div>
      </section>

      {/* Analytics (Admin only) */}
      {role === "admin" && chartRawData && (
        <section className={styles.chartsSection}>
          <h2 className={styles.sectionTitle}>Analytics</h2>

          {entityStatusChart ? (
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Entities by Status</h3>
                <Doughnut
                  data={entityStatusChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 12,
                          padding: 16,
                          font: { size: 12 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <p className={styles.emptyState}>
              No entity data available to display analytics.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
