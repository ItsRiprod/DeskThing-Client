import { useSearchParams } from "react-router-dom"
import UtilityApp from "./Utility"
import AppSettingsPage from "./AppSettings"
import { useEffect } from "react"
const UtilityPage = () => {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        console.log(searchParams.get('app'))
    }, [searchParams])

    return (
        searchParams.get('app') ? (
            <AppSettingsPage appName={searchParams.get('app')} />
        ) : (
            <UtilityApp />

        )
    )
}

export default UtilityPage