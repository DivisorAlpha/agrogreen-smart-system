import {
  Activity,
  AlertTriangle,
  BarChart3,
  Fan,
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

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
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
            <h1>AgroGreen</h1>
            <p>Sistema inteligente</p>
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
            Panel
          </NavLink>

          <NavLink
            to="/monitoring"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Monitor size={18} />
            Monitoreo
          </NavLink>

          <NavLink
            to="/charts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <BarChart3 size={18} />
            Gráficas
          </NavLink>

          <NavLink
            to="/greenhouses"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Warehouse size={18} />
            Invernaderos
          </NavLink>

          <NavLink
            to="/zones"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Layers size={18} />
            Zonas
          </NavLink>

          <NavLink
            to="/crops"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Sprout size={18} />
            Cultivos
          </NavLink>

          <NavLink
            to="/sensors"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Thermometer size={18} />
            Sensores
          </NavLink>

          <NavLink
            to="/actuators"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Fan size={18} />
            Actuadores
          </NavLink>

          <NavLink
            to="/sensor-readings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Activity size={18} />
            Lecturas
          </NavLink>

          <NavLink
            to="/automation-rules"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Workflow size={18} />
            Reglas
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <AlertTriangle size={18} />
            Alertas
          </NavLink>
        </nav>

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
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}