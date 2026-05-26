import { useEffect, useState } from "react";
import {
  RefreshCw,
  Shield,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";

import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/api";

import { useAuth } from "../context/AuthContext";
import { AdminOnly, PermissionNotice } from "../components/auth/RoleGuard";

export default function UsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No fue posible cargar los usuarios registrados.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSavingUserId(userId);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      );

      setSuccessMessage("Rol actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setErrorMessage("No fue posible actualizar el rol del usuario.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setSavingUserId(userId);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedUser = await updateUserStatus(userId, newStatus);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      );

      setSuccessMessage("Estado actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setErrorMessage("No fue posible actualizar el estado del usuario.");
    } finally {
      setSavingUserId(null);
    }
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((item) => item.role === "ADMIN").length;
  const totalOperators = users.filter((item) => item.role === "OPERATOR").length;
  const totalActive = users.filter((item) => item.status === "ACTIVE").length;

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AdminOnly
      fallback={
        <PermissionNotice
          title="Acceso restringido"
          message="Solo los administradores pueden gestionar usuarios, roles y estados de cuenta."
        />
      }
    >
      <div className="module-page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Seguridad del sistema</p>
            <h1>Gestión de usuarios</h1>
            <p>
              Administra los usuarios registrados, sus roles de acceso y el
              estado de cada cuenta dentro de AgroGreen Smart System.
            </p>
          </div>

          <button type="button" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </header>

        {errorMessage && <p className="form-message error">{errorMessage}</p>}
        {successMessage && (
          <p className="form-message success">{successMessage}</p>
        )}

        <section className="summary-grid compact-summary">
          <article className="summary-card">
            <span className="summary-card-icon">
              <Users size={24} />
            </span>

            <div>
              <p className="summary-card-title">Usuarios</p>
              <h2 className="summary-card-value">{totalUsers}</h2>
              <p className="summary-card-description">
                Cuentas registradas
              </p>
            </div>
          </article>

          <article className="summary-card">
            <span className="summary-card-icon">
              <Shield size={24} />
            </span>

            <div>
              <p className="summary-card-title">Administradores</p>
              <h2 className="summary-card-value">{totalAdmins}</h2>
              <p className="summary-card-description">
                Usuarios con control total
              </p>
            </div>
          </article>

          <article className="summary-card">
            <span className="summary-card-icon">
              <UserCog size={24} />
            </span>

            <div>
              <p className="summary-card-title">Operadores</p>
              <h2 className="summary-card-value">{totalOperators}</h2>
              <p className="summary-card-description">
                Usuarios operativos
              </p>
            </div>
          </article>

          <article className="summary-card">
            <span className="summary-card-icon">
              <UserCheck size={24} />
            </span>

            <div>
              <p className="summary-card-title">Activos</p>
              <h2 className="summary-card-value">{totalActive}</h2>
              <p className="summary-card-description">
                Cuentas habilitadas
              </p>
            </div>
          </article>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Listado de usuarios</h2>
            <p>
              Cambia el rol o el estado de las cuentas registradas. Por
              seguridad, tu propia cuenta no se modifica desde esta tabla.
            </p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => {
                    const isCurrentUser = item.id === user?.id;
                    const isSaving = savingUserId === item.id;

                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.fullName}</strong>
                          {isCurrentUser && <span>Cuenta actual</span>}
                        </td>

                        <td>{item.email}</td>

                        <td>
                          <span
                            className={`badge ${
                              item.role === "ADMIN" ? "success" : "neutral"
                            }`}
                          >
                            {item.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              item.status === "ACTIVE" ? "success" : "danger"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions user-actions">
                            <select
                              value={item.role}
                              disabled={isCurrentUser || isSaving}
                              onChange={(event) =>
                                handleRoleChange(item.id, event.target.value)
                              }
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="OPERATOR">OPERATOR</option>
                            </select>

                            <select
                              value={item.status}
                              disabled={isCurrentUser || isSaving}
                              onChange={(event) =>
                                handleStatusChange(item.id, event.target.value)
                              }
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="INACTIVE">INACTIVE</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminOnly>
  );
}