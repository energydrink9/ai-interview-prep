import { PlanResponse } from "../model/Plan"

export const fetchInterviewPrepPlan = async (jobUrl: string): Promise<PlanResponse> => {
    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }
    const body = {
        jobUrl,
    }

    const apiCall = await fetch('/api/plan', { method: 'POST', body: JSON.stringify(body), headers })
    
    const response = await apiCall.json()

    return apiCall.status === 200 ? response : Promise.reject(response)
}