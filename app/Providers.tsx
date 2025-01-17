'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient()

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}