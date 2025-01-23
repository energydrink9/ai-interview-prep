import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";

export const useJwtToken = () => {

    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    if (!isAuthenticated) {
        throw new Error('User is not authenticated')
    }

    const { status, data: jwtToken } = useQuery<string>({
        queryKey: [],
        queryFn: async () => getAccessTokenSilently(),
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: false,
        refetchOnMount: false,
        staleTime: Infinity,
    })

    return { status, jwtToken }
}