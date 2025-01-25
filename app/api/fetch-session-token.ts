
export const fetchSessionToken = async (): Promise<string> => {
    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json'
    }

    const apiCall = await fetch('/api/coach/session/token', { method: 'GET', headers })
    const response = await apiCall.json()
    
    return response.client_secret.value
}