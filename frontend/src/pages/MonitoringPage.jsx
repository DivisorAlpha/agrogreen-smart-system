import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Fan,
  RefreshCw,
  Thermometer,
} from "lucide-react";

import {
  getActuators,
  getAlertsByStatus,
  getDashboardSummary,
  getSensorReadings,
} from "../services/api";

export default function MonitoringPage() {
  const [summary, setSummary] = useState(null);
  const [readings, setReadings] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [openAlerts, setOpenAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMonitoringData = async () => {
    try {
      setErrorMessage("");

      const [summaryData, readingsData, actuatorsData, alertsData] =
        await Promise.all([
          getDashboardSummary(),
          getSensorReadings(),
          getActuators(),
          getAlertsByStatus("OPEN"),
        ]);

      setSummary(summaryData);
      setReadings(readingsData.slice(0, 8));
      setActuators(actuatorsData);
      setOpenAlerts(alertsData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el monitoreo en vivo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoringData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      loadMonitoringData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  const actuatorsOn = actuators.filter((actuator) => actuator.state === "ON");
  const actuatorsOff = actuators.filter((actuator) => actuator.state === "OFF");

  if (loading) {
    return (
      <div className="page-state">
        <div className="loader"></div>
        <p>Cargando monitoreo en vivo...</p>
      </div>
    );
  }

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Centro de control</p>
          <h1>Monitoreo en vivo</h1>
          <p>
            Visualiza el estado general del invernadero, lecturas recientes,
            actuadores y alertas abiertas.
          </p>
        </div>

        <div className="monitoring-actions">
          <button onClick={loadMonitoringData}>
            <RefreshCw size={16} />
            Actualizar
          </button>

          <button
            className={autoRefresh ? "small-button" : "secondary-button"}
            onClick={() => setAutoRefresh((current) => !current)}
          >
            {autoRefresh ? "Auto ON" : "Auto OFF"}
          </button>
        </div>
      </header>

      {errorMessage && <p className="form-message error">{errorMessage}</p>}

      <section className="summary-grid compact-summary">
        <article className="summary-card">
          <span className="summary-card-icon">
            <Thermometer size={24} />
          </span>
          <div>
            <p className="summary-card-title">Sensores activos</p>
            <h2 className="summary-card-value">
              {summary?.activeSensors ?? 0}/{summary?.totalSensors ?? 0}
            </h2>
            <p className="summary-card-description">Dispositivos de medición</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <Fan size={24} />
          </span>
          <div>
            <p className="summary-card-title">Actuadores encendidos</p>
            <h2 className="summary-card-value">
              {actuatorsOn.length}/{actuators.length}
            </h2>
            <p className="summary-card-description">Dispositivos en operación</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <Activity size={24} />
          </span>
          <div>
            <p className="summary-card-title">Lecturas recientes</p>
            <h2 className="summary-card-value">{readings.length}</h2>
            <p className="summary-card-description">Últimos registros cargados</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <AlertTriangle size={24} />
          </span>
          <div>
            <p className="summary-card-title">Alertas abiertas</p>
            <h2 className="summary-card-value">{openAlerts.length}</h2>
            <p className="summary-card-description">Pendientes de revisión</p>
          </div>
        </article>
      </section>

      <section className="monitoring-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Lecturas recientes</h2>
            <p>Últimos valores registrados por los sensores.</p>
          </div>

          <div className="monitoring-list">
            {readings.length === 0 ? (
              <p className="empty-cell">No hay lecturas registradas.</p>
            ) : (
              readings.map((reading) => (
                <div className="monitoring-item" key={reading.id}>
                  <div>
                    <strong>{reading.sensorCode}</strong>
                    <span>{reading.sensorName}</span>
                  </div>

                  <div className="monitoring-value">
                    {reading.value} {reading.unit}
                  </div>

                  <span
                    className={`badge ${
                      reading.status === "VALID" ? "success" : "warning"
                    }`}
                  >
                    {reading.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Actuadores</h2>
            <p>Estado actual de los dispositivos físicos.</p>
          </div>

          <div className="monitoring-list">
            {actuators.length === 0 ? (
              <p className="empty-cell">No hay actuadores registrados.</p>
            ) : (
              actuators.map((actuator) => (
                <div className="monitoring-item" key={actuator.id}>
                  <div>
                    <strong>{actuator.code}</strong>
                    <span>{actuator.name}</span>
                  </div>

                  <span
                    className={`badge ${
                      actuator.state === "ON" ? "success" : "neutral"
                    }`}
                  >
                    {actuator.state}
                  </span>

                  <span
                    className={`badge ${
                      actuator.operationalStatus === "ACTIVE"
                        ? "success"
                        : "warning"
                    }`}
                  >
                    {actuator.operationalStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel wide-panel">
          <div className="panel-header">
            <h2>Alertas abiertas</h2>
            <p>Eventos que requieren atención del usuario o del sistema.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Zona</th>
                  <th>Nivel</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {openAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No hay alertas abiertas.
                    </td>
                  </tr>
                ) : (
                  openAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td>
                        <strong>{alert.sensorCode}</strong>
                        <span>{alert.sensorName}</span>
                      </td>
                      <td>{alert.zoneName || "Sin zona"}</td>
                      <td>
                        <span
                          className={`badge ${
                            alert.level === "CRITICAL" ? "danger" : "warning"
                          }`}
                        >
                          {alert.level}
                        </span>
                      </td>
                      <td>{alert.message}</td>
                      <td>{formatDate(alert.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Resumen técnico</h2>
          <p>Estado rápido de operación del sistema.</p>
        </div>

        <div className="system-status-grid">
          <div>
            <strong>{actuatorsOn.length}</strong>
            <span>Actuadores encendidos</span>
          </div>

          <div>
            <strong>{actuatorsOff.length}</strong>
            <span>Actuadores apagados</span>
          </div>

          <div>
            <strong>{summary?.activeAutomationRules ?? 0}</strong>
            <span>Reglas activas</span>
          </div>

          <div>
            <strong>{formatDate(summary?.generatedAt)}</strong>
            <span>Última actualización del backend</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}