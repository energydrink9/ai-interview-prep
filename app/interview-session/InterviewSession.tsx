'use client'

import { useRouter } from "next/navigation"
import { Button } from "../gather/Button"
import { useSearchParams } from "../routing/use-search-params"
import { useInterviewPrepPlan } from "../plan/use-interview-prep-plan"
import { InterviewSessionSteps } from "./InterviewSessionSteps"
import { Suspense, useState } from "react"
import { StartedInterviewSession } from "./StartedInterviewSession"

export const InterviewSession: React.FC = () => {

    const router = useRouter()
    const [jobUrl] = useSearchParams('jobUrl')
    const [sessionIndexParam] = useSearchParams('sessionIndex')
    const [sessionStatus, setSessionStatus] = useState<'started' | 'stopped'>('stopped')

    const showPlan = () => {
        router.push(`/plan?jobUrl=${jobUrl}`)
    }

    const startSession = (index: number) => {
        router.push(`/interview-session?jobUrl=${jobUrl}&sessionIndex=${index}`)
    }

    const { status, data } = useInterviewPrepPlan(jobUrl)

    if (status == 'error') {
        return (
            <div className="flex flex-col space-y-5">
                <div>Error while loading the plan</div>
                <div><Button onClick={showPlan}>Back</Button></div>
            </div>
        )
    }

    if (status == 'pending') {
        return <div><span className="loading loading-spinner loading-lg"></span></div>
    }
    
    const sessionIndex = parseInt(sessionIndexParam)
    const sessions = data?.plan.sessions ?? []
    const session = sessions[sessionIndex]
    
    if (session === undefined) {
        return null
    }

    const start = () => {
        setSessionStatus('started')
    }

    return (
        <>
            <InterviewSessionSteps sessions={sessions} currentSessionIndex={sessionIndex} />
            <div className="flex flex-col space-y-10 max-w-2xl">
                <div className="prose">
                    <h2>Session #{sessionIndex + 1}</h2>

                    <p>
                        This is your next interview preparation session.
                    </p>

                    <div className="flex flex-col space-y-2">
                        <div><b>Objective</b>: {session.objective}</div>
                        <div><b>Notes</b>: {session.note}</div>
                        <div><b>Duration (min)</b>: {session.durationInMinutes}</div>
                    </div>
                </div>

                <div className="flex flex-row justify-center">
                    { sessionStatus == 'stopped' && <Button primary onClick={start}>Start this session</Button>}
                    { sessionStatus == 'started' && <StartedInterviewSession /> }
                </div>
            </div>
            <div className="flex flex-row space-x-4 w-full">
                <Button onClick={showPlan}>Show interview plan</Button>
                <Button onClick={() => startSession(sessionIndex - 1)} disabled={sessionIndex == 0}>Previous session</Button>
                <Button onClick={() => startSession(sessionIndex + 1)} disabled={sessionIndex == sessions.length - 1}>Skip this session</Button>
            </div>
        </>
    )
}

export const InterviewSessionPage: React.FC = () => {
    return (
        <div className="flex flex-col space-y-10 items-center">
            <Suspense>
                <InterviewSession />
            </Suspense>
        </div>
    )
}
