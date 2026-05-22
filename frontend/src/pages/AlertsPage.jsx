import { useEffect, useState } from "react";
import {
  deleteAlert,
  getAlerts,
  getAlertsBySensorCode,
  getAlertsByStatus,
  getSensors,
  resolveAlert,
} from "../services/api";

const initialFilters = {
  status: "ALL",
  sensorCode: "",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [alertsData, sensorsData] = await Promise.all([
        getAlerts(),
        getSensors(),
      ]);

      setAlerts(alertsData);
      setSensors(sensorsData);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudieron cargar las alertas. Verifica que el módulo de alertas exista en el backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      let data;

      if (filters.sensorCode) {
        data = await getAlertsBySensorCode(filters.sensorCode);
      } else if (filters.status !== "ALL") {
        data = await getAlertsByStatus(filters.status);
      } else {
        data = await getAlerts();
      }

      if (filters.status !== "ALL" && filters.sensorCode) {
        data = data.filter((alert) => alert.status === filters.status);
      }

      setAlerts(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron aplicar los filtros.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters(initialFilters);
    await loadData();
  };

  const handleResolve = async (id) => {
    const confirmed = window.confirm("¿Deseas marcar esta alerta como resuelta?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await resolveAlert(id);
      setSuccessMessage("Alerta marcada como resuelta correctamente.");
      await handleApplyFilters();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo resolver la alerta.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta alerta?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteAlert(id);
      setSuccessMessage("Alerta eliminada correctamente.");
      await handleApplyFilters();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar la alerta.");
    }
  };

  const openAlerts = alerts.filter((alert) => alert.status === "OPEN").length;
  const resolvedAlerts = alerts.filter((alert) => alert.status === "RESOLVED").length;
  const criticalAlerts = alerts.filter((alert) => alert.level === "CRITICAL").length;

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Gestión de eventos críticos</p>
          <h1>Alertas</h1>
          <p>
            Visualiza, filtra y resuelve alertas generadas por lecturas fuera de
            rango en los sensores del invernadero.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="summary-grid compact-summary">
        <article className="summary-card">
          <div>
            <p className="summary-card-title">Alertas visibles</p>
            <h2 className="summary-card-value">{alerts.length}</h2>
            <p className="summary-card-description">Según filtros actuales</p>
          </div>
        </article>

        <article className="summary-card">
          <div>
            <p className="summary-card-title">Abiertas</p>
            <h2 className="summary-card-value">{openAlerts}</h2>
            <p className="summary-card-description">Pendientes de revisión</p>
          </div>
        </article>

        <article className="summary-card">
          <div>
            <p className="summary-card-title">Resueltas</p>
            <h2 className="summary-card-value">{resolvedAlerts}</h2>
            <p className="summary-card-description">Ya gestionadas</p>
          </div>
        </article>

        <article className="summary-card">
          <div>
            <p className="summary-card-title">Críticas</p>
            <h2 className="summary-card-value">{criticalAlerts}</h2>
            <p className="summary-card-description">Nivel de mayor prioridad</p>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Filtros</h2>
          <p>Filtra las alertas por estado o por sensor.</p>
        </div>

        <div className="filters-row">
          <label>
            Estado
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="ALL">Todas</option>
              <option value="OPEN">Abiertas</option>
              <option value="RESOLVED">Resueltas</option>
            </select>
          </label>

          <label>
            Sensor
            <select
              name="sensorCode"
              value={filters.sensorCode}
              onChange={handleFilterChange}
            >
              <option value="">Todos los sensores</option>

              {sensors.map((sensor) => (
                <option key={sensor.id} value={sensor.code}>
                  {sensor.code} — {sensor.name}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-actions">
            <button type="button" onClick={handleApplyFilters}>
              Aplicar filtros
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleClearFilters}
            >
              Limpiar
            </button>
          </div>
        </div>

        {errorMessage && <p className="form-message error">{errorMessage}</p>}
        {successMessage && <p className="form-message success">{successMessage}</p>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Listado de alertas</h2>
          <p>Consulta eventos abiertos o resueltos generados por el sistema.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sensor</th>
                <th>Zona</th>
                <th>Tipo</th>
                <th>Nivel</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    Cargando alertas...
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No hay alertas registradas.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <strong>{alert.sensorCode}</strong>
                      <span>{alert.sensorName || "Sin nombre"}</span>
                    </td>

                    <td>{alert.zoneName || "Sin zona"}</td>

                    <td>{alert.type || "Sin tipo"}</td>

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

                    <td>
                      <span
                        className={`badge ${
                          alert.status === "OPEN" ? "warning" : "success"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td>{formatDate(alert.createdAt)}</td>

                    <td>
                      <div className="table-actions">
                        {alert.status === "OPEN" && (
                          <button
                            type="button"
                            className="small-button"
                            onClick={() => handleResolve(alert.id)}
                          >
                            Resolver
                          </button>
                        )}

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(alert.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}