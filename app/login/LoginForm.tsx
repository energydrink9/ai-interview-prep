'use client'

import { LoginButton } from "../components/LoginButton"

interface LoginFormProps {
    redirectUri: string
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectUri }) => {

    return (
        <div className="flex flex-col space-y-4">
            <div className="prose">
                <h2>Ready to Begin?</h2>
                <p>
                    To start your personalized interview preparation journey, you&apos;ll need to log in or create an account. This allows us to save your progress and provide you with a tailored plan that fits your needs.

                    Click the button below to log in or sign up, and you&apos;ll be back in no time to kick off your preparation!
                </p>
            </div>
            <div className="flex flex-row justify-end"><LoginButton redirectUri={redirectUri} /></div>
        </div>
    )
}


