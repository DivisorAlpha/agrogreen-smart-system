import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Shield, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProfilePage() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getCurrentUser();
      setProfile(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("profile.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t("profile.eyebrow")}</p>
          <h1>{t("profile.title")}</h1>
          <p>{t("profile.description")}</p>
        </div>

        <button type="button" className="danger-button" onClick={handleLogout}>
          {t("profile.logoutButton")}
        </button>
      </div>

      {loading && <p className="loading-text">{t("profile.loading")}</p>}

      {errorMessage && <p className="form-message error">{errorMessage}</p>}

      {profile && (
        <div className="profile-grid">
          <article className="panel profile-card">
            <div className="profile-avatar">
              <UserCircle size={64} />
            </div>

            <div>
              <h2>{profile.fullName}</h2>
              <p>{profile.email}</p>
            </div>

            <span className="status-pill active">
              <CheckCircle2 size={16} />
              {t("profile.activeSession")}
            </span>
          </article>

          <article className="panel profile-details">
            <h2>{t("profile.accountInfo")}</h2>

            <div className="profile-detail-item">
              <UserCircle size={20} />
              <div>
                <span>{t("profile.fullName")}</span>
                <strong>{profile.fullName}</strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <Mail size={20} />
              <div>
                <span>{t("profile.email")}</span>
                <strong>{profile.email}</strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <Shield size={20} />
              <div>
                <span>{t("profile.role")}</span>
                <strong>{profile.role}</strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <CheckCircle2 size={20} />
              <div>
                <span>{t("profile.status")}</span>
                <strong>{profile.status}</strong>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}