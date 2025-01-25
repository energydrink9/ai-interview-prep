import { PlanResponse } from "../model/Plan"

export const fetchInterviewPrepPlan = async (jobUrl: string, jwtToken: string): Promise<PlanResponse> => {
    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json',
        Authorization: `Bearer ${jwtToken}`,
    }
    const body = {
        jobUrl,
    }

    const apiCall = await fetch('/api/coach/plan', { method: 'POST', body: JSON.stringify(body), headers })
    
    const response = await apiCall.json()

    return apiCall.status === 200 ? response : Promise.reject(response)
}