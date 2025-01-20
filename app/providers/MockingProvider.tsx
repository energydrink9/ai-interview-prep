'use client'

import { enableMocking } from '../mocks/enable-mocking'
import { PropsWithChildren, useEffect } from "react"

const ENABLE_MOCKING = process.env.NEXT_PUBLIC_ENABLE_MOCKING == 'true'


export const MockingProvider: React.FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        if (ENABLE_MOCKING) {
            enableMocking()
        }
    }, [])

    return <>{children}</>
}