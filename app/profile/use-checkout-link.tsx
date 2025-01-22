import { useQuery } from "@tanstack/react-query";
import { useJwtToken } from "../auth/use-jwt-token";
import { fetchUserBalance } from "../api/fetch-user-balance";
import { fetchCheckoutLink } from "../api/fetch-checkout-link";

export const useCheckoutLink = () => {

    const { status: jwtStatus, jwtToken } = useJwtToken()
    
    const { status, data, isError, isLoading } = useQuery({
        queryKey: ['checkoutLink'],
        queryFn: () => fetchCheckoutLink(jwtToken!),
        enabled: jwtStatus == 'success' && jwtToken !== undefined,
    });

    return {
        status,
        checkoutLink: data,
        isLoading,
        isError,
    };
}