import { useEffect, useState } from "react";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";
import {
  createGreenhouse,
  deleteGreenhouse,
  getGreenhouses,
  updateGreenhouse,
} from "../services/api";

const initialForm = {
  name: "",
  location: "",
  description: "",
};

export default function GreenhousesPage() {
  const [greenhouses, setGreenhouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadGreenhouses = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getGreenhouses();
      setGreenhouses(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los invernaderos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGreenhouses();
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

    if (!form.name.trim() || !form.location.trim()) {
      setErrorMessage("El nombre y la ubicación son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingId) {
        await updateGreenhouse(editingId, form);
        setSuccessMessage("Invernadero actualizado correctamente.");
      } else {
        await createGreenhouse(form);
        setSuccessMessage("Invernadero creado correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadGreenhouses();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo guardar el invernadero.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (greenhouse) => {
    setEditingId(greenhouse.id);
    setForm({
      name: greenhouse.name || "",
      location: greenhouse.location || "",
      description: greenhouse.description || "",
    });

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este invernadero?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteGreenhouse(id);
      setSuccessMessage("Invernadero eliminado correctamente.");
      await loadGreenhouses();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo eliminar. Puede tener zonas, sensores o datos asociados."
      );
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Gestión base</p>
          <h1>Invernaderos</h1>
          <p>
            Administra los invernaderos registrados en AgroGreen Smart System.
          </p>
        </div>

        <button onClick={loadGreenhouses}>Actualizar</button>
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
            <h2>{editingId ? "Editar invernadero" : "Nuevo invernadero"}</h2>
            <p>
              Registra la información general del espacio físico que será
              monitoreado.
            </p>
          </div>

          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Invernadero Principal"
              />
            </label>

            <label>
              Ubicación
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej: Neiva, Huila"
              />
            </label>

            <label>
              Descripción
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción general del invernadero"
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
                  ? "Actualizar"
                  : "Crear invernadero"}
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
            <h2>Listado de invernaderos</h2>
            <p>Consulta, edita o elimina los registros existentes.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Cargando invernaderos...
                    </td>
                  </tr>
                ) : greenhouses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No hay invernaderos registrados.
                    </td>
                  </tr>
                ) : (
                  greenhouses.map((greenhouse) => (
                    <tr key={greenhouse.id}>
                      <td>
                        <strong>{greenhouse.name}</strong>
                        <span>{greenhouse.description || "Sin descripción"}</span>
                      </td>
                      <td>{greenhouse.location}</td>
                      <td>
                        <span className="badge success">
                          {greenhouse.status}
                        </span>
                      </td>
                      <td>{formatDate(greenhouse.createdAt)}</td>
                      <td>
                        <AdminOnly fallback={<span className="read-only-label">Solo lectura</span>}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => handleEdit(greenhouse)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => handleDelete(greenhouse.id)}
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