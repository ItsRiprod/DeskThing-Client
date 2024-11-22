import { HashRouter } from "react-router-dom"
import NavRouter from "./components/nav/Router"
import Overlays from "./overlay"
import { WebSocketListener } from "@src/components/websocketListener"
import { ButtonListener } from "./components/buttonListener"

function App() {

  return (
    <HashRouter>
      <WebSocketListener />
      <ButtonListener />
      <Overlays>
        <NavRouter />
      </Overlays>
    </HashRouter>
  )
}

export default App