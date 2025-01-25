
interface Company {
    name: string
    mission: string | undefined
    industry: string | undefined
    investmentStage: string | undefined
    size: string | undefined
    description: string | undefined
    principles: Array<string>
    hiringPhilosophy: string | undefined
}

interface Role {
    title: string
    requirements: Array<string>
    niceToHaves: Array<string>
    responsibilities: Array<string>
    benefits: Array<string>
    salary: string | undefined
}

export interface Job {
    company: Company
    role: Role
}
