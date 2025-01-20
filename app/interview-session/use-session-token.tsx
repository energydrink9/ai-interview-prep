import { useQuery } from "@tanstack/react-query"
import { fetchSessionToken } from "../api/fetch-session-token"

export const useSessionToken = () => {

    const { status, data: sessionToken, refetch } = useQuery<string>({ queryKey: ['session-token'], queryFn: () => fetchSessionToken() })

    return { status, sessionToken, refetch }
}

