
interface UserBalanceResponse {
    balance: number;
}

export const fetchCheckoutLink = async (jwtToken: string): Promise<string> => {

    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json',
        Authorization: `Bearer ${jwtToken}`,
    }

    const apiCall = await fetch('/api/checkout-link', { method: 'GET', headers })
    
    const response = await apiCall.json()

    return apiCall.status === 200 ? response : Promise.reject(response)
}