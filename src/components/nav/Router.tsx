import { useSettingsStore } from '@src/stores'
import AppPage from '../../pages/app'
import LandingPage from '../../pages/landing'
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NowPlaying from '@src/pages/nowplaying'
import UtilityPage from '@src/pages/settings'
import DashboardPage from '@src/pages/dashboard'
import ClockPage from '@src/pages/clock'
import Logger from '@src/utils/Logger'

/**
 * A list of system application names that are considered "core" or "system" apps in the application.
 * These apps are typically accessible from the main navigation or landing page, and may have special
 * handling or behavior compared to other "user" applications.
 */
const SystemApps = [
  'nowplaying',
  'developer',
  'landing',
  'preferences',
  'settings',
  'utility',
  'dashboard',
  'clock'
]

/**
 * The main navigation router component for the application. This component sets up the routing
 * structure and maps routes to the appropriate page components.
 * 
 * The router handles the following functionality:
 * - Redirects the user to the appropriate page based on their preferences and onboarding status
 * - Defines the routes for the core system applications (e.g. "nowplaying", "dashboard", "settings")
 * - Handles routing to user-specific application pages (e.g. "/app/:app")
 * - Provides a fallback route to the landing page for any unmatched routes
 */
const NavRouter: React.FC = () => {
  const navigate = useNavigate()
  const preferences = useSettingsStore((store) => store.preferences)

  useEffect(() => {
    const currentView = preferences.currentView?.name || 'dashboard'
    if (preferences.onboarding) {
      if (SystemApps.includes(currentView)) {
        navigate('/' + currentView)
      } else {
        navigate('/app/' + currentView)
      }
    } else {
      Logger.info('User onboarding incomplete, navigating to landing page')
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
        <Route path={'/clock'} element={<ClockPage />} />
        <Route path={'/settings'} element={<UtilityPage />} />
        <Route path={'/utility'} element={<UtilityPage />} />
        <Route path={'/utility/:app'} element={<UtilityPage />} />
        <Route path={'/app/:app'} element={<AppPage />} />
        <Route path={'/app'} element={<AppPage />} />
        <Route path={'*'} element={<DashboardPage />} />
      </Routes>
    </>
  )
}

export default NavRouter
