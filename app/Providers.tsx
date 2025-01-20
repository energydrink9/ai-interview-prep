'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockingProvider } from "./providers/MockingProvider";

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient()

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <MockingProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </MockingProvider>
    )
}