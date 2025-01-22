import { useQuery } from "@tanstack/react-query";
import { useJwtToken } from "../auth/use-jwt-token";
import { fetchUserBalance } from "../api/fetch-user-balance";

export const useBalance = () => {

    const { status: jwtStatus, jwtToken } = useJwtToken()
    
    const { status, data, isError, isLoading } = useQuery({
        queryKey: ['balance'],
        queryFn: () => fetchUserBalance(jwtToken!),
        enabled: jwtStatus == 'success' && jwtToken !== undefined,
    });

    return {
        status,
        balance: data,
        isLoading,
        isError,
    };
}