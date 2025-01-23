import { useQuery } from "@tanstack/react-query"
import { PlanResponse } from "../model/Plan"
import { fetchInterviewPrepPlan } from "../api/fetch-interview-prep-plan"
import { useJwtToken } from "../auth/use-jwt-token";

interface ApiError {
    status: number;
}

export const useInterviewPrepPlan = (jobUrl: string) => {

    const { jwtToken } = useJwtToken()

    const { status, data } = useQuery<PlanResponse, ApiError>({
        queryKey: ['plan', jobUrl],
        queryFn: () => fetchInterviewPrepPlan(jobUrl, jwtToken!),
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchInterval: false,
        refetchOnMount: false,
        staleTime: Infinity,
        retry: (_failureCount: number, error: ApiError) => error.status == 429 || error.status >= 500,
        enabled: jwtToken !== undefined,
    })
    return { status, data }
}