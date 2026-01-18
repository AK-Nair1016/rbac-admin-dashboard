import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Dashboard = () => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user) {
    return null;
  }

  const { role, userId } = authContext.user;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>User ID: {userId}</p>
      <p>Role: {role}</p>

      {role === "admin" && (
        <section>
          <h2>Admin Panel</h2>
          <p>Manage users, view all entities, system settings.</p>
        </section>
      )}

      {role === "manager" && (
        <section>
          <h2>Manager Panel</h2>
          <p>Create and update entities, view reports.</p>
        </section>
      )}

      {role === "user" && (
        <section>
          <h2>User Panel</h2>
          <p>View and manage your own entities.</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
