import { useEffect, useState } from "react";
import {
  createSensorReading,
  deleteSensorReading,
  getSensorReadings,
  getSensors,
} from "../services/api";

const initialForm = {
  sensorCode: "",
  value: "",
  readingDateTime: "",
  source: "MANUAL",
};

export default function SensorReadingsPage() {
  const [readings, setReadings] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [automationResult, setAutomationResult] = useState(null);
  const [createdAlert, setCreatedAlert] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [readingsData, sensorsData] = await Promise.all([
        getSensorReadings(),
        getSensors(),
      ]);

      setReadings(readingsData);
      setSensors(sensorsData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las lecturas de sensores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.sensorCode || form.value === "") {
      setErrorMessage("Debes seleccionar un sensor y escribir el valor de la lectura.");
      return;
    }

    const payload = {
      sensorCode: form.sensorCode,
      value: Number(form.value),
      readingDateTime: form.readingDateTime || null,
      source: form.source,
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");
      setAutomationResult(null);
      setCreatedAlert(null);

      const response = await createSensorReading(payload);

      setSuccessMessage("Lectura registrada correctamente.");

      if (response.automationEvaluation) {
        setAutomationResult(response.automationEvaluation);
      }

      if (response.alert) {
        setCreatedAlert(response.alert);
      }

      setForm(initialForm);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo registrar la lectura. Verifica el sensor y el valor enviado.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta lectura?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteSensorReading(id);
      setSuccessMessage("Lectura eliminada correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar la lectura.");
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Monitoreo en tiempo real</p>
          <h1>Lecturas de sensores</h1>
          <p>
            Registra valores manuales de sensores y observa si el sistema ejecuta
            reglas automáticas sobre los actuadores.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="module-grid">
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>Nueva lectura</h2>
            <p>
              Selecciona un sensor, registra el valor medido y el backend evaluará
              automáticamente las reglas configuradas.
            </p>
          </div>

          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Sensor
              <select
                name="sensorCode"
                value={form.sensorCode}
                onChange={handleChange}
              >
                <option value="">Selecciona un sensor</option>

                {sensors.map((sensor) => (
                  <option key={sensor.id} value={sensor.code}>
                    {sensor.code} — {sensor.name} ({sensor.unit})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Valor de lectura
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="Ej: 32.5"
                step="0.01"
              />
            </label>

            <label>
              Fecha y hora de lectura
              <input
                type="datetime-local"
                name="readingDateTime"
                value={form.readingDateTime}
                onChange={handleChange}
              />
            </label>

            <label>
              Fuente
              <select name="source" value={form.source} onChange={handleChange}>
                <option value="MANUAL">Manual</option>
                <option value="DEVICE">Dispositivo IoT</option>
                <option value="SIMULATION">Simulación</option>
              </select>
            </label>

            {errorMessage && <p className="form-message error">{errorMessage}</p>}
            {successMessage && <p className="form-message success">{successMessage}</p>}

            {automationResult && (
              <div className="result-box">
                <h3>Evaluación automática</h3>
                <p>
                  Reglas evaluadas: <strong>{automationResult.rulesEvaluated}</strong>
                </p>
                <p>
                  Reglas ejecutadas: <strong>{automationResult.rulesTriggered}</strong>
                </p>

                {automationResult.actions?.length > 0 ? (
                  <ul>
                    {automationResult.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No se ejecutó ninguna acción automática.</p>
                )}
              </div>
            )}

            {createdAlert && (
              <div className="result-box warning-box">
                <h3>Alerta generada</h3>
                <p>{createdAlert.message}</p>
                <p>
                  Estado: <strong>{createdAlert.status}</strong>
                </p>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Registrando..." : "Registrar lectura"}
              </button>
            </div>
          </form>
        </article>

        <section className="panel">
          <div className="panel-header">
            <h2>Historial de lecturas</h2>
            <p>Consulta los registros enviados por los sensores.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Zona</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Fuente</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      Cargando lecturas...
                    </td>
                  </tr>
                ) : readings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      No hay lecturas registradas.
                    </td>
                  </tr>
                ) : (
                  readings.map((reading) => (
                    <tr key={reading.id}>
                      <td>
                        <strong>{reading.sensorCode}</strong>
                        <span>{reading.sensorName}</span>
                      </td>

                      <td>{reading.zoneName || "Sin zona"}</td>

                      <td>{reading.type}</td>

                      <td>
                        {reading.value} {reading.unit}
                      </td>

                      <td>{reading.source}</td>

                      <td>
                        <span
                          className={`badge ${
                            reading.status === "VALID" ? "success" : "warning"
                          }`}
                        >
                          {reading.status}
                        </span>
                      </td>

                      <td>{formatDate(reading.readingDateTime)}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => handleDelete(reading.id)}
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
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}