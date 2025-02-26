import { HashRouter } from 'react-router-dom'
import NavRouter from './components/nav/Router'
import Overlays from './overlay'
import { WebSocketListener } from '@src/components/websocketListener'
import { ButtonListener } from './components/ButtonListener'
import ErrorBoundary from '@src/pages/error/ErrorBoundary'
import { SwipeListener } from './components/SwipeListener'

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <WebSocketListener />
        <ButtonListener />
        <SwipeListener />
        <Overlays>
          <NavRouter />
        </Overlays>
      </ErrorBoundary>
    </HashRouter>
  )
}

export default App
