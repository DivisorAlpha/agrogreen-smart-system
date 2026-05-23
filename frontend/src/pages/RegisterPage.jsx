import { useState } from "react";
import { Leaf, Lock, Mail, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  role: "ADMIN",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMessage("Nombre, correo y contraseña son obligatorios.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo registrar el usuario. Verifica si el correo ya existe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">
            <Leaf size={28} />
          </div>

          <div>
            <h1>AgroGreen</h1>
            <p>Smart System</p>
          </div>
        </div>

        <div className="auth-header">
          <p className="eyebrow">Registro inicial</p>
          <h2>Crear administrador</h2>
          <p>
            Crea una cuenta administrativa para gestionar el sistema inteligente
            de invernadero.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <div className="auth-input">
              <User size={18} />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Administrador AgroGreen"
              />
            </div>
          </label>

          <label>
            Correo electrónico
            <div className="auth-input">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@agrogreen.com"
              />
            </div>
          </label>

          <label>
            Contraseña
            <div className="auth-input">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </label>

          <label>
            Rol
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="ADMIN">ADMIN</option>
              <option value="OPERATOR">OPERATOR</option>
            </select>
          </label>

          {errorMessage && <p className="form-message error">{errorMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}