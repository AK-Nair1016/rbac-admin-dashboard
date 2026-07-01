import { useEffect, useState } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getMetrics } from "../api/metrics";
import type { MetricsResponse } from "../api/metrics";
import { useAuth } from "../auth/useAuth";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
} from "../components/common";
import styles from "./Dashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<MetricsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setDashboardData(data);
      } catch {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (!user) return null;
  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error || !dashboardData) {
    return (
      <ErrorState
        title="Dashboard unavailable"
        message={error || "No dashboard data"}
      />
    );
  }

  const { role, employeeId } = user;

  const normalizeStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const entityStatusChart =
    dashboardData.role === "admin" &&
    dashboardData.charts.entitiesByStatus.length > 0
      ? {
          labels: dashboardData.charts.entitiesByStatus.map((item) =>
            normalizeStatus(item.status)
          ),
          datasets: [
            {
              data: dashboardData.charts.entitiesByStatus.map(
                (item) => item.count
              ),
              backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"],
              borderWidth: 1,
            },
          ],
        }
      : null;

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is a snapshot of your access workspace."
        meta={
          <>
            <div className={styles.identity}>
              <span className={styles.label}>Employee ID</span>
              <span className={styles.value}>{employeeId}</span>
            </div>
            <div className={styles.identity}>
              <span className={styles.label}>Role</span>
              <span className={styles.value}>{role}</span>
            </div>
          </>
        }
      />

      <SectionCard title="Overview">
        <div className={styles.metrics}>
          {role === "admin" && dashboardData.role === "admin" && (
            <>
              <StatCard
                label="Total Users"
                value={dashboardData.metrics.totalUsers}
              />
              <StatCard
                label="Total Entities"
                value={dashboardData.metrics.totalEntities}
              />
              <StatCard
                label="System Roles"
                value={dashboardData.metrics.systemRoles}
              />
            </>
          )}

          {role === "manager" && dashboardData.role === "manager" && (
            <>
              <StatCard
                label="Assigned Entities"
                value={dashboardData.metrics.assignedEntities}
              />
              <StatCard
                label="Active Entities"
                value={dashboardData.metrics.activeEntities}
              />
            </>
          )}

          {role === "user" && dashboardData.role === "user" && (
            <>
              <StatCard
                label="My Entities"
                value={dashboardData.metrics.myEntities}
              />
              <StatCard
                label="Active Entities"
                value={dashboardData.metrics.activeEntities}
              />
            </>
          )}
        </div>
      </SectionCard>

      {role === "admin" && dashboardData.role === "admin" && (
        <SectionCard title="Analytics">
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
            <EmptyState message="No entity data available to display analytics." />
          )}
        </SectionCard>
      )}
    </div>
  );
};

export default Dashboard;
