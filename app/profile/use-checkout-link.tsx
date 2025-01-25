import { useQuery } from "@tanstack/react-query";
import { useJwtToken } from "../auth/use-jwt-token";
import { fetchCheckoutLink } from "../api/fetch-checkout-link";
import { useEnvironment } from "../providers/use-environment";

export const useCheckoutLink = () => {

    const { BACKEND_URL } = useEnvironment()
    const { status: jwtStatus, jwtToken } = useJwtToken()
    
    const { status, data, isError, isLoading } = useQuery({
        queryKey: ['checkoutLink', BACKEND_URL, jwtToken],
        queryFn: () => fetchCheckoutLink(BACKEND_URL, jwtToken!),
        enabled: jwtStatus == 'success' && jwtToken !== undefined,
    });

    return {
        status,
        checkoutLink: data,
        isLoading,
        isError,
    };
}