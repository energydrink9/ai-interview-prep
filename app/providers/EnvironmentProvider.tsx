'use client'

import { PropsWithChildren, createContext } from "react"
import { EnvironmentContextType, getEnvironment } from "./environment-context"

export const EnvironmentContext = createContext<EnvironmentContextType>(getEnvironment())

interface EnvironmentProviderProps extends PropsWithChildren {
    value: EnvironmentContextType;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children, value }) => {

    return <EnvironmentContext.Provider value={value}>
        {children}
    </EnvironmentContext.Provider>
}