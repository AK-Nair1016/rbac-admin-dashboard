import { useEffect, useState } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import {
  Activity,
  BadgeCheck,
  Boxes,
  Clock3,
  ShieldCheck,
  Users,
} from "lucide-react";
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

  const overviewItems =
    dashboardData.role === "admin"
      ? [
          {
            label: "Total Users",
            value: dashboardData.metrics.totalUsers,
            hint: "Active employee identities tracked in the platform",
            icon: <Users size={18} aria-hidden="true" />,
          },
          {
            label: "Managed Entities",
            value: dashboardData.metrics.totalEntities,
            hint: "Current access-governed records in scope",
            icon: <Boxes size={18} aria-hidden="true" />,
          },
          {
            label: "System Roles",
            value: dashboardData.metrics.systemRoles,
            hint: "Configured RBAC roles available to users",
            icon: <ShieldCheck size={18} aria-hidden="true" />,
          },
        ]
      : dashboardData.role === "manager"
        ? [
            {
              label: "Assigned Entities",
              value: dashboardData.metrics.assignedEntities,
              hint: "Entities assigned across your managed workspace",
              icon: <Boxes size={18} aria-hidden="true" />,
            },
            {
              label: "Active Entities",
              value: dashboardData.metrics.activeEntities,
              hint: "Currently active entities in your scope",
              icon: <BadgeCheck size={18} aria-hidden="true" />,
            },
          ]
        : [
            {
              label: "My Entities",
              value: dashboardData.metrics.myEntities,
              hint: "Entities currently visible to your account",
              icon: <Boxes size={18} aria-hidden="true" />,
            },
            {
              label: "Active Entities",
              value: dashboardData.metrics.activeEntities,
              hint: "Active entities available in your workspace",
              icon: <BadgeCheck size={18} aria-hidden="true" />,
            },
          ];

  const totalEntityStatusCount =
    dashboardData.role === "admin"
      ? dashboardData.charts.entitiesByStatus.reduce(
          (totalCount, item) => totalCount + item.count,
          0
        )
      : 0;

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

      <section className={styles.metrics} aria-label="Dashboard overview">
        {overviewItems.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            hint={item.hint}
            icon={item.icon}
          />
        ))}
      </section>

      <div className={styles.contentGrid}>
        {role === "admin" && dashboardData.role === "admin" && (
          <SectionCard title="Access Status">
            {entityStatusChart ? (
              <div className={styles.chartLayout}>
                <div className={styles.chartCanvas}>
                  <Doughnut
                    data={entityStatusChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "68%",
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
                <div className={styles.chartSummary}>
                  <span className={styles.summaryLabel}>
                    Total status records
                  </span>
                  <strong>{totalEntityStatusCount}</strong>
                  <p>
                    Status distribution uses the existing entity metrics feed.
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState message="No entity data available to display analytics." />
            )}
          </SectionCard>
        )}

        <SectionCard title="Workspace Health">
          <div className={styles.healthList}>
            <div className={styles.healthItem}>
              <span className={styles.healthIcon}>
                <Activity size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>RBAC controls active</strong>
                <p>Routes and page actions remain governed by current roles.</p>
              </div>
            </div>
            <div className={styles.healthItem}>
              <span className={styles.healthIcon}>
                <Clock3 size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Recent activity</strong>
                <p>Activity timeline placeholder reserved for audit data.</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Activity">
        <div className={styles.activityTimeline} aria-label="Recent activity">
          <div className={styles.activityItem}>
            <span className={styles.activityDot} aria-hidden="true" />
            <div>
              <strong>Audit timeline pending</strong>
              <p>
                This section is intentionally a placeholder until audit data is
                introduced by a later milestone.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default Dashboard;
