/**
 * The projects linked from this site.
 *
 * This is the only place they are described. The nav, the home page cards, the
 * /projects pages, the sitemap and the `sameAs` list in the Person schema all
 * read from here, so a project can never be listed in one place and missing
 * from another.
 */
export interface Project {
  /** URL segment under /projects. */
  slug: string;
  name: string;
  /** The live site. Used for the outbound link and for Person.sameAs. */
  url: string;
  /** One line, used next to the name in cards and nav. */
  tagline: string;
  /** One sentence, used for the card body and the page meta description. */
  summary: string;
  /** Body copy for the project page, one string per paragraph. */
  body: string[];
  highlights: string[];
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "envolprep",
    name: "EnvolPrep",
    url: "https://envolprep.com/",
    tagline: "Free CELPIP practice with AI feedback",
    summary:
      "A free platform for practising the four CELPIP skills, with AI feedback on writing and speaking answers.",
    body: [
      "EnvolPrep started as a tool I built for myself while preparing for the CELPIP test. The official practice material is good for reading and listening, but it does not tell you what was wrong with a writing or speaking answer. That gap is the whole reason the site exists.",
      "It covers all four skills. Reading and listening are scored automatically. Writing and speaking answers go to an AI evaluator that returns feedback against the criteria the real test uses, so the response says what to change rather than just giving a number.",
      "The platform is free to use. AI feedback has a daily limit, with a paid option for unlimited access. Everything else stays open, which is the part most similar sites put behind a login.",
      "EnvolPrep is not affiliated with Paragon Testing Enterprises, and CELPIP is their registered trademark. The practice material is CELPIP-inspired, written to match the format of the real exam.",
    ],
    highlights: [
      "Reading, listening, writing and speaking practice in one place",
      "AI feedback on writing and speaking, mapped to the exam criteria",
      "Audio transcription so spoken answers can be evaluated",
      "Free to use, with no login required to read the material",
    ],
    stack: [
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "Celery",
      "Redis",
      "Next.js",
      "TypeScript",
      "Docker",
    ],
  },
  {
    slug: "anna-egypt",
    name: "Anna-Egypt",
    url: "https://anna-egypt.com/",
    tagline: "Guided tours across Egypt",
    summary:
      "A booking site for individual and group excursions in Hurghada, Sharm el-Sheikh, Cairo and Luxor.",
    body: [
      "Anna-Egypt is a booking site for guided excursions in Egypt, covering Hurghada, Sharm el-Sheikh, Cairo and Luxor.",
      "The routes are put together by a guide who has lived in Egypt since 2014, so the tours are built on first-hand knowledge rather than resold from an operator. Both individual and group excursions can be booked.",
      "I built and run the site. The work is the same shape as the rest of my projects: a Django backend, a Next.js front end, and a deployment that one person can maintain.",
    ],
    highlights: [
      "Individual and group excursions",
      "Hurghada, Sharm el-Sheikh, Cairo and Luxor",
      "Routes designed by a guide living in Egypt since 2014",
    ],
    stack: ["Django", "PostgreSQL", "Next.js", "TypeScript", "Docker"],
  },
];

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug);
