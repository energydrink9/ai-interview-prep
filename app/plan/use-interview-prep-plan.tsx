import { useQuery } from "@tanstack/react-query"
import { PlanResponse } from "../model/Plan"
import { fetchInterviewPrepPlan } from "../api/fetch-interview-prep-plan"
import { useJwtToken } from "../auth/use-jwt-token";
import { useEnvironment } from "../providers/use-environment";

interface ApiError {
    status: number;
}

export const useInterviewPrepPlan = (jobUrl: string) => {

    const { jwtToken } = useJwtToken()
    const { BACKEND_URL } = useEnvironment()

    const { status, data } = useQuery<PlanResponse, ApiError>({
        queryKey: ['plan', BACKEND_URL, jwtToken, jobUrl],
        queryFn: () => fetchInterviewPrepPlan(BACKEND_URL, jobUrl, jwtToken!),
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