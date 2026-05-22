import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Fan,
  Gauge,
  Leaf,
  Sprout,
  Thermometer,
  Workflow,
  Warehouse,
} from "lucide-react";

import { getDashboardSummary } from "../services/api";
import SummaryCard from "../components/dashboard/SummaryCard";
import LatestReadingsTable from "../components/dashboard/LatestReadingsTable";
import LatestAlertsTable from "../components/dashboard/LatestAlertsTable";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSummary = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el resumen del sistema. Verifica que el backend esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="page-state">
        <div className="loader"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page-state">
        <AlertTriangle size={42} />
        <h2>Error de conexión</h2>
        <p>{errorMessage}</p>
        <button onClick={loadSummary}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Dashboard AgroGreen</h1>
          <p>
            Resumen general del estado operativo del sistema inteligente de invernadero.
          </p>
        </div>

        <button onClick={loadSummary}>Actualizar</button>
      </header>

      <section className="summary-grid">
        <SummaryCard
          title="Invernaderos"
          value={summary.totalGreenhouses}
          description="Registrados en el sistema"
          icon={<Warehouse size={24} />}
        />

        <SummaryCard
          title="Zonas"
          value={summary.totalZones}
          description="Áreas internas monitoreadas"
          icon={<Leaf size={24} />}
        />

        <SummaryCard
          title="Cultivos"
          value={summary.totalCrops}
          description="Cultivos registrados"
          icon={<Sprout size={24} />}
        />

        <SummaryCard
          title="Sensores activos"
          value={`${summary.activeSensors}/${summary.totalSensors}`}
          description="Sensores disponibles"
          icon={<Thermometer size={24} />}
        />

        <SummaryCard
          title="Actuadores encendidos"
          value={`${summary.actuatorsOn}/${summary.totalActuators}`}
          description="Dispositivos en operación"
          icon={<Fan size={24} />}
        />

        <SummaryCard
          title="Reglas activas"
          value={`${summary.activeAutomationRules}/${summary.totalAutomationRules}`}
          description="Automatizaciones configuradas"
          icon={<Workflow size={24} />}
        />

        <SummaryCard
          title="Alertas abiertas"
          value={summary.openAlerts}
          description="Eventos pendientes"
          icon={<AlertTriangle size={24} />}
        />

        <SummaryCard
          title="Última actualización"
          value={formatShortDate(summary.generatedAt)}
          description="Generación del resumen"
          icon={<Gauge size={24} />}
        />
      </section>

      <section className="dashboard-tables">
        <LatestReadingsTable readings={summary.latestReadings || []} />
        <LatestAlertsTable alerts={summary.latestAlerts || []} />
      </section>
    </div>
  );
}

function formatShortDate(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}