export interface InterviewPreparationSession {
    objective: string;
    note: string;
    durationInMinutes: number;
}

export interface SkillCategory {
    name: string;
    skills: string[];
}

export interface Plan {
    overview: string;
    requiredSkillCategories: Array<SkillCategory>;
    sessions: Array<InterviewPreparationSession>;
}

export interface Job {
    company: string;
}

export interface PlanResponse {
    job: Job;
    plan: Plan;
}