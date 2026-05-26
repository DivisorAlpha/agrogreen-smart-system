import { useEffect, useState } from "react";
import {
  createZone,
  deleteZone,
  getGreenhouses,
  getZones,
  updateZone,
} from "../services/api";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";

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

      setZones(Array.isArray(zonesData) ? zonesData : []);
      setGreenhouses(Array.isArray(greenhousesData) ? greenhousesData : []);
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

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      greenhouseId: Number(form.greenhouseId),
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

      resetForm();
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
      greenhouseId: zone.greenhouseId || "",
      name: zone.name || "",
      description: zone.description || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Deseas eliminar esta zona?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteZone(id);
      setSuccessMessage("Zona eliminada correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar la zona.");
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Distribución del invernadero</p>
          <h1>Zonas</h1>
          <p>Administra las zonas internas asociadas a cada invernadero.</p>
        </div>
      </div>

      {errorMessage && <p className="form-message error">{errorMessage}</p>}

      {successMessage && (
        <p className="form-message success">{successMessage}</p>
      )}

      <div className="content-grid zones-layout">
        <AdminOnly
          fallback={
            <PermissionNotice
              title="Solo consulta"
              message="Tu rol permite consultar zonas, pero solo un administrador puede crear o modificar registros."
            />
          }
        >
          <article className="panel form-panel">
            <h2>{editingId ? "Editar zona" : "Crear zona"}</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Invernadero
                <select
                  name="greenhouseId"
                  value={form.greenhouseId}
                  onChange={handleChange}
                  required
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
                Nombre
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Zona Norte"
                  required
                />
              </label>

              <label>
                Descripción
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Zona destinada al cultivo de tomate."
                  rows="4"
                />
              </label>

              <button type="submit" disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar zona"
                  : "Guardar zona"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="small-button"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </form>
          </article>
        </AdminOnly>

        <article className="panel table-panel">
          <h2>Listado de zonas</h2>

          {loading && <p className="loading-text">Cargando zonas...</p>}

          {!loading && zones.length === 0 && (
            <p className="loading-text">No hay zonas registradas.</p>
          )}

          {!loading && zones.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Invernadero</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {zones.map((zone) => (
                    <tr key={zone.id}>
                      <td>{zone.name}</td>
                      <td>{zone.greenhouseName}</td>
                      <td>{zone.description}</td>
                      <td>
                        <AdminOnly
                          fallback={
                            <span className="read-only-label">
                              Solo lectura
                            </span>
                          }
                        >
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}