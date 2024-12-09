
import { useWebSocketStore } from '@src/stores/'

export const ServerStatus = () => {
  const isConnected = useWebSocketStore((state) => state.isConnected)
  const isReconnecting = useWebSocketStore((state) => state.isReconnecting)

  if (isConnected) return null

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm text-white">
      <div className="h-2 w-2 rounded-full bg-white" />
      {isReconnecting ? 'Reconnecting...' : 'Disconnected from server'}
    </div>
  )
}
