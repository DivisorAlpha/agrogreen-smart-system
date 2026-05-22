import { useEffect, useState } from "react";
import {
  createActuator,
  deleteActuator,
  executeActuatorCommand,
  getActuators,
  getZones,
  updateActuator,
} from "../services/api";

const initialForm = {
  zoneId: "",
  code: "",
  name: "",
  type: "FAN",
  state: "OFF",
  operationalStatus: "ACTIVE",
};

const actuatorTypes = [
  { value: "FAN", label: "Ventilador" },
  { value: "WATER_PUMP", label: "Bomba de riego" },
  { value: "LIGHT", label: "Luz" },
  { value: "EXTRACTOR", label: "Extractor" },
  { value: "VALVE", label: "Válvula" },
  { value: "MISTING_SYSTEM", label: "Nebulizador" },
  { value: "HEATER", label: "Calefactor" },
];

export default function ActuatorsPage() {
  const [actuators, setActuators] = useState([]);
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

      const [actuatorsData, zonesData] = await Promise.all([
        getActuators(),
        getZones(),
      ]);

      setActuators(actuatorsData);
      setZones(zonesData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los actuadores.");
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

    if (
      !form.zoneId ||
      !form.code.trim() ||
      !form.name.trim() ||
      !form.type.trim()
    ) {
      setErrorMessage("La zona, código, nombre y tipo son obligatorios.");
      return;
    }

    const payload = {
      zoneId: Number(form.zoneId),
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      state: form.state,
      operationalStatus: form.operationalStatus,
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingId) {
        await updateActuator(editingId, payload);
        setSuccessMessage("Actuador actualizado correctamente.");
      } else {
        await createActuator(payload);
        setSuccessMessage("Actuador creado correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo guardar el actuador. Verifica que el código no esté repetido."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (actuator) => {
    setEditingId(actuator.id);

    setForm({
      zoneId: actuator.zoneId ? String(actuator.zoneId) : "",
      code: actuator.code || "",
      name: actuator.name || "",
      type: actuator.type || "FAN",
      state: actuator.state || "OFF",
      operationalStatus: actuator.operationalStatus || "ACTIVE",
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
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este actuador?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteActuator(id);
      setSuccessMessage("Actuador eliminado correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo eliminar. Puede tener reglas de automatización asociadas."
      );
    }
  };

  const handleCommand = async (code, command) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await executeActuatorCommand(code, command);

      const commandText = {
        TURN_ON: "encendido",
        TURN_OFF: "apagado",
        TOGGLE: "alternado",
      };

      setSuccessMessage(
        `Actuador ${code} ${commandText[command] || "actualizado"} correctamente.`
      );

      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo ejecutar el comando. Verifica que el actuador esté activo."
      );
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Control físico</p>
          <h1>Actuadores</h1>
          <p>
            Administra dispositivos físicos como ventiladores, bombas, luces y
            extractores. También puedes ejecutar comandos desde el frontend.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="module-grid">
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? "Editar actuador" : "Nuevo actuador"}</h2>
            <p>
              Registra el dispositivo, su zona, tipo, estado físico y estado
              operacional.
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
              Código del actuador
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Ej: FAN-001"
              />
            </label>

            <label>
              Nombre del actuador
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Ventilador zona norte"
              />
            </label>

            <label>
              Tipo de actuador
              <select name="type" value={form.type} onChange={handleChange}>
                {actuatorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Estado físico
              <select name="state" value={form.state} onChange={handleChange}>
                <option value="OFF">Apagado</option>
                <option value="ON">Encendido</option>
              </select>
            </label>

            <label>
              Estado operacional
              <select
                name="operationalStatus"
                value={form.operationalStatus}
                onChange={handleChange}
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="MAINTENANCE">Mantenimiento</option>
              </select>
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
                  ? "Actualizar actuador"
                  : "Crear actuador"}
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

        <section className="panel">
          <div className="panel-header">
            <h2>Listado de actuadores</h2>
            <p>
              Consulta, edita, elimina o ejecuta comandos sobre los actuadores.
            </p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Actuador</th>
                  <th>Zona</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Operación</th>
                  <th>Comandos</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      Cargando actuadores...
                    </td>
                  </tr>
                ) : actuators.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      No hay actuadores registrados.
                    </td>
                  </tr>
                ) : (
                  actuators.map((actuator) => (
                    <tr key={actuator.id}>
                      <td>
                        <strong>{actuator.code}</strong>
                        <span>{actuator.name}</span>
                      </td>

                      <td>{actuator.zoneName || "Sin zona"}</td>

                      <td>{actuator.type}</td>

                      <td>
                        <span
                          className={`badge ${
                            actuator.state === "ON" ? "success" : "neutral"
                          }`}
                        >
                          {actuator.state}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            actuator.operationalStatus === "ACTIVE"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {actuator.operationalStatus}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="small-button"
                            onClick={() =>
                              handleCommand(actuator.code, "TURN_ON")
                            }
                          >
                            ON
                          </button>

                          <button
                            type="button"
                            className="secondary-small-button"
                            onClick={() =>
                              handleCommand(actuator.code, "TURN_OFF")
                            }
                          >
                            OFF
                          </button>

                          <button
                            type="button"
                            className="small-button"
                            onClick={() =>
                              handleCommand(actuator.code, "TOGGLE")
                            }
                          >
                            TOGGLE
                          </button>
                        </div>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="small-button"
                            onClick={() => handleEdit(actuator)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => handleDelete(actuator.id)}
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