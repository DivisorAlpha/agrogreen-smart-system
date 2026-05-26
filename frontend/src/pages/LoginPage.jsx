import { useState } from "react";
import { Leaf, Lock, Mail } from "lucide-react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const initialForm = {
  email: "admin@agrogreen.com",
  password: "admin123",
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionExpired = searchParams.get("session") === "expired";

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
      setErrorMessage(t("auth.requiredFields"));
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
      setErrorMessage(t("auth.invalidCredentials"));
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
            <h1>{t("appName")}</h1>
            <p>{t("appSubtitle")}</p>
          </div>
        </div>

        <div className="auth-header">
          <p className="eyebrow">{t("auth.secureAccess")}</p>
          <h2>{t("auth.loginTitle")}</h2>
          <p>{t("auth.loginDescription")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t("auth.email")}
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
            {t("auth.password")}
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

          {sessionExpired && !errorMessage && (
            <p className="form-message error">{t("auth.sessionExpired")}</p>
          )}

          {errorMessage && (
            <p className="form-message error">{errorMessage}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? t("auth.validating") : t("auth.loginButton")}
          </button>
        </form>

        <p className="auth-footer">
          {t("auth.noAccount")}{" "}
          <Link to="/register">{t("auth.createAdmin")}</Link>
        </p>
      </section>
    </main>
  );
}