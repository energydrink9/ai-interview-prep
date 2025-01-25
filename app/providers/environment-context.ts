export interface EnvironmentContextType {
    BACKEND_URL: string;
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_API_AUDIENCE: string;
}

export const getEnvironment = (): EnvironmentContextType => ({
    BACKEND_URL: process.env.BACKEND_URL ?? '',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ?? '',
    AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE ?? '',
})

export const getEnvironmentAsync = async (): Promise<EnvironmentContextType> => Promise.resolve({
    BACKEND_URL: process.env.BACKEND_URL ?? '',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ?? '',
    AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE ?? '',
})

