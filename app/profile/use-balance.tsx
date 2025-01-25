import { useQuery } from "@tanstack/react-query";
import { useJwtToken } from "../auth/use-jwt-token";
import { fetchUserBalance } from "../api/fetch-user-balance";
import { useEnvironment } from "../providers/use-environment";

export const useBalance = () => {

    const { BACKEND_URL } = useEnvironment()
    const { status: jwtStatus, jwtToken } = useJwtToken()
    
    const { status, data, isError, isLoading } = useQuery({
        queryKey: ['balance', BACKEND_URL, jwtToken],
        queryFn: () => fetchUserBalance(BACKEND_URL, jwtToken!),
        enabled: jwtStatus == 'success' && jwtToken !== undefined,
    });

    return {
        status,
        balance: data,
        isLoading,
        isError,
    };
}