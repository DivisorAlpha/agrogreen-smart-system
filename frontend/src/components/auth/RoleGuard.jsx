import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminOnly({ children, fallback = null }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return fallback;
  }

  return children;
}

export function RoleGuard({ allowedRoles, children, fallback = null }) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowedRoles)) {
    return fallback;
  }

  return children;
}

export function PermissionNotice({
  title = "Modo consulta",
  message = "Tu rol actual permite consultar información, pero no modificar esta sección.",
}) {
  return (
    <article className="panel permission-panel">
      <div className="permission-icon">
        <ShieldAlert size={28} />
      </div>

      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </article>
  );
}