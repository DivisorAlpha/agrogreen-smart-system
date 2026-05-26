import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export function AdminOnly({ children, fallback = null }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return fallback;
  }

  return children;
}

export function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowedRoles)) {
    return fallback;
  }

  return children;
}

export function PermissionNotice({ title, message }) {
  const { t } = useLanguage();

  const finalTitle = title || t("permissions.consultationMode");
  const finalMessage = message || t("permissions.consultationMessage");

  return (
    <article className="panel permission-panel">
      <div className="permission-icon">
        <ShieldAlert size={28} />
      </div>

      <div>
        <h2>{finalTitle}</h2>
        <p>{finalMessage}</p>
      </div>
    </article>
  );
}