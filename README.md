![Build and Deployment](https://github.com/energydrink9/ai-interview-prep/actions/workflows/deploy.yml/badge.svg)


# AI Interview Prep

AI Interview Prep is a **job interview preparation platform** powered by AI. The application uses LangChain agents with GPT-4 to automatically **analyze job postings** and company information, generating **personalized preparation plans**. The app leverages *OpenAI's Realtime voice technology* to allow users to practice **voice-based mock interviews** with an AI coach that provides feedback and guidance.

## Features

- **Job Analysis**: Automatically extracts and analyzes job requirements, company information, and role responsibilities from job postings
- **Personalized Preparation Plans**: Creates custom interview preparation plans based on the job requirements
- **Virtual Interview Coach**: Utilizing OpenAI's Realtime voice technology, users can practice with a responsive AI interviewer that adapts to their responses, provides immediate feedback, and helps improve their interview performance.
- **Structured Practice Sessions**: Guides users through focused practice sessions targeting specific skills and competencies
- **Real-time Interview Practice**: Integrates with OpenAI's real-time API for interactive interview practice sessions
- **Skills Assessment**: Provides detailed breakdown of required skills and competencies for the target role
- **Progress Tracking**: Tracks completion of practice sessions and preparation milestones

## Tech Stack

- **Frontend**: Next.js 15.1, React 19, TypeScript
- **Backend**: Python with FastAPI
- **AI/ML**: LangChain with GPT-4
- **Styling**: Tailwind CSS with DaisyUI
- **State Management**: TanStack Query
- **Testing**: Jest, React Testing Library
- **API Mocking**: MSW (Mock Service Worker)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- OpenAI API key
- Tavily API key (for web search capabilities)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-interview-prep.git
cd ai-interview-prep
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Install backend dependencies:
```bash
cd api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables:

Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd api
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python index.py
```

2. In a new terminal, start the frontend development server:
```bash
# Regular development mode
npm run dev
# or
yarn dev

# Development mode with mocked APIs
npm run dev-mock
# or
yarn dev-mock
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests

```bash
# Run tests in watch mode with coverage
npm test

# Run tests once for CI
npm run test:ci

# Run a single test file
npm run test:single
```

## Project Structure

```
├── api/                 # Python backend
│   ├── index.py        # FastAPI application
│   └── planner_agent.py # LangChain agent implementation
├── app/
│   ├── api/            # Frontend API clients
│   ├── components/     # Shared React components
│   ├── gather/         # Job URL input page
│   ├── interview-session/ # Interview practice session
│   ├── plan/           # Preparation plan display
│   └── providers/      # React context providers
├── public/             # Static assets
└── package.json
```

## Development

### API Mocking

The application includes a mock API implementation using MSW (Mock Service Worker). To run the application with mocked APIs:

```bash
npm run dev-mock
# or
yarn dev-mock
```

This is useful for development and testing when you don't want to make actual API calls.

### Adding New Features

1. Create a new feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push to your branch and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Deployment

The application is configured for deployment on Vercel. The deployment process is automated through GitHub Actions (see `.github/workflows/deploy.yml`).

To deploy manually:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
