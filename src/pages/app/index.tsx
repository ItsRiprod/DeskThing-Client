import { useParams } from "react-router-dom"
import WebPage from "./Web"

export default function AppPage() {
  const { app } = useParams()

  return (
    <div className="w-screen h-full bg-black">
      <WebPage currentView={app || ''} />
    </div>
  )
}