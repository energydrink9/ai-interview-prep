import { delay, http, HttpResponse } from 'msw'
import { Plan } from '@/app/model/Plan'

const TEST_CLIENT_SECRET = 'B080aNiVueVoxFiKWJDi6A'


export const handlers = [
    http.post('/api/plan', async () => {

        await delay(2000)

        const plan: Plan = {
            overview: 'Preparation plan for Mario Rossi to prepare for the Software Engineer (Jr) role at ACME.',
            requiredSkillCategories: [
                {
                    name: 'Programming Skills',
                    skills: [
                        'C++',
                        'JavaScript',
                        'React',
                        'Node.js'
                    ]
                },
                {
                    "name": "Software Development Fundamentals",
                    "skills": [
                        "Software development lifecycle",
                        "Systems integration",
                        "Control systems design"
                    ]
                },
                {
                    "name": "Collaboration Tools",
                    "skills": [
                        "Jira",
                        "Confluence"
                    ]
                },
                {
                    "name": "Networking Basics",
                    "skills": [
                        "OSI model",
                        "TCP/IP stack"
                    ]
                },
                {
                    "name": "Interview Skills",
                    "skills": [
                        "Behavioral questions",
                        "Technical questions",
                        "Problem-solving scenarios"
                    ]
                },
            ],
            sessions: [
                {
                    "objective": "Review and practice C++ programming concepts.",
                    "note": "Focus on fundamental concepts like classes, inheritance, and polymorphism. Prepare solutions to common coding problems in C++.",
                    'durationInMinutes': 30,
                },
                {
                    "objective": "Explore software development lifecycle and systems integration.",
                    "note": "Discuss the phases of the software development lifecycle and how to integrate software with hardware systems. Use case studies from previous work experience.",
                    'durationInMinutes': 45,
                },
                {
                    "objective": "Familiarize with collaboration tools like Jira and Confluence.",
                    "note": "Review how these tools are utilized in Agile environments. Prepare to discuss experiences using these tools.",
                    'durationInMinutes': 30,
                },
                {
                    "objective": "Understand networking concepts including OSI model and TCP/IP stack.",
                    "note": "Study each layer of the OSI model and TCP/IP stack to explain how they relate to software engineering.",
                    'durationInMinutes': 30,
                },
                {
                    "objective": "Simulate interview scenarios focusing on behavioral and technical questions.",
                    "note": "Conduct mock interviews to practice responses to common interview questions. Gather feedback and refine answers.",
                    'durationInMinutes': 60,
                },
            ]
        }

        return HttpResponse.json(plan)
  }),
  http.get('/api/session/token', async () => {

    await delay(20)

    const session = {
        client_secret: {
            value: TEST_CLIENT_SECRET,
        }
    }

    return HttpResponse.json(session)
}),
]