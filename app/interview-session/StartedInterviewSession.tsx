import { Button } from "../gather/Button"
import { useSessionToken } from "./use-session-token"

interface StartedInterviewSessionProps {

}

export const StartedInterviewSession: React.FC<StartedInterviewSessionProps> = () => {
    const { status, sessionToken, refetch } = useSessionToken()

    const retry = () => {
        refetch()
    }

    if (status == 'error') {
        return (
            <div className="flex flex-col space-y-5">
                <div>Error while loading the session</div>
                <div><Button onClick={retry}>Retry</Button></div>
            </div>
        )
    }

    if (status == 'pending') {
        return <div><span className="loading loading-spinner loading-lg"></span></div>
    }

    return <>
        {sessionToken}
    </>
}