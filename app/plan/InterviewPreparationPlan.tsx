import { useRouter } from "next/navigation"
import { useSearchParams } from "../routing/use-search-params"
import { Button } from "../gather/Button"
import { RequirementsTable } from "./RequirementsTable"
import { SessionsTable } from "./SessionsTable"
import { useInterviewPrepPlan } from "./use-interview-prep-plan"


interface InterviewPreparationPlanProps {

}

export const InterviewPreparationPlan: React.FC<InterviewPreparationPlanProps> = ({}) => {
    const router = useRouter()
    const [jobUrl] = useSearchParams('jobUrl')

    const onCancel = () => {
        router.push('/gather')
    }

    const { status, data } = useInterviewPrepPlan(jobUrl)

    const startSession = (index: number) => {
        router.push(`/interview-session?jobUrl=${jobUrl}&sessionIndex=${index}`)
    }
    
    if (status == 'error') {
        return (
            <div className="flex flex-col space-y-5">
                <div>Error while loading the plan</div>
                <div><Button onClick={onCancel}>Back</Button></div>
            </div>
        )
    }

    if (status == 'pending') {
        return <div><span className="loading loading-spinner loading-lg"></span></div>
    }

    if (data === undefined) {
        return null
    }

    const { job, plan } = data

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <div className="prose">
                    <h2>Your interview preparation plan</h2>
                    <p>
                        Congratulations! Your personalized interview preparation plan is ready. Designed to fit your unique goals and schedule, this plan will help you build confidence, master essential skills, and leave a lasting impression in your next interview. Let’s get started!    
                    </p>

                    <h3>Overview</h3>
                    <p>
                        {plan.overview}
                    </p>

                    <h3>Requirements</h3>
                    <p>
                        These are the key skills and knowledge areas required for the role you're preparing for. Review them carefully to ensure you understand what the interviewer will expect from you.
                    </p>
                </div>
                <div className="pt-8 pb-8">
                    <RequirementsTable requirements={plan.requiredSkillCategories} />
                </div>
                <div className="prose">
                    <h3>Sessions</h3>
                    <p>
                        Your plan includes a series of sessions designed to help you prepare effectively and confidently. Each session is tailored to build your skills and ensure you're ready for every aspect of the interview process. Check out the details below and start when you're ready.
                    </p>
                </div>
                <div className="pt-8 pb-8">
                    <SessionsTable sessions={plan.sessions} onClick={(index: number) => startSession(index)} />
                </div>
                <div className="flex flex-row space-x-2">
                    <Button primary onClick={() => startSession(0)}>Start first session</Button>
                </div>
            </div>
        </div>
    )
}