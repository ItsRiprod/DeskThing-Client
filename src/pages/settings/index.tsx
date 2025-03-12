import { useSearchParams } from 'react-router-dom'
import UtilityApp from './Utility'
import AppSettingsPage from './AppSettings'

/**
 * Renders the Utility page, which displays either the UtilityApp or the AppSettingsPage component based on the 'app' query parameter in the URL.
 * 
 * If the 'app' query parameter is present, the AppSettingsPage component is rendered with the value of the 'app' parameter as the 'appName' prop.
 * If the 'app' query parameter is not present, the UtilityApp component is rendered.
 * 
 * The component also logs the value of the 'app' query parameter to the console on mount.
 */
const UtilityPage = () => {
  const [searchParams] = useSearchParams()

  return searchParams.get('app') ? (
    <AppSettingsPage appName={searchParams.get('app')} />
  ) : (
    <UtilityApp />
  )
}

export default UtilityPage
