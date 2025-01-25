import { useContext } from "react"
import { EnvironmentContext } from "./EnvironmentProvider"
import { EnvironmentContextType } from "./environment-context"

export const useEnvironment = (): EnvironmentContextType => {

    const environment = useContext(EnvironmentContext)

    return environment
}