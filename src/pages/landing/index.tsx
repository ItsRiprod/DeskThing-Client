import React from 'react'
import { IconLogo } from '../../assets/Icons'
import { useLocation, Link } from 'react-router-dom'
import { useSettingsStore } from '@src/stores'

const LandingPage: React.FC = () => {
    const location = useLocation()
    const settings = useSettingsStore((store) => store.settings)

    return (
        <div className="w-screen h-screen bg-black flex-col flex items-center justify-center">
            <h1 className="text-4xl font-semibold">Welcome to</h1>
            <IconLogo className="w-1/2 h-fit" />
            <div className="flex space-x-2 items-center">
                <p>Waiting For Connection...</p>
            </div>
            <p className="mt-4">Current page: {location.pathname}</p>
            
                        <Link to="/app" className="mt-4 text-blue-500 hover:text-blue-700 underline">
                            Go to App
                        </Link>
            <p>{JSON.stringify(settings)}</p>
        </div>
    )
}

export default LandingPage