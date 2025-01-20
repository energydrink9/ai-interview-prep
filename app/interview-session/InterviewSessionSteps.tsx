import classNames from "classnames";
import { Plan } from "../model/Plan"

interface InterviewSessionStepsProps {
    sessions: Plan['sessions'];
    currentSessionIndex: number;
}

export const InterviewSessionSteps: React.FC<InterviewSessionStepsProps> = ({ sessions, currentSessionIndex }) => {

    return (
        <ul className="steps">
            {sessions.map((session, i) => (
                <li key={i} className={classNames('step', { 'step-primary': i <= currentSessionIndex })}>{session.objective}</li>
            ))}
        </ul>
    )
}