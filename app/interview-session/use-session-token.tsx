import { useQuery } from "@tanstack/react-query"
import { fetchSessionToken } from "../api/fetch-session-token"
import { useAuth0 } from "@auth0/auth0-react"
import { useMemo } from "react"

export const useSessionToken = () => {

    const { isAuthenticated } = useAuth0()

    const { status, data: sessionToken, refetch,  } = useQuery<string>({
        queryKey: ['session-token'],
        queryFn: () => fetchSessionToken(),
        enabled: isAuthenticated,
    })

    return useMemo(() => ({ status, sessionToken, refetch }), [status, sessionToken, refetch])
}

