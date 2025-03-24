import { ClientManifest } from "@DeskThing/types"

declare global {
  interface Window {
    manifest?: ClientManifest
  }
}
