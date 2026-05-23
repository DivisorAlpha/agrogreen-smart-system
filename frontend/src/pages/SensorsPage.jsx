import { useEffect, useState } from "react";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";
import {
  createSensor,
  deleteSensor,
  getSensors,
  getZones,
  updateSensor,
} from "../services/api";

const initialForm = {
  zoneId: "",
  code: "",
  name: "",
  type: "TEMPERATURE",
  unit: "°C",
  minValue: "",
  maxValue: "",
};

const sensorTypes = [
  { value: "TEMPERATURE", label: "Temperatura", unit: "°C" },
  { value: "AIR_HUMIDITY", label: "Humedad del aire", unit: "%" },
  { value: "SOIL_HUMIDITY", label: "Humedad del suelo", unit: "%" },
  { value: "LIGHT", label: "Luz", unit: "lux" },
  { value: "PH", label: "pH", unit: "pH" },
  { value: "CO2", label: "CO₂", unit: "ppm" },
];

export default function SensorsPage() {
  const [sensors, setSensors] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [sensorsData, zonesData] = await Promise.all([
        getSensors(),
        getZones(),
      ]);

      setSensors(sensorsData);
      setZones(zonesData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los sensores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "type") {
      const selectedType = sensorTypes.find((type) => type.value === value);

      setForm((currentForm) => ({
        ...currentForm,
        type: value,
        unit: selectedType?.unit || currentForm.unit,
      }));

      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.zoneId || !form.code.trim() || !form.name.trim() || !form.type.trim() || !form.unit.trim()) {
      setErrorMessage("La zona, código, nombre, tipo y unidad son obligatorios.");
      return;
    }

    const payload = {
      zoneId: Number(form.zoneId),
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      unit: form.unit.trim(),
      minValue: form.minValue === "" ? null : Number(form.minValue),
      maxValue: form.maxValue === "" ? null : Number(form.maxValue),
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingId) {
        await updateSensor(editingId, payload);
        setSuccessMessage("Sensor actualizado correctamente.");
      } else {
        await createSensor(payload);
        setSuccessMessage("Sensor creado correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo guardar el sensor. Verifica que el código no esté repetido."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (sensor) => {
    setEditingId(sensor.id);

    setForm({
      zoneId: sensor.zoneId ? String(sensor.zoneId) : "",
      code: sensor.code || "",
      name: sensor.name || "",
      type: sensor.type || "TEMPERATURE",
      unit: sensor.unit || "°C",
      minValue: sensor.minValue !== null && sensor.minValue !== undefined ? String(sensor.minValue) : "",
      maxValue: sensor.maxValue !== null && sensor.maxValue !== undefined ? String(sensor.maxValue) : "",
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este sensor?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteSensor(id);
      setSuccessMessage("Sensor eliminado correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo eliminar. Puede tener lecturas o reglas asociadas."
      );
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Monitoreo ambiental</p>
          <h1>Sensores</h1>
          <p>
            Administra los sensores instalados en las zonas del invernadero y define
            sus rangos de operación.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="module-grid">
        <AdminOnly
  fallback={
    <PermissionNotice
      title="Solo consulta"
      message="Tu rol permite consultar esta información, pero solo un administrador puede crear o modificar registros."
    />
  }
>
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? "Editar sensor" : "Nuevo sensor"}</h2>
            <p>
              Registra el sensor, su zona, tipo de medición y valores permitidos.
            </p>
          </div>

          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Zona
              <select
                name="zoneId"
                value={form.zoneId}
                onChange={handleChange}
              >
                <option value="">Selecciona una zona</option>

                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {zone.greenhouseName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Código del sensor
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Ej: TEMP-001"
              />
            </label>

            <label>
              Nombre del sensor
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Sensor de temperatura zona norte"
              />
            </label>

            <label>
              Tipo de sensor
              <select name="type" value={form.type} onChange={handleChange}>
                {sensorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Unidad
              <input
                type="text"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="Ej: °C, %, lux, ppm"
              />
            </label>

            <label>
              Valor mínimo permitido
              <input
                type="number"
                name="minValue"
                value={form.minValue}
                onChange={handleChange}
                placeholder="Ej: 0"
                step="0.01"
              />
            </label>

            <label>
              Valor máximo permitido
              <input
                type="number"
                name="maxValue"
                value={form.maxValue}
                onChange={handleChange}
                placeholder="Ej: 60"
                step="0.01"
              />
            </label>

            {errorMessage && <p className="form-message error">{errorMessage}</p>}
            {successMessage && (
              <p className="form-message success">{successMessage}</p>
            )}

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar sensor"
                  : "Crear sensor"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </article>
        </AdminOnly>

        <section className="panel">
          <div className="panel-header">
            <h2>Listado de sensores</h2>
            <p>Consulta, edita o elimina los sensores registrados.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Zona</th>
                  <th>Tipo</th>
                  <th>Rango</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Cargando sensores...
                    </td>
                  </tr>
                ) : sensors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No hay sensores registrados.
                    </td>
                  </tr>
                ) : (
                  sensors.map((sensor) => (
                    <tr key={sensor.id}>
                      <td>
                        <strong>{sensor.code}</strong>
                        <span>{sensor.name}</span>
                      </td>

                      <td>{sensor.zoneName || "Sin zona"}</td>

                      <td>{sensor.type}</td>

                      <td>
                        {formatRange(sensor.minValue, sensor.maxValue, sensor.unit)}
                      </td>

                      <td>
                        <span className="badge success">{sensor.status}</span>
                      </td>

                      <td>
                        <AdminOnly fallback={<span className="read-only-label">Solo lectura</span>}>
  <div className="table-actions">
    <button
      type="button"
      className="small-button"
      onClick={() => handleEdit(sensor)}
    >
      Editar
    </button>

    <button
      type="button"
      className="danger-button"
      onClick={() => handleDelete(sensor.id)}
    >
      Eliminar
    </button>
  </div>
</AdminOnly>
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

function formatRange(minValue, maxValue, unit) {
  const min = minValue !== null && minValue !== undefined ? minValue : "—";
  const max = maxValue !== null && maxValue !== undefined ? maxValue : "—";

  return `${min} ${unit || ""} - ${max} ${unit || ""}`;
}