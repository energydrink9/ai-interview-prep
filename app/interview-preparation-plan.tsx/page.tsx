'use client'

import { useQuery } from "@tanstack/react-query";
import { Button } from "../gather/Button";

interface InterviewPreparationPlanResponse {
    description: string;
}

interface InterviewPreparationPlan {
    jobUrl: string;
    applicantProfileUrl: string;
    onCancel: () => void;
}

const fetchInterviewPrepPlan = async (jobUrl: string, applicantProfileUrl: string): Promise<InterviewPreparationPlanResponse> => {
    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }
    const body = {
        jobUrl,
        applicantProfileUrl,
    }
    const apiCall = await fetch('/api/interview-preparation-plan', { method: 'POST', body: JSON.stringify(body), headers })
    return await apiCall.json() as InterviewPreparationPlanResponse
}

export const InterviewPreparationPlan: React.FC<InterviewPreparationPlan> = ({ jobUrl, applicantProfileUrl, onCancel }) => {
    const { status, data: plan } = useQuery<InterviewPreparationPlanResponse>({ queryKey: ['plan', jobUrl, applicantProfileUrl], queryFn: () => fetchInterviewPrepPlan(jobUrl, applicantProfileUrl) })

    if (status == 'error') {
        return (
            <div className="flex flex-col space-y-5">
                <div>Error while loading the plan</div>
                <div><Button onClick={onCancel}>Back</Button></div>
            </div>
        )
    }

    if (status == 'pending') {
        return 'Loading...'
    }

    return (
        <div>
            <div>Here's your interview preparation plan:</div>
            <div>
                {plan.description}
            </div>
        </div>
    )
}