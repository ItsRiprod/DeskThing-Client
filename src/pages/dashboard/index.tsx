import Button from '@src/components/ui/Button'
import {
  useAppStore,
  useMappingStore,
  useMusicStore,
  useSettingsStore,
  useWebSocketStore
} from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'

/**
 * The `DashboardPage` component represents the main dashboard view of the application.
 * It displays various sections with information about the application's connection status,
 * button mappings, music player, loaded apps, and settings.
 *
 * The component uses several state hooks to access and update the application's state,
 * such as the WebSocket connection status, the current app, the user's profile, the
 * current song, and the user's preferences.
 *
 * The component also provides functionality to open the clock view and restart the
 * onboarding process.
 */
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
      currentView: {
        name: 'landing',
        enabled: true,
        running: true,
        timeStarted: 0,
        prefIndex: 0
      }
    })
  }

  const handleClockRoute = () => {
    updatePreferences({ currentView: {
      name: 'clock',
      enabled: true,
      running: true,
      timeStarted: 0,
      prefIndex: 0
    } })
  }

  return (
    <div className="p-4 h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-y-auto">
      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-700/30 backdrop-blur-sm hover:shadow-zinc-800/20 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Connection Status</span>
        </h2>
        <div className="space-y-3">
          <div className="flex items-center bg-zinc-800/50 p-2 rounded-lg">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shadow-lg`}></div>
            <span className="text-gray-200 text-sm">
              {isConnected ? 'Connected' : isReconnecting ? 'Reconnecting...' : 'Disconnected'}
            </span>
          </div>
          <div className="text-gray-400 text-sm bg-zinc-800/50 p-2 rounded-lg">
            {manifest.context.ip}:{manifest.context.port}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-700/30 backdrop-blur-sm hover:shadow-zinc-800/20 transition-all duration-300 flex items-center justify-center">
        <Button onClick={handleClockRoute} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-6 rounded-lg transform hover:scale-105 transition-all duration-300">
          Open Clock
        </Button>
      </section>

      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-700/30 backdrop-blur-sm hover:shadow-zinc-800/20 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
          <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Button Mappings</span>
        </h2>
        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <div className="text-gray-200 text-sm">Active Profile: {profile?.profileId || 'None'}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-700/30 backdrop-blur-sm hover:shadow-zinc-800/20 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Music Player</span>
        </h2>
        <div className="space-y-2">
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Track: {song?.track_name || 'None'}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Playing: {song?.is_playing ? 'Yes' : 'No'}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Volume: {song?.volume || 0}%</div>
        </div>
        <h2 className="text-xl font-bold text-gray-100 mt-4 mb-3">
          <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">Apps</span>
        </h2>
        <div className="space-y-2">
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Loaded: {apps.length}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Current: {currentApp?.name || 'None'}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-2xl border border-zinc-700/30 backdrop-blur-sm hover:shadow-zinc-800/20 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Settings</span>
        </h2>
        <div className="space-y-2">
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Time: {currentTime}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Theme: {preferences.theme.scale}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Color: {preferences.theme.primary}</div>
          <div className="bg-zinc-800/50 p-2 rounded-lg text-gray-200 text-sm">Volume: {preferences.volume}</div>
          <Button onClick={handleRestartOnboarding} className="w-full mt-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-300">
            Restart Onboarding
          </Button>
        </div>
      </section>

      <section className="m-2 bg-zinc-900 rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-200 mb-3">Recent Logs</h2>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {logs.slice(-5).map((log, index) => (
            <div
              key={index}
              className={`text-sm ${log.level === 'error' ? 'text-red-400' : 'text-gray-300'}`}
            >
              [{log.source}] {log.message}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
