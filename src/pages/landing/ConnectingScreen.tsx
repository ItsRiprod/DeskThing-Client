import React, { useEffect, useState } from 'react'
import { IconDisconnect, IconLogoGearLoading } from '../../assets/Icons'
import { useSettingsStore, useWebSocketStore } from '@src/stores'
import { StepProps } from '.'
import Button from '@src/components/ui/Button'

const ConnectingPage: React.FC<StepProps> = ({ setNextSteps }) => {
    const [onLoad, setOnLoad] = useState(false)
    const connectionStatus = useWebSocketStore((state) => state.isConnected)
    const isReconecting = useWebSocketStore((state) => state.isReconnecting)
    const disconnect = useWebSocketStore((state) => state.disconnect)
    const reconnect = useWebSocketStore((state) => state.reconnect)
    const connectionIp = useSettingsStore((state) => state.manifest.ip)
    const connectionPort = useSettingsStore((state) => state.manifest.port)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setOnLoad(true)
            setNextSteps(true)
            console.log('Showing next steps')
        }, 1000)
        
        return clearTimeout(timeoutId)
    }, [])

    useEffect(() => {
        if (connectionStatus) {
            setNextSteps(true)
        }
    }, [connectionStatus])


    return (
        <div className="w-full h-full bg-black flex-col flex items-center justify-center">
            <h1>Let's start with connecting to the DeskThing Server</h1>
            {onLoad}
            {connectionStatus ? (
                <div className="flex flex-col space-x-2 items-center">
                    <p className="text-4xl font-semibold mb-2">Connected to {connectionIp}:{connectionPort}</p>
                    <Button onClick={disconnect} className="border border-red-500 items-center">
                        <IconDisconnect />
                        <p className="font-semibold mx-2">Disconnect</p>
                    </Button>
                </div>
            ) : isReconecting ? (
                <div className="flex space-x-2 items-center">
                    <IconLogoGearLoading iconSize={48} />
                    <p className="text-4xl font-semibold mb-2">Attempting to connect to {connectionIp}:{connectionPort}</p>
                </div>
            ) : (
                <div className="flex flex-col space-x-2 items-center">
                    <p className="text-4xl font-semibold mb-2">Disconnected!</p>
                    <Button onClick={reconnect} className="border border-green-500">
                        <p>Connect</p>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ConnectingPage