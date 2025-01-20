import { Plan } from "../model/Plan"

interface RequirementsTableProps {
    requirements: Plan['requiredSkillCategories']
}

export const RequirementsTable: React.FC<RequirementsTableProps> = ({ requirements }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Requirement</th>
                    <th>Skills</th>
                </tr>
                </thead>
                <tbody>
                    {requirements.map((requirement, i) => (<tr key={i}>
                        <th>{i}</th>
                        <td>{requirement.name}</td>
                        <td>
                            <ul>{requirement.skills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}</ul>
                        </td>
                    </tr>))}
                </tbody>
            </table>
        </div>

    )
}