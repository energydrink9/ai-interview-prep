import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./Button";

export const LoginButton: React.FC = () => {

    const redirectUri = window !== undefined ? window.location.origin : ''

    const { loginWithRedirect } = useAuth0();
  
    return <Button primary onClick={() => loginWithRedirect({
        authorizationParams: {
            redirect_uri: redirectUri,
        }
    })}>Sign in / Signup</Button>;
}
  