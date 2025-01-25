
export const fetchCheckoutLink = async (backendUrl: string, jwtToken: string): Promise<string> => {

    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json',
        Authorization: `Bearer ${jwtToken}`,
    }

    const apiCall = await fetch(`${backendUrl}/payments/checkout-link`, { method: 'GET', headers })
    
    const response = await apiCall.json()

    return apiCall.status === 200 ? response : Promise.reject(response)
}