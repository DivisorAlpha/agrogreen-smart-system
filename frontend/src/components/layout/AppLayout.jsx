import {
  Activity,
  AlertTriangle,
  BarChart3,
  Fan,
  Languages,
  Layers,
  Leaf,
  LayoutDashboard,
  LogOut,
  Monitor,
  Sprout,
  Thermometer,
  UserCircle,
  Warehouse,
  Workflow,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Leaf size={24} />
          </div>

          <div>
            <h1>{t("appName")}</h1>
            <p>{t("appSubtitle")}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <LayoutDashboard size={18} />
            {t("menu.dashboard")}
          </NavLink>

          <NavLink
            to="/monitoring"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Monitor size={18} />
            {t("menu.monitoring")}
          </NavLink>

          <NavLink
            to="/charts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <BarChart3 size={18} />
            {t("menu.charts")}
          </NavLink>

          <NavLink
            to="/greenhouses"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Warehouse size={18} />
            {t("menu.greenhouses")}
          </NavLink>

          <NavLink
            to="/zones"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Layers size={18} />
            {t("menu.zones")}
          </NavLink>

          <NavLink
            to="/crops"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Sprout size={18} />
            {t("menu.crops")}
          </NavLink>

          <NavLink
            to="/sensors"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Thermometer size={18} />
            {t("menu.sensors")}
          </NavLink>

          <NavLink
            to="/actuators"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Fan size={18} />
            {t("menu.actuators")}
          </NavLink>

          <NavLink
            to="/sensor-readings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Activity size={18} />
            {t("menu.readings")}
          </NavLink>

          <NavLink
            to="/automation-rules"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Workflow size={18} />
            {t("menu.rules")}
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <AlertTriangle size={18} />
            {t("menu.alerts")}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <UserCircle size={18} />
            {t("menu.profile")}
          </NavLink>
        </nav>

        <div className="language-switcher">
          <div>
            <Languages size={16} />
            <span>{t("common.language")}</span>
          </div>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="es">{t("common.spanish")}</option>
            <option value="en">{t("common.english")}</option>
          </select>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <UserCircle size={22} />

            <div>
              <strong>{user?.fullName || "Usuario"}</strong>
              <span>{user?.role || "SIN ROL"}</span>
            </div>
          </div>

          <button type="button" onClick={handleLogout}>
            <LogOut size={16} />
            {t("menu.logout")}
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}