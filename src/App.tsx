import { HashRouter } from "react-router-dom"
import NavRouter from "./components/nav/Router"
import Overlays from "./overlay"
import { WebSocketListener } from "@src/components/websocketListener"

function App() {

  return (
    <HashRouter>
      <WebSocketListener />
      <Overlays>
        <NavRouter />
      </Overlays>
    </HashRouter>
  )
}

export default App