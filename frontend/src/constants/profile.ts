/**
 * Viktor's career, skills, education and languages.
 *
 * The only place they are described. The About page and the Person schema both
 * read from here. Every line must match LinkedIn or work that can be shown.
 */

export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

/** A practice proven by systems Viktor runs in production himself. */
export interface ProductionPractice {
  title: string;
  description: string;
}

export const EXPERIENCES: Experience[] = [
  {
    title: 'Intermediate Software Developer',
    company: 'Bucketlist Rewards and Recognition',
    period: 'April 2025 - Present',
    location: 'Remote, Canada',
    highlights: [
      'Built and improved backend features using Django, making the system easier to understand and maintain',
      'Worked on the frontend using React and Angular to improve user interactions',
      'Created and updated REST APIs to connect different parts of the system',
      'Developed automation tools saving time and reducing manual work',
    ],
  },
  {
    title: 'Software Developer (contract)',
    // Under NDA: the client is not named, only the kind of work.
    company: 'AI product platform',
    period: 'December 2025 - August 2026',
    location: 'Remote',
    highlights: [
      'Built features in the Python backend service and the Next.js web app of a platform that serves image-generation models',
      'Set up the local stack with Docker Compose, so the whole platform runs on one machine',
      'Worked on the Kubernetes cluster on Google Kubernetes Engine (GKE)',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Peavey Industries LP',
    period: 'July 2023 - February 2025',
    location: 'London, Ontario',
    highlights: [
      'Built and deployed Django and React/Next.js applications on Azure Kubernetes Service and Azure Web Apps',
      'Built secure REST APIs with authentication, authorization and data validation',
      'Built AI automation with Azure AI Document Intelligence, Pandas and OpenAI, cutting manual processing time by 40%',
      'Integrated KIBO, Builder.io, Shopify, Facebook, Google APIs and Azure services',
      'Set up CI/CD pipelines with Azure DevOps, Jenkins and GitHub Actions',
      'Modernized legacy applications with design patterns',
    ],
  },
  {
    title: 'Python Developer',
    company: 'Andersen Lab',
    period: 'December 2020 - July 2023',
    location: 'Remote, Ukraine',
    highlights: [
      'Banking: a platform that runs destructive tests against other services (Django, DRF, Kubernetes, boto3), in a team of 8',
      'Training tracker for a team of 20: event-driven microservices with FastAPI, Kafka and Celery',
      'Achieved 94% test coverage following TDD principles',
      'Optimized SQL queries, reducing database response times by up to 30%',
      'Mentored junior developers and conducted technical interviews',
    ],
  },
  {
    title: 'Python Developer',
    company: 'AXAS',
    period: 'January 2020 - December 2020',
    location: 'On-site, Ukraine',
    highlights: [
      'Built backends for web and mobile apps with Django and FastAPI',
      'Built chat bots and data scrapers',
      'Led a team of 12, introduced Scrum and worked directly with clients',
    ],
  },
  {
    title: 'Python Developer (part-time contracts)',
    company: 'Freelance',
    period: 'August 2018 - December 2019',
    location: 'Remote',
    highlights: [
      'An online wallet for cryptocurrency and real money transfers (Django, PostgreSQL), in a team of 10',
      'Telegram and Discord bots with Aiogram',
      'Web scraping with Requests, BeautifulSoup and Scrapy',
    ],
  },
  {
    title: 'Project Manager',
    company: 'Ventservice and Master Technology',
    period: 'September 2011 - August 2018',
    location: 'Kyiv, Ukraine',
    highlights: [
      'Coordinated engineering, production and logistics teams',
      'Managed timelines, budgets and quality control',
      'Worked with internal and external stakeholders',
    ],
  },
];

export const SKILLS: Record<string, string[]> = {
  Languages: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML5', 'CSS3'],
  Backend: [
    'Django',
    'Django REST Framework',
    'FastAPI',
    'Pydantic',
    'SQLAlchemy',
    'Celery',
    'Node.js',
  ],
  Frontend: [
    'React',
    'Next.js',
    'Angular',
    'MUI',
    'Tailwind CSS',
    'Redux',
    'Zustand',
    'TanStack Query',
    'i18next',
  ],
  'Data & Messaging': ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'Kafka', 'RabbitMQ'],
  AI: [
    'OpenAI API',
    'Whisper speech-to-text',
    'Azure AI Document Intelligence',
    'ElevenLabs',
    'Pandas',
  ],
  'Cloud & DevOps': [
    'Docker',
    'Kubernetes',
    'GKE',
    'Azure',
    'AWS',
    'DigitalOcean',
    'Nginx',
    'Cloudflare',
    'GitHub Actions',
    'Jenkins',
    'Linux',
  ],
  'Testing & Quality': [
    'Pytest',
    'unittest',
    'Vitest',
    'Testing Library',
    'Ruff',
    'ESLint',
    'Sentry',
  ],
  Integrations: [
    'Stripe',
    'Shopify',
    'KIBO',
    'Builder.io',
    'Google APIs',
    'Google OAuth',
    'Telegram bots',
  ],
  Practices: ['TDD', 'SOLID', 'Design patterns', 'Code review', 'Mentoring', 'Scrum'],
};

export const PRODUCTION_PRACTICES: ProductionPractice[] = [
  {
    title: 'Zero-downtime deploys',
    description:
      'Blue-green releases: the new version starts beside the old one, passes health checks, then takes the traffic. Any failure switches back on its own.',
  },
  {
    title: 'CI/CD with a release gate',
    description:
      'GitHub Actions builds every release as Docker images. A release ships only when its lint, tests and build are green.',
  },
  {
    title: 'Payments',
    description:
      'Stripe checkout, webhooks and refunds, tested end to end in a Stripe sandbox before release.',
  },
  {
    title: 'AI in production',
    description:
      "OpenAI reviews and Whisper transcription run in Celery queues, with daily quotas and checks on the model's output before it is saved.",
  },
  {
    title: 'Security and upkeep',
    description:
      'Rate limits on logins and AI requests, secrets kept out of the code, and weekly dependency updates with Dependabot.',
  },
  {
    title: 'One server, several apps',
    description:
      "Three Django and Next.js apps on one DigitalOcean server with Docker Compose, Nginx, Cloudflare and Let's Encrypt.",
  },
];

export const EDUCATION: Education[] = [
  {
    degree: "Master's degree, Electromechanical Engineering",
    school: "National Technical University of Ukraine 'Kyiv Polytechnic Institute'",
    period: '2009 - 2011',
  },
  {
    degree: "Bachelor's degree, Instrumentation Technology",
    school: "National Technical University of Ukraine 'Kyiv Polytechnic Institute'",
    period: '2005 - 2009',
  },
];

/** BCP 47 codes, so the Person schema can state them too. */
export const SPOKEN_LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Ukrainian', code: 'uk' },
  { name: 'Russian', code: 'ru' },
] as const;

/** The year Viktor started writing code professionally (part-time contracts). */
export const CODING_SINCE = 2018;
