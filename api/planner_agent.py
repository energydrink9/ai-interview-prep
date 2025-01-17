# Import relevant functionality
from typing import List
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_community.agent_toolkits.openapi.toolkit import RequestsToolkit
from langchain_community.utilities.requests import TextRequestsWrapper
import traceback

from gather_agent_response_model import GatherResponseModel

ALLOW_DANGEROUS_REQUEST = True


requests_toolkit = RequestsToolkit(
    requests_wrapper=TextRequestsWrapper(headers={}),
    allow_dangerous_requests=ALLOW_DANGEROUS_REQUEST,
)

search = TavilySearchResults(max_results=10)
tools: List[BaseTool] = [*requests_toolkit.get_tools(), search]

# Create the agent
gather_memory = MemorySaver()
gather_model = ChatOpenAI(model="gpt-4o-mini")
planner_memory = MemorySaver()
planner_model = ChatOpenAI(model="gpt-4o-mini")

gather_agent = create_react_agent(gather_model, tools, checkpointer=gather_memory, response_format=GatherResponseModel)
planner_agent = create_react_agent(planner_model, tools, checkpointer=planner_memory)


# - create a cover letter for the candidates that matches the job description
# and the candidate's career history, interests and aspirations.
# You will:
# - Create a document for the candidate to use as a draft to write a cover
# letter to apply for the job

GATHER_AGENT_PROMPT = '''
You are tasked with gathering information about a job vacancy and an applicant
for it. The user will provide you with the links to the job description and to
the candidate LinkedIn profile. When you receive such a message from the user
you will:
- fetch the job description and gather information about the job: Company name,
size, investment stage, industry, mission, description, principles, job
responsibilities, job requirements, nice to haves, benefits, salary
- fetch additional information, like the company's tenets / principles and its
hiring philosophy from the company website or other relevant sources
- fetch the candidate LinkedIn profile to gather information about the
candidate: Full name, Gender, Nationality, Bio / Career history, Work
experiences, Studies and certifications, Interests and causes
- Reply with the information in JSON format. Example:
{
    applicant: {
        name: 'Mario Rossi',
        gender: 'M',
        nationality: 'Italian',
        bio: '',
        workExperiences: []
            {
                name: 'Company 1',
                startDate: 'July 2020',
                endDate: null,
                role: 'Junior Software Engineer',
                description: 'Developed web applications using the MERN stack.'
            },
        ]
        courses: [
            {
                name: 'Computer Science',
                institution: 'University of Pisa',
                startDate: 'September 2014',
                endDate: 'June 2019',
                type: 'MSc'
            }
        ],
        interests: ['sustainability', 'tech']
    },
    job: {
        company: {
            name: 'ACME',
            mission: '...'
            industry: '',
            investmentStage: '',
            size: '',
            description: '',
            principles: '',
            hiringPhilosophy: ''
        },
        role: {
            title: 'Software Engineer',
            requirements: [
                'Bachelor degree in Computer Science',
                '3 years of experience with React'
            ],
            niceToHaves: [
                'Python knowledge',
            ],
            benefits: [
                'RSUs',
                'Health insurance'
            ],
            salary: '100k/year'
        }
    }
}

Only reply with valid JSON. Do not reply with any other information.
'''

PLANNER_AGENT_PROMPT = '''
You are a job interview preparation planner. Your job is to prepare a thorough
plan for candidates to get to their interviews prepared and confident.

The user will provide you with all the information related to the applicant
and to the vacancy in JSON format. When you receive such a message you will:
- Create a breakdown of the skills that the candidate needs to know/rehearse
- Define a plan comprised of several ordered preparation sessions. You
will attach notes to each of these sessions so that the coach responsible for
the interview preparation will have all the necessary details to carry out
their job.
'''


def run_gather_agent(job_url: str, applicant_profile_url: str) -> GatherResponseModel:
    input_message = f'''
    The URL of the job description is: {job_url}
    The URL of the applicant LinkedIn profile is: {applicant_profile_url}
    '''
    config = {"configurable": {"thread_id": "abc123"}}
    for chunk in gather_agent.stream(
        {"messages": [SystemMessage(content=GATHER_AGENT_PROMPT), HumanMessage(content=input_message)]}, config
    ):
        if 'agent' in chunk:
            return chunk['agent']['messages'][0]
        
    raise Exception('No message received from agent')
        

def run_planner_agent(info: str):
    input_message = f'''
    {info}
    '''
    config = {"configurable": {"thread_id": "abc123"}}
    for chunk in planner_agent.stream(
        {"messages": [SystemMessage(content=PLANNER_AGENT_PROMPT), HumanMessage(content=input_message)]}, config
    ):
        print(chunk)
        print("----")
        if 'agent' in chunk:
            return chunk['agent']['messages'][0]


if __name__ == '__main__':
    info = run_gather_agent(
        'https://www.seek.com.au/job/80862550?ref=search-standalone&type=standard&origin=jobTitle#sol=3342a039e7fbf9cbd69dda67fc796eaeaec7d3e2',
        'https://www.linkedin.com/in/mlugano'
    )
    try:
        plan = run_planner_agent(info.model_dump_json())
        print(plan)

    except Exception as e:
        print(f'An error occurred while running the planner agent {e}')
        print(traceback.format_exc())

