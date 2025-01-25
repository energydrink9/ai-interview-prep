import { useQuery } from "@tanstack/react-query"
import { fetchSessionToken } from "../api/fetch-session-token"
import { useAuth0 } from "@auth0/auth0-react"
import { useMemo } from "react"
import { useEnvironment } from "../providers/use-environment"

export const useSessionToken = () => {

    const { BACKEND_URL } = useEnvironment()
    const { isAuthenticated } = useAuth0()

    const { status, data: sessionToken, refetch,  } = useQuery<string>({
        queryKey: ['session-token', BACKEND_URL],
        queryFn: () => fetchSessionToken(BACKEND_URL),
        enabled: isAuthenticated,
    })

    return useMemo(() => ({ status, sessionToken, refetch }), [status, sessionToken, refetch])
}

