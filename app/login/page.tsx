'use client'

import { PropsWithChildren } from "react";
import { LoginForm } from "./LoginForm";
import { useSearchParams } from "../routing/use-search-params";

const Container: React.FC<PropsWithChildren> = ({ children }) => <div className="max-w-lg">{children}</div>

interface LoginProps {
    redirectUri: string;
}

const Login: React.FC<LoginProps> = ({ redirectUri }) => {
    
    return <LoginForm redirectUri={redirectUri} />
}

const Page = () => {
    
    const [redirectUri] = useSearchParams('redirectUri')

    return <div className="flex flex-col space-y-20">
        <Container>
            <Login redirectUri={redirectUri} />
        </Container>
    </div>
}

export default Page