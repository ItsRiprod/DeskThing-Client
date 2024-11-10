import { useParams } from "react-router-dom"

export default function AppPage() {
  const { app } = useParams()

  return (
    <div className="w-screen h-screen bg-black flex-col flex items-center justify-center">
      <h1>App Page</h1>
      <p>Current path: {app}</p>
    </div>
  )
}