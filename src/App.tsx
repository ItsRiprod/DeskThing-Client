import { HashRouter } from "react-router-dom"
import NavRouter from "./components/nav/Router"
import Overlays from "./overlay"
import { WebSocketListener } from "@src/components/websocketListener"
import { ButtonListener } from "./components/buttonListener"
import ErrorBoundary from "@src/pages/error/ErrorBoundary"

function App() {

  return (
    <HashRouter>
      <ErrorBoundary>
        <WebSocketListener />
        <ButtonListener />
        <Overlays>
          <NavRouter />
        </Overlays>
      </ErrorBoundary>
    </HashRouter>
  )
}

export default App