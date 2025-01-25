'use client'

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./Button";

const getRedirectUri = () => typeof(window) !== 'undefined' ? window.location.origin : ''

export const LoginButton: React.FC = () => {

    const redirectUri = getRedirectUri()

    const { loginWithRedirect } = useAuth0();
  
    return <Button primary onClick={() => loginWithRedirect({
        authorizationParams: {
            redirect_uri: redirectUri,
        }
    })}>Sign in / Signup</Button>;
}
  