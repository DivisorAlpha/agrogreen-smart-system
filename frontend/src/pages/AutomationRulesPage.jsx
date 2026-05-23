import { useEffect, useState } from "react";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";
import {
  createAutomationRule,
  deleteAutomationRule,
  evaluateAutomationRules,
  getActuators,
  getAutomationRules,
  getSensors,
  updateAutomationRule,
} from "../services/api";

const initialForm = {
  name: "",
  sensorCode: "",
  operator: ">",
  thresholdValue: "",
  actuatorCode: "",
  command: "TURN_ON",
  status: "ACTIVE",
};

const operators = [">", ">=", "<", "<=", "=="];

const commands = [
  { value: "TURN_ON", label: "Encender" },
  { value: "TURN_OFF", label: "Apagar" },
  { value: "TOGGLE", label: "Alternar" },
];

export default function AutomationRulesPage() {
  const [rules, setRules] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [rulesData, sensorsData, actuatorsData] = await Promise.all([
        getAutomationRules(),
        getSensors(),
        getActuators(),
      ]);

      setRules(rulesData);
      setSensors(sensorsData);
      setActuators(actuatorsData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las reglas de automatización.");
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
      !form.name.trim() ||
      !form.sensorCode ||
      !form.operator ||
      form.thresholdValue === "" ||
      !form.actuatorCode ||
      !form.command
    ) {
      setErrorMessage("Debes completar nombre, sensor, condición, actuador y comando.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sensorCode: form.sensorCode,
      operator: form.operator,
      thresholdValue: Number(form.thresholdValue),
      actuatorCode: form.actuatorCode,
      command: form.command,
      status: form.status,
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");
      setEvaluationResult(null);

      if (editingId) {
        await updateAutomationRule(editingId, payload);
        setSuccessMessage("Regla actualizada correctamente.");
      } else {
        await createAutomationRule(payload);
        setSuccessMessage("Regla creada correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo guardar la regla. Verifica que el sensor y el actuador existan."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);

    setForm({
      name: rule.name || "",
      sensorCode: rule.sensorCode || "",
      operator: rule.operator || ">",
      thresholdValue:
        rule.thresholdValue !== null && rule.thresholdValue !== undefined
          ? String(rule.thresholdValue)
          : "",
      actuatorCode: rule.actuatorCode || "",
      command: rule.command || "TURN_ON",
      status: rule.status || "ACTIVE",
    });

    setErrorMessage("");
    setSuccessMessage("");
    setEvaluationResult(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrorMessage("");
    setSuccessMessage("");
    setEvaluationResult(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta regla?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");
      setEvaluationResult(null);

      await deleteAutomationRule(id);
      setSuccessMessage("Regla eliminada correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar la regla.");
    }
  };

  const handleEvaluate = async (sensorCode) => {
    if (!sensorCode) {
      setErrorMessage("La regla no tiene sensor asociado para evaluar.");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      setEvaluationResult(null);

      const response = await evaluateAutomationRules(sensorCode);
      setEvaluationResult(response);
      setSuccessMessage(`Evaluación ejecutada para el sensor ${sensorCode}.`);

      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo evaluar la regla. Verifica que el sensor tenga lecturas registradas."
      );
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Automatización inteligente</p>
          <h1>Reglas de automatización</h1>
          <p>
            Configura condiciones para que el sistema active actuadores de forma automática
            según las lecturas de los sensores.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="module-grid">
        <AdminOnly
  fallback={
    <PermissionNotice
      title="Reglas en modo consulta"
      message="Puedes consultar y evaluar reglas, pero solo un administrador puede crear, editar o eliminar reglas de automatización."
    />
  }
>
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? "Editar regla" : "Nueva regla"}</h2>
            <p>
              Define una condición sobre un sensor y el comando que debe ejecutarse
              sobre un actuador.
            </p>
          </div>

          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Nombre de la regla
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Encender ventilador por temperatura alta"
              />
            </label>

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
              Operador
              <select
                name="operator"
                value={form.operator}
                onChange={handleChange}
              >
                {operators.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Valor umbral
              <input
                type="number"
                name="thresholdValue"
                value={form.thresholdValue}
                onChange={handleChange}
                placeholder="Ej: 30"
                step="0.01"
              />
            </label>

            <label>
              Actuador
              <select
                name="actuatorCode"
                value={form.actuatorCode}
                onChange={handleChange}
              >
                <option value="">Selecciona un actuador</option>

                {actuators.map((actuator) => (
                  <option key={actuator.id} value={actuator.code}>
                    {actuator.code} — {actuator.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Comando
              <select name="command" value={form.command} onChange={handleChange}>
                {commands.map((command) => (
                  <option key={command.value} value={command.value}>
                    {command.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Estado de la regla
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">Activa</option>
                <option value="INACTIVE">Inactiva</option>
              </select>
            </label>

            {errorMessage && <p className="form-message error">{errorMessage}</p>}
            {successMessage && <p className="form-message success">{successMessage}</p>}

            {evaluationResult && (
              <div className="result-box">
                <h3>Resultado de evaluación</h3>
                <p>
                  Reglas evaluadas: <strong>{evaluationResult.rulesEvaluated}</strong>
                </p>
                <p>
                  Reglas ejecutadas: <strong>{evaluationResult.rulesTriggered}</strong>
                </p>

                {evaluationResult.actions?.length > 0 ? (
                  <ul>
                    {evaluationResult.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No se ejecutó ninguna acción automática.</p>
                )}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar regla"
                  : "Crear regla"}
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
            <h2>Listado de reglas</h2>
            <p>
              Consulta, edita, elimina o evalúa manualmente reglas de automatización.
            </p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Regla</th>
                  <th>Condición</th>
                  <th>Acción</th>
                  <th>Estado</th>
                  <th>Evaluar</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Cargando reglas...
                    </td>
                  </tr>
                ) : rules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No hay reglas registradas.
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => (
                    <tr key={rule.id}>
                      <td>
                        <strong>{rule.name}</strong>
                        <span>
                          Sensor: {rule.sensorCode} — Actuador: {rule.actuatorCode}
                        </span>
                      </td>

                      <td>
                        {rule.sensorCode} {rule.operator} {rule.thresholdValue}
                      </td>

                      <td>
                        {rule.actuatorCode} → {rule.command}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            rule.status === "ACTIVE" ? "success" : "neutral"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleEvaluate(rule.sensorCode)}
                        >
                          Evaluar
                        </button>
                      </td>

                      <td>
                        <AdminOnly fallback={<span className="read-only-label">Solo evaluación</span>}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => handleEdit(rule)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => handleDelete(rule.id)}
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