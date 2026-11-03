import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserPermissionsPage from "./pages/UserPermissionsPage";
import CreateEntity from "./pages/entities/CreateEntity";
import EditEntity from "./pages/entities/EditEntity";
import EntitiesList from "./pages/entities/EntitiesList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entities" element={<EntitiesList />} />
            <Route path="/entities/new" element={<CreateEntity />} />
            <Route path="/entities/:id/edit" element={<EditEntity />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserPermissionsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
