import { useEffect } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'

function Layout({ children }) {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en'
  }, [i18n.language])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Halo</p>
          <h1>{t('appName')}</h1>
        </div>
        <div className="language-switcher" aria-label="Language switcher">
          <button type="button" onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>
            EN
          </button>
          <button type="button" onClick={() => changeLanguage('ko')} className={i18n.language === 'ko' ? 'active' : ''}>
            KO
          </button>
        </div>
      </header>

      <nav className="nav">
        <NavLink to="/" end>
          {t('navigation.home')}
        </NavLink>
        <NavLink to="/settings">
          {t('navigation.settings')}
        </NavLink>
      </nav>

      <main className="content">{children}</main>
    </div>
  )
}

function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="page-card">
      <h2>{t('home.title')}</h2>
      <p>{t('home.subtitle')}</p>
    </section>
  )
}

function SettingsPage() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (event) => {
    const lng = event.target.value
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <section className="page-card">
      <h2>{t('settings.title')}</h2>
      <p>{t('settings.description')}</p>

      <label className="select-field">
        <span>{t('settings.languageLabel')}</span>
        <select value={i18n.language} onChange={changeLanguage}>
          <option value="en">{t('settings.languages.en')}</option>
          <option value="ko">{t('settings.languages.ko')}</option>
        </select>
      </label>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
