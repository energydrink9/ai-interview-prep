import { Button } from "../gather/Button";
import { Plan } from "../model/Plan"

interface SessionsTableProps {
    sessions: Plan['sessions'];
    onClick: (index: number) => void;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ sessions, onClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Objective</th>
                    <th>Notes</th>
                    <th>Duration (min)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {sessions.map((session, i) => (<tr key={i}>
                        <th>{i}</th>
                        <td>{session.objective}</td>
                        <td>{session.note}</td>
                        <td className="text-right">{session.durationInMinutes}</td>
                        <td><Button onClick={() => onClick(i)}>Start session</Button></td>
                    </tr>))}
                </tbody>
            </table>
            </div>

    )
}
