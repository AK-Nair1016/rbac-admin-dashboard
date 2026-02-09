import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EntitiesList from "./pages/entities/EntitiesList";
import CreateEntity from "./pages/entities/CreateEntity";
import EditEntity from "./pages/entities/EditEntity";
import UsersPermit from "./pages/usersPermit"; // ✅ NEW
import DashboardLayout from "./Layouts/DashboardLayout";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Entities */}
            <Route path="/entities" element={<EntitiesList />} />
            <Route path="/entities/new" element={<CreateEntity />} />
            <Route path="/entities/:id/edit" element={<EditEntity />} />

            {/* ✅ User Permissions */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersPermit />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
