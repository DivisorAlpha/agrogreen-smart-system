import { useState } from "react";
import { Leaf, Lock, Mail } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "admin@agrogreen.com",
  password: "admin123",
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, isAuthenticated } = useAuth();
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

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage("Debes escribir correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("Credenciales incorrectas o usuario no registrado.");
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
          <p className="eyebrow">Acceso seguro</p>
          <h2>Iniciar sesión</h2>
          <p>
            Ingresa con tu usuario administrador para acceder al sistema
            inteligente de invernadero.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="********"
              />
            </div>
          </label>

          {errorMessage && <p className="form-message error">{errorMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Validando..." : "Entrar al sistema"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes usuario? <Link to="/register">Crear administrador</Link>
        </p>
      </section>
    </main>
  );
}