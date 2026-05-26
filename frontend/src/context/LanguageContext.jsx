import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "agrogreen_language";

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "es";
  });

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  const t = (path) => {
    return path.split(".").reduce((current, key) => {
      return current?.[key];
    }, translations[language]) || path;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      availableLanguages: ["es", "en"],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}