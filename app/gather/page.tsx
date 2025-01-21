'use client'

import { PropsWithChildren } from "react";
import { GatherJob } from "./Gather";
import { useRouter } from "next/navigation";

const Container: React.FC<PropsWithChildren> = ({ children }) => <div className="max-w-lg">{children}</div>

const Gather = () => {
    const router = useRouter()

    const submit = (jobUrl: string) => {
        router.push(`/plan?jobUrl=${jobUrl}`)
    }
    
    return <GatherJob onSubmit={submit} />
}

const Page = () => {
    
    return <div className="flex flex-col space-y-20">
        <Container>
            <Gather />
        </Container>
    </div>
}

export default Page