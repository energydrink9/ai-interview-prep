import { useQuery } from "@tanstack/react-query"
import { PlanResponse } from "../model/Plan"
import { fetchInterviewPrepPlan } from "../api/fetch-interview-prep-plan"

interface ApiError {
    status: number;
}

export const useInterviewPrepPlan = (jobUrl: string) => {
    const { status, data } = useQuery<PlanResponse, ApiError>({
        queryKey: ['plan', jobUrl],
        queryFn: () => fetchInterviewPrepPlan(jobUrl),
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: (_failureCount: number, error: ApiError) => error.status == 429 || error.status >= 500,
    })
    return { status, data }
}