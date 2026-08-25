import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROLE,
  SITE_URL,
  SOCIAL_LINKS,
  absoluteUrl,
} from "@/constants/site";
import { PROJECTS, Project } from "@/constants/projects";

/**
 * JSON-LD builders.
 *
 * Every page emits a single `@graph` whose nodes reference each other by `@id`
 * instead of repeating themselves. That is what lets a crawler read one page and
 * come away knowing that one person authored both external sites - a flat list
 * of unrelated blobs does not say that.
 *
 * `sameAs` is deliberately limited to profiles that identify the person. The
 * external projects are attached with `author`/`creator`, which is what they
 * actually are: work he made, not another profile of him.
 */

const PERSON_ID = absoluteUrl("/#person");
const WEBSITE_ID = absoluteUrl("/#website");

const projectNodeId = (project: Project) => `${project.url}#website`;

const personNode = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: SITE_ROLE,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
});

const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { "@id": PERSON_ID },
  inLanguage: "en",
});

/** One external project, stated as a site this person created. */
const projectNode = (project: Project) => ({
  "@type": "WebSite",
  "@id": projectNodeId(project),
  url: project.url,
  name: project.name,
  description: project.summary,
  creator: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
  inLanguage: "en",
});

const breadcrumbNode = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

const graph = (nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const homePageSchema = () =>
  graph([
    personNode(),
    websiteNode(),
    ...PROJECTS.map(projectNode),
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/#webpage"),
      url: SITE_URL,
      name: `${SITE_NAME} - ${SITE_ROLE}`,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
    },
  ]);

export const aboutPageSchema = () =>
  graph([
    personNode(),
    websiteNode(),
    {
      "@type": "ProfilePage",
      "@id": absoluteUrl("/about#webpage"),
      url: absoluteUrl("/about"),
      name: `About ${SITE_NAME}`,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ]);

export const projectsPageSchema = () =>
  graph([
    personNode(),
    websiteNode(),
    ...PROJECTS.map(projectNode),
    {
      "@type": "CollectionPage",
      "@id": absoluteUrl("/projects#webpage"),
      url: absoluteUrl("/projects"),
      name: `Projects by ${SITE_NAME}`,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: PROJECTS.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": projectNodeId(project) },
        })),
      },
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]),
  ]);

export const projectPageSchema = (project: Project) =>
  graph([
    personNode(),
    websiteNode(),
    projectNode(project),
    {
      "@type": "WebPage",
      "@id": absoluteUrl(`/projects/${project.slug}#webpage`),
      url: absoluteUrl(`/projects/${project.slug}`),
      name: `${project.name} - ${project.tagline}`,
      description: project.summary,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": projectNodeId(project) },
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.name, path: `/projects/${project.slug}` },
    ]),
  ]);
