'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockingProvider } from "./providers/MockingProvider";
import { Auth0Provider } from '@auth0/auth0-react';
import { PropsWithChildren } from "react";

const AUTH0_DOMAIN = 'dev-pasnxxhbjoxjx1of.us.auth0.com'
const AUTH0_CLIENT_ID = 't0evjULCEPlww8v0iej94uWz2HHI7JMb'
const AUTH0_API_AUDIENCE = 'http://localhost:5328/'

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient()

const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
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

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <MockingProvider>
            <AuthenticationProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </AuthenticationProvider>
        </MockingProvider>
    )
}