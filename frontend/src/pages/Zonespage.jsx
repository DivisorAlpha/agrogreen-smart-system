import { useEffect, useState } from "react";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";
import {
  createZone,
  deleteZone,
  getGreenhouses,
  getZones,
  updateZone,
} from "../services/api";

const initialForm = {
  greenhouseId: "",
  name: "",
  description: "",
};

export default function ZonesPage() {
  const [zones, setZones] = useState([]);
  const [greenhouses, setGreenhouses] = useState([]);
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

      const [zonesData, greenhousesData] = await Promise.all([
        getZones(),
        getGreenhouses(),
      ]);

      setZones(zonesData);
      setGreenhouses(greenhousesData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las zonas.");
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

    if (!form.greenhouseId || !form.name.trim()) {
      setErrorMessage("Debes seleccionar un invernadero y escribir el nombre de la zona.");
      return;
    }

    const payload = {
      greenhouseId: Number(form.greenhouseId),
      name: form.name,
      description: form.description,
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingId) {
        await updateZone(editingId, payload);
        setSuccessMessage("Zona actualizada correctamente.");
      } else {
        await createZone(payload);
        setSuccessMessage("Zona creada correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo guardar la zona.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (zone) => {
    setEditingId(zone.id);

    setForm({
      greenhouseId: zone.greenhouseId ? String(zone.greenhouseId) : "",
      name: zone.name || "",
      description: zone.description || "",
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
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta zona?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteZone(id);
      setSuccessMessage("Zona eliminada correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo eliminar. Puede tener cultivos, sensores o lecturas asociadas."
      );
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Gestión operativa</p>
          <h1>Zonas</h1>
          <p>
            Administra las áreas internas de cada invernadero para organizar sensores,
            cultivos y actuadores.
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
            <h2>{editingId ? "Editar zona" : "Nueva zona"}</h2>
            <p>
              Asocia cada zona a un invernadero existente.
            </p>
          </div>

          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Invernadero
              <select
                name="greenhouseId"
                value={form.greenhouseId}
                onChange={handleChange}
              >
                <option value="">Selecciona un invernadero</option>

                {greenhouses.map((greenhouse) => (
                  <option key={greenhouse.id} value={greenhouse.id}>
                    {greenhouse.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Nombre de la zona
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Zona Norte"
              />
            </label>

            <label>
              Descripción
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ej: Zona destinada al cultivo de tomate."
                rows="5"
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
                  ? "Actualizar zona"
                  : "Crear zona"}
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
            <h2>Listado de zonas</h2>
            <p>Consulta, edita o elimina las zonas registradas.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Zona</th>
                  <th>Invernadero</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Cargando zonas...
                    </td>
                  </tr>
                ) : zones.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No hay zonas registradas.
                    </td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr key={zone.id}>
                      <td>
                        <strong>{zone.name}</strong>
                        <span>{zone.description || "Sin descripción"}</span>
                      </td>

                      <td>{zone.greenhouseName || "Sin invernadero"}</td>

                      <td>
                        <span className="badge success">{zone.status}</span>
                      </td>

                      <td>{formatDate(zone.createdAt)}</td>

                      <td>
                        <AdminOnly fallback={<span className="read-only-label">Solo lectura</span>}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => handleEdit(zone)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => handleDelete(zone.id)}
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

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleDateString();
}