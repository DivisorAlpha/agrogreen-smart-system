import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import MonitoringPage from "./pages/MonitoringPage";
import ChartsPage from "./pages/ChartsPage";
import GreenhousesPage from "./pages/GreenhousesPage";
import ZonesPage from "./pages/ZonesPage";
import CropsPage from "./pages/CropsPage";
import SensorsPage from "./pages/SensorsPage";
import ActuatorsPage from "./pages/ActuatorsPage";
import SensorReadingsPage from "./pages/SensorReadingsPage";
import AutomationRulesPage from "./pages/AutomationRulesPage";
import AlertsPage from "./pages/AlertsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedApp({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedApp>
                <DashboardPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/monitoring"
            element={
              <ProtectedApp>
                <MonitoringPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/charts"
            element={
              <ProtectedApp>
                <ChartsPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/greenhouses"
            element={
              <ProtectedApp>
                <GreenhousesPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/zones"
            element={
              <ProtectedApp>
                <ZonesPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/crops"
            element={
              <ProtectedApp>
                <CropsPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/sensors"
            element={
              <ProtectedApp>
                <SensorsPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/actuators"
            element={
              <ProtectedApp>
                <ActuatorsPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/sensor-readings"
            element={
              <ProtectedApp>
                <SensorReadingsPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/automation-rules"
            element={
              <ProtectedApp>
                <AutomationRulesPage />
              </ProtectedApp>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedApp>
                <AlertsPage />
              </ProtectedApp>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}