'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockingProvider } from "./providers/MockingProvider";
import { Auth0Provider } from '@auth0/auth0-react';
import { PropsWithChildren, use } from "react";
import { useEnvironment } from "./providers/use-environment";
import { EnvironmentContextType } from "./providers/environment-context";
import { EnvironmentProvider } from "./providers/EnvironmentProvider";

interface ProvidersProps extends PropsWithChildren {
    environmentPromise: Promise<EnvironmentContextType>;
}

const queryClient = new QueryClient()

const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const {
        AUTH0_DOMAIN,
        AUTH0_CLIENT_ID,
        AUTH0_API_AUDIENCE,
    } = useEnvironment()

    return (
        <Auth0Provider
            domain={AUTH0_DOMAIN}
            clientId={AUTH0_CLIENT_ID}
            authorizationParams={{
//                redirect_uri: window.location.origin,
                audience: AUTH0_API_AUDIENCE,
                scope: 'openid profile email',
            }}
            useRefreshTokens
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    )
}

export const Providers: React.FC<ProvidersProps> = ({ children, environmentPromise }) => {
    const environment = use(environmentPromise)
    return (
        <MockingProvider>
            <EnvironmentProvider value={environment}>
                <AuthenticationProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AuthenticationProvider>
            </EnvironmentProvider>
        </MockingProvider>
    )
}