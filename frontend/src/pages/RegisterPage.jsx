import { useState } from "react";
import { Leaf, Lock, Mail, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
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

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!fullName || !email || !password) {
      setErrorMessage("Nombre, correo y contraseña son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await register({
        fullName,
        email,
        password,
        role: "OPERATOR",
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
            <p>Sistema inteligente</p>
          </div>
        </div>

        <div className="auth-header">
          <p className="eyebrow">REGISTRO DE USUARIO</p>
          <h2>Crear usuario</h2>
          <p>
            Crea una cuenta de operador para acceder al sistema inteligente de
            invernadero.
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
                placeholder="Nombre completo"
                autoComplete="name"
                required
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
                placeholder="usuario@agrogreen.com"
                autoComplete="email"
                required
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
                autoComplete="new-password"
                required
              />
            </div>
          </label>

          <p className="form-helper">
            La cuenta será creada con permisos de operador.
          </p>

          {errorMessage && (
            <p className="form-message error">{errorMessage}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creando usuario..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}