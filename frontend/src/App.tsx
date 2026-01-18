import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EntitiesList from "./pages/entities/EntitiesList";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/entities"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <EntitiesList />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
