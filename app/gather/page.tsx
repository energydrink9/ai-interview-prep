'use client'

import { PropsWithChildren, useState } from "react";
import { GatherApplicantProfile, GatherJob } from "./Gather";
import { InterviewPreparationPlan } from "../interview-preparation-plan.tsx/page";

const Container: React.FC<PropsWithChildren> = ({ children }) => <div className="max-w-lg">{children}</div>

const Gather = () => {
    const [jobUrl, setJobUrl] = useState<string | undefined>(undefined)
    const [applicantProfileUrl, setApplicantProfileUrl] = useState<string | undefined>(undefined)
    const resetAll = () => {
        setJobUrl(undefined)
        setApplicantProfileUrl(undefined)
    }
    const resetJobUrl = () => {
        setJobUrl(undefined)
    }
    
    if (jobUrl === undefined) {
        return <GatherJob onSubmit={setJobUrl} />
    }

    if (applicantProfileUrl === undefined) {
        return <GatherApplicantProfile onSubmit={setApplicantProfileUrl} onCancel={resetJobUrl} />
    }

    return <InterviewPreparationPlan jobUrl={jobUrl} applicantProfileUrl={applicantProfileUrl} onCancel={resetAll} />
}

const Page = () => {
    
    return <Container><Gather /></Container>
}

export default Page