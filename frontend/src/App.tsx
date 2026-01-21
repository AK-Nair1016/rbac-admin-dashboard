import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EntitiesList from "./pages/entities/EntitiesList";
import CreateEntity from "./pages/entities/CreateEntity";
import EditEntity from "./pages/entities/EditEntity";
import DashboardLayout from "./Layouts/DashboardLayout"; // ✅ casing fixed
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected admin layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/entities" element={<EntitiesList />} />

            <Route
              path="/entities/new"
              element={<CreateEntity />}
            />

            <Route
              path="/entities/:id/edit"
              element={<EditEntity />}
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
