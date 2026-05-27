import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Leaf, Lock, Mail } from "lucide-react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, googleLogin, isAuthenticated } = useAuth();
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

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setErrorMessage("No se recibió una credencial válida de Google.");
      return;
    }

    try {
      setGoogleLoading(true);
      setErrorMessage("");

      await googleLogin(credentialResponse.credential);

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "No se pudo iniciar sesión con Google. Intenta nuevamente."
      );
    } finally {
      setGoogleLoading(false);
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
                placeholder={t("auth.email")}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
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
                placeholder={t("auth.password")}
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {sessionExpired && !errorMessage && (
            <p className="form-message error">{t("auth.sessionExpired")}</p>
          )}

          {errorMessage && (
            <p className="form-message error">{errorMessage}</p>
          )}

          <button type="submit" disabled={loading || googleLoading}>
            {loading ? t("auth.validating") : t("auth.loginButton")}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-login-box">
          {googleLoading ? (
            <button type="button" disabled>
              Connecting with Google...
            </button>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setErrorMessage("Google login could not be completed.")
              }
            />
          )}
        </div>

        <p className="auth-footer">
          {t("auth.noAccount")} <Link to="/register">Crear usuario</Link>
        </p>
      </section>
    </main>
  );
}