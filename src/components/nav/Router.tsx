import AppPage from "../../pages/app"
import LandingPage from "../../pages/landing"
import React, { useEffect } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

const NavRouter: React.FC = () => {
    const navigate = useNavigate()
  
    useEffect(() => {
      const startupPage = window.localStorage.getItem('startupPage')
      if (startupPage) {
        navigate(startupPage)
      }
    }, [navigate])
  
    return (
      <>
        <Routes>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/settings'} element={<LandingPage />} />
          <Route path={'/developer'} element={<LandingPage />} />
          <Route path={'/app/:app'} element={<AppPage />} />
          <Route path={'/app'} element={<AppPage />} />
          <Route path={'*'} element={<LandingPage />} />
        </Routes>
      </>
    )
  }

  export default NavRouter