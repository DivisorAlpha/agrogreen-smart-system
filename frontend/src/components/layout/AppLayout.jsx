import {
  Activity,
  Fan,
  Layers,
  Leaf,
  LayoutDashboard,
  Sprout,
  Thermometer,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AppLayout({ children }) {
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
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={18} />
            Panel
          </NavLink>

          <NavLink to="/greenhouses" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Warehouse size={18} />
            Invernaderos
          </NavLink>

          <NavLink to="/zones" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Layers size={18} />
            Zonas
          </NavLink>

          <NavLink to="/crops" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Sprout size={18} />
            Cultivos
          </NavLink>

          <NavLink to="/sensors" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Thermometer size={18} />
            Sensores
          </NavLink>

          <NavLink to="/actuators" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Fan size={18} />
            Actuadores
          </NavLink>

          <NavLink to="/sensor-readings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Activity size={18} />
            Lecturas
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}