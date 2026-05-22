import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import GreenhousesPage from "./pages/GreenhousesPage";
import ZonesPage from "./pages/ZonesPage";
import CropsPage from "./pages/CropsPage";
import SensorsPage from "./pages/SensorsPage";
import ActuatorsPage from "./pages/ActuatorsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/greenhouses" element={<GreenhousesPage />} />
          <Route path="/zones" element={<ZonesPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/actuators" element={<ActuatorsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}