import { useSettingsStore } from "@src/stores"
import AppPage from "../../pages/app"
import LandingPage from "../../pages/landing"
import React, { useEffect } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import NowPlaying from "@src/pages/nowplaying"
import UtilityPage from "@src/pages/settings"
import DashboardPage from "@src/pages/dashboard"

const SystemApps = [
    'nowplaying',
    'developer',
    'landing',
    'preferences',
    'settings',
    'utility',
    'dashboard'
]

const NavRouter: React.FC = () => {
    const navigate = useNavigate()
    const preferences = useSettingsStore((store) => store.preferences)
  
    useEffect(() => {
      if (!preferences.saveLocation) return

      const currentView = preferences.currentView.name
      if (preferences.onboarding) {
        if (SystemApps.includes(currentView)) {
          navigate('/' + currentView)
        } else {
          navigate('/app/' + currentView)
        }
      } else {
        navigate('/')
      }
    }, [navigate, preferences])
  
    return (
      <>
        <Routes>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/preferences'} element={<LandingPage />} />
          <Route path={'/developer'} element={<LandingPage />} />
          <Route path={'/nowplaying'} element={<NowPlaying />} />
          <Route path={'/dashboard'} element={<DashboardPage />} />
          <Route path={'/settings'} element={<UtilityPage />} />
          <Route path={'/utility'} element={<UtilityPage />} />
          <Route path={'/utility/:app'} element={<UtilityPage />} />
          <Route path={'/app/:app'} element={<AppPage />} />
          <Route path={'/app'} element={<AppPage />} />
          <Route path={'*'} element={<LandingPage />} />
        </Routes>
      </>
    )
  }

  export default NavRouter