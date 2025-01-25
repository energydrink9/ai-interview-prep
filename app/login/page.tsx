'use client'

import { PropsWithChildren } from "react";
import { LoginForm } from "./LoginForm";

const Container: React.FC<PropsWithChildren> = ({ children }) => <div className="max-w-lg">{children}</div>


const Login: React.FC = () => {
    
    return <LoginForm />
}

const Page = () => {
    
    return <div className="flex flex-col space-y-20">
        <Container>
            <Login />
        </Container>
    </div>
}

export default Page