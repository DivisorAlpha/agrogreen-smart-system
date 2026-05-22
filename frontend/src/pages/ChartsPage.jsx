import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Thermometer,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getSensorReadingsBySensorCode,
  getSensors,
} from "../services/api";

export default function ChartsPage() {
  const [sensors, setSensors] = useState([]);
  const [selectedSensorCode, setSelectedSensorCode] = useState("");
  const [readings, setReadings] = useState([]);

  const [loadingSensors, setLoadingSensors] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const selectedSensor = useMemo(() => {
    return sensors.find((sensor) => sensor.code === selectedSensorCode);
  }, [sensors, selectedSensorCode]);

  const chartData = useMemo(() => {
    return [...readings]
      .sort((a, b) => new Date(a.readingDateTime) - new Date(b.readingDateTime))
      .slice(-40)
      .map((reading) => ({
        id: reading.id,
        value: Number(reading.value),
        status: reading.status,
        source: reading.source,
        fullDate: reading.readingDateTime,
        time: formatShortDate(reading.readingDateTime),
      }));
  }, [readings]);

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        latest: 0,
        outOfRange: 0,
      };
    }

    const values = chartData.map((item) => item.value);
    const total = values.reduce((acc, value) => acc + value, 0);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: total / values.length,
      latest: values[values.length - 1],
      outOfRange: chartData.filter((item) => item.status !== "VALID").length,
    };
  }, [chartData]);

  const loadSensors = async () => {
    try {
      setLoadingSensors(true);
      setErrorMessage("");

      const sensorsData = await getSensors();
      setSensors(sensorsData);

      if (sensorsData.length > 0 && !selectedSensorCode) {
        setSelectedSensorCode(sensorsData[0].code);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los sensores.");
    } finally {
      setLoadingSensors(false);
    }
  };

  const loadReadings = async (sensorCode) => {
    if (!sensorCode) return;

    try {
      setLoadingReadings(true);
      setErrorMessage("");

      const readingsData = await getSensorReadingsBySensorCode(sensorCode);
      setReadings(readingsData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las lecturas históricas del sensor.");
    } finally {
      setLoadingReadings(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  useEffect(() => {
    if (selectedSensorCode) {
      loadReadings(selectedSensorCode);
    }
  }, [selectedSensorCode]);

  const handleSensorChange = (event) => {
    setSelectedSensorCode(event.target.value);
  };

  const handleRefresh = () => {
    loadReadings(selectedSensorCode);
  };

  if (loadingSensors) {
    return (
      <div className="page-state">
        <div className="loader"></div>
        <p>Cargando sensores para gráficas...</p>
      </div>
    );
  }

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Análisis histórico</p>
          <h1>Gráficas de sensores</h1>
          <p>
            Visualiza el comportamiento histórico de temperatura, humedad, luz,
            CO₂, pH u otras variables registradas por los sensores.
          </p>
        </div>

        <button onClick={handleRefresh}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </header>

      {errorMessage && <p className="form-message error">{errorMessage}</p>}

      <section className="panel">
        <div className="panel-header">
          <h2>Selector de sensor</h2>
          <p>Escoge el sensor que deseas analizar gráficamente.</p>
        </div>

        <div className="chart-filter-row">
          <label>
            Sensor
            <select value={selectedSensorCode} onChange={handleSensorChange}>
              {sensors.length === 0 ? (
                <option value="">No hay sensores registrados</option>
              ) : (
                sensors.map((sensor) => (
                  <option key={sensor.id} value={sensor.code}>
                    {sensor.code} — {sensor.name} ({sensor.unit})
                  </option>
                ))
              )}
            </select>
          </label>

          {selectedSensor && (
            <div className="selected-sensor-info">
              <strong>{selectedSensor.name}</strong>
              <span>
                Tipo: {selectedSensor.type} | Rango:{" "}
                {formatSensorRange(selectedSensor)}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="summary-grid compact-summary">
        <article className="summary-card">
          <span className="summary-card-icon">
            <Activity size={24} />
          </span>
          <div>
            <p className="summary-card-title">Lecturas graficadas</p>
            <h2 className="summary-card-value">{chartData.length}</h2>
            <p className="summary-card-description">Últimos registros visibles</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <Thermometer size={24} />
          </span>
          <div>
            <p className="summary-card-title">Último valor</p>
            <h2 className="summary-card-value">
              {formatNumber(stats.latest)} {selectedSensor?.unit || ""}
            </h2>
            <p className="summary-card-description">Dato más reciente</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <BarChart3 size={24} />
          </span>
          <div>
            <p className="summary-card-title">Promedio</p>
            <h2 className="summary-card-value">
              {formatNumber(stats.avg)} {selectedSensor?.unit || ""}
            </h2>
            <p className="summary-card-description">Promedio del periodo</p>
          </div>
        </article>

        <article className="summary-card">
          <span className="summary-card-icon">
            <AlertTriangle size={24} />
          </span>
          <div>
            <p className="summary-card-title">Fuera de rango</p>
            <h2 className="summary-card-value">{stats.outOfRange}</h2>
            <p className="summary-card-description">Lecturas no válidas</p>
          </div>
        </article>
      </section>

      <section className="panel chart-panel">
        <div className="panel-header">
          <h2>
            Tendencia histórica{" "}
            {selectedSensor ? `— ${selectedSensor.code}` : ""}
          </h2>
          <p>
            La gráfica muestra hasta las últimas 40 lecturas del sensor seleccionado.
          </p>
        </div>

        {loadingReadings ? (
          <div className="chart-state">
            <div className="loader"></div>
            <p>Cargando lecturas...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="chart-state">
            <p>No hay lecturas registradas para este sensor.</p>
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={390}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#a7f3d0", fontSize: 12 }}
                  tickMargin={12}
                />
                <YAxis
                  tick={{ fill: "#a7f3d0", fontSize: 12 }}
                  tickMargin={12}
                  unit={selectedSensor?.unit || ""}
                />
                <Tooltip content={<CustomTooltip unit={selectedSensor?.unit || ""} />} />

                {selectedSensor?.minValue !== null &&
                  selectedSensor?.minValue !== undefined && (
                    <ReferenceLine
                      y={selectedSensor.minValue}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{
                        value: "Mínimo",
                        fill: "#facc15",
                        fontSize: 12,
                      }}
                    />
                  )}

                {selectedSensor?.maxValue !== null &&
                  selectedSensor?.maxValue !== undefined && (
                    <ReferenceLine
                      y={selectedSensor.maxValue}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{
                        value: "Máximo",
                        fill: "#fecaca",
                        fontSize: 12,
                      }}
                    />
                  )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Lecturas usadas en la gráfica</h2>
          <p>Tabla de los datos visibles en el gráfico histórico.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Fuente</th>
              </tr>
            </thead>

            <tbody>
              {chartData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                [...chartData].reverse().map((reading) => (
                  <tr key={reading.id}>
                    <td>{formatFullDate(reading.fullDate)}</td>
                    <td>
                      {reading.value} {selectedSensor?.unit || ""}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reading.status === "VALID" ? "success" : "warning"
                        }`}
                      >
                        {reading.status}
                      </span>
                    </td>
                    <td>{reading.source}</td>
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

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <p>
        Valor: {payload[0].value} {unit}
      </p>
      <p>Estado: {item.status}</p>
      <p>Fuente: {item.source}</p>
    </div>
  );
}

function formatSensorRange(sensor) {
  const min =
    sensor.minValue !== null && sensor.minValue !== undefined
      ? sensor.minValue
      : "—";

  const max =
    sensor.maxValue !== null && sensor.maxValue !== undefined
      ? sensor.maxValue
      : "—";

  return `${min} ${sensor.unit || ""} - ${max} ${sensor.unit || ""}`;
}

function formatShortDate(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFullDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}

function formatNumber(value) {
  if (Number.isNaN(value)) return "0";
  return Number(value).toFixed(2);
}