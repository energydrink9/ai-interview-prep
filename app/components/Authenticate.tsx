import { useAuth0 } from "@auth0/auth0-react";
import { PropsWithChildren, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useRouter } from "next/navigation";

export const Authenticate: React.FC<PropsWithChildren> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirectUri = window.location.href
            // router.push(`/login?redirectUri=${redirectUri}`)
            router.push(`/login`)   
        }
    }, [isLoading, isAuthenticated])

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isAuthenticated) {
        return children
    }

    return null
}