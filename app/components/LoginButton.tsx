import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./Button";

interface LoginButtonProps {
    redirectUri?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ redirectUri = window.location.origin }) => {

    const { loginWithRedirect } = useAuth0();
  
    return <Button primary onClick={() => loginWithRedirect({
        authorizationParams: {
            redirectUri
        }
    })}>Login / Create account</Button>;
}
  