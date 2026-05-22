import { useEffect, useState } from "react";
import {
  createCrop,
  deleteCrop,
  getCrops,
  getZones,
  updateCrop,
} from "../services/api";

const initialForm = {
  zoneId: "",
  name: "",
  scientificName: "",
  plantingDate: "",
  estimatedHarvestDate: "",
};

export default function CropsPage() {
  const [crops, setCrops] = useState([]);
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

      const [cropsData, zonesData] = await Promise.all([
        getCrops(),
        getZones(),
      ]);

      setCrops(cropsData);
      setZones(zonesData);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los cultivos.");
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

    if (!form.zoneId || !form.name.trim()) {
      setErrorMessage("Debes seleccionar una zona y escribir el nombre del cultivo.");
      return;
    }

    const payload = {
      zoneId: Number(form.zoneId),
      name: form.name,
      scientificName: form.scientificName,
      plantingDate: form.plantingDate || null,
      estimatedHarvestDate: form.estimatedHarvestDate || null,
    };

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingId) {
        await updateCrop(editingId, payload);
        setSuccessMessage("Cultivo actualizado correctamente.");
      } else {
        await createCrop(payload);
        setSuccessMessage("Cultivo creado correctamente.");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo guardar el cultivo.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (crop) => {
    setEditingId(crop.id);

    setForm({
      zoneId: crop.zoneId ? String(crop.zoneId) : "",
      name: crop.name || "",
      scientificName: crop.scientificName || "",
      plantingDate: crop.plantingDate || "",
      estimatedHarvestDate: crop.estimatedHarvestDate || "",
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
    const confirmed = window.confirm("¿Seguro que deseas eliminar este cultivo?");

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteCrop(id);
      setSuccessMessage("Cultivo eliminado correctamente.");
      await loadData();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar el cultivo.");
    }
  };

  return (
    <div className="module-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Gestión agrícola</p>
          <h1>Cultivos</h1>
          <p>
            Administra los cultivos sembrados en cada zona del invernadero.
          </p>
        </div>

        <button onClick={loadData}>Actualizar</button>
      </header>

      <section className="module-grid">
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? "Editar cultivo" : "Nuevo cultivo"}</h2>
            <p>
              Registra el cultivo, su zona, nombre científico y fechas de seguimiento.
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
              Nombre del cultivo
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Tomate"
              />
            </label>

            <label>
              Nombre científico
              <input
                type="text"
                name="scientificName"
                value={form.scientificName}
                onChange={handleChange}
                placeholder="Ej: Solanum lycopersicum"
              />
            </label>

            <label>
              Fecha de siembra
              <input
                type="date"
                name="plantingDate"
                value={form.plantingDate}
                onChange={handleChange}
              />
            </label>

            <label>
              Fecha estimada de cosecha
              <input
                type="date"
                name="estimatedHarvestDate"
                value={form.estimatedHarvestDate}
                onChange={handleChange}
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
                  ? "Actualizar cultivo"
                  : "Crear cultivo"}
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
            <h2>Listado de cultivos</h2>
            <p>Consulta, edita o elimina los cultivos registrados.</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Cultivo</th>
                  <th>Zona</th>
                  <th>Siembra</th>
                  <th>Cosecha estimada</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Cargando cultivos...
                    </td>
                  </tr>
                ) : crops.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No hay cultivos registrados.
                    </td>
                  </tr>
                ) : (
                  crops.map((crop) => (
                    <tr key={crop.id}>
                      <td>
                        <strong>{crop.name}</strong>
                        <span>{crop.scientificName || "Sin nombre científico"}</span>
                      </td>

                      <td>{crop.zoneName || "Sin zona"}</td>

                      <td>{formatDate(crop.plantingDate)}</td>

                      <td>{formatDate(crop.estimatedHarvestDate)}</td>

                      <td>
                        <span className="badge success">{crop.status}</span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="small-button"
                            onClick={() => handleEdit(crop)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => handleDelete(crop.id)}
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
  return new Date(value).toLocaleDateString();
}