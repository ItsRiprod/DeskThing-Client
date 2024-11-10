import { HashRouter, Route, Routes, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import LandingPage from "./pages/landing"
import AppPage from "./pages/app"

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

function AppContent() {
  const navigate = useNavigate()

  useEffect(() => {
    const startupPage = window.localStorage.getItem('startupPage')
    if (startupPage) {
      navigate(startupPage)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/settings'} element={<LandingPage />} />
        <Route path={'/developer'} element={<LandingPage />} />
        <Route path={'/app/:app'} element={<AppPage />} />
        <Route path={'/app'} element={<AppPage />} />
      </Routes>
    </>
  )
}

export default App