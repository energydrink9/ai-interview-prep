
interface UserBalanceResponse {
    balance: number;
}

export const fetchUserBalance = async (jwtToken: string): Promise<UserBalanceResponse> => {

    const headers = {
        'Content-type':'application/json', 
        'Accept':'application/json',
        Authorization: `Bearer ${jwtToken}`,
    }

    const apiCall = await fetch('/api/paymentsbalance', { method: 'GET', headers })
    
    const response = await apiCall.json()

    return apiCall.status === 200 ? response : Promise.reject(response)
}