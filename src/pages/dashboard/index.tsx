import Button from "@src/components/ui/Button"
import { useAppStore, useMappingStore, useMusicStore, useSettingsStore, useWebSocketStore } from "@src/stores"
import { useTimeStore } from "@src/stores/timeStore"

const DashboardPage = () => {
    const isConnected = useWebSocketStore((state) => state.isConnected)
    const isReconnecting = useWebSocketStore((state) => state.isReconnecting)
    const apps = useAppStore((state) => state.apps)
    const currentApp = useSettingsStore((state) => state.preferences.currentView)
    const profile = useMappingStore((state) => state.profile)
    const song = useMusicStore((state) => state.song)
    const preferences = useSettingsStore((state) => state.preferences)
    const updatePreferences = useSettingsStore((state) => state.updatePreferences)
    const manifest = useSettingsStore((state) => state.manifest)
    const logs = useSettingsStore((state) => state.logs)
    const currentTime = useTimeStore((state) => state.currentTimeFormatted)

    const handleRestartOnboarding = () => {
        updatePreferences({
            onboarding: false,
            currentView: { name: 'landing'}
        })
    }

    const handleClockRoute = () => {
        updatePreferences({ currentView: { name: 'clock' }})
    }

    return (
        <div className="p-6 h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 overflow-y-auto">
            <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-200 mb-3">Connection Status</h2>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-300">Status: {isConnected ? 'Connected' : isReconnecting ? 'Reconnecting...' : 'Disconnected'}</span>
                    </div>
                    <div className="text-gray-300">Server: {manifest.ip}:{manifest.port}</div>
                </div>
            </section>

            <section className="m-2 bg-zinc-900 flex items-center justify-center rounded-lg p-4 shadow-lg">
                <Button onClick={handleClockRoute} className="bg-zinc-500">
                    <p>Open Clock</p>
                </Button>
            </section>

            <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-200 mb-3">Button Mappings</h2>
                <div className="text-gray-300">Active Profile: {profile?.name || 'None'}</div>
            </section>

            <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-200 mb-3">Music Player</h2>
                <div className="space-y-2">
                    <div className="text-gray-300">Current Track: {song?.track_name || 'None'}</div>
                    <div className="text-gray-300">Playing: {song?.is_playing ? 'Yes' : 'No'}</div>
                    <div className="text-gray-300">Volume: {song?.volume || 0}%</div>
                </div>
                <h2 className="text-xl font-bold text-gray-200 mb-3">Apps</h2>
                <div className="space-y-2">
                    <div className="text-gray-300">Loaded Apps: {apps.length}</div>
                    <div className="text-gray-300">Current App: {currentApp?.name || 'None'}</div>
                </div>
            </section>

            <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-200 mb-3">Settings</h2>
                <div className="space-y-2">
                    <div className="text-gray-300">Time: {currentTime}</div>
                    <div className="text-gray-300">Theme: {preferences.theme.scale}</div>
                    <div className="text-gray-300">Primary Color: {preferences.theme.primary}</div>
                    <div className="text-gray-300">Volume Mode: {preferences.volume}</div>
                    <Button onClick={handleRestartOnboarding} className="text-gray-300">Restart Onboarding</Button>
                    
                </div>
            </section>

            <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-gray-200 mb-3">Recent Logs</h2>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                    {logs.slice(-5).map((log, index) => (
                        <div key={index} className={`text-sm ${log.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                            [{log.app}] {log.payload}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default DashboardPage