import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import ScrollToTop from "@/components/ScrollToTop";
import { PROJECTS, Project, getProject } from "@/constants/projects";
import { projectPageSchema } from "@/utils/structuredData";
import styles from "@/styles/Projects.module.css";

interface ProjectPageProps {
  project: Project;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <>
      <SEOHead
        title={`${project.name} - ${project.tagline}`}
        description={project.summary}
        structuredData={projectPageSchema(project)}
      />
      <main className={styles.main}>
        <Header />
        <div className={styles.container}>
          <header className={styles.header}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link href="/projects">Projects</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>{project.name}</span>
            </nav>
            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.tagline}>{project.tagline}</p>
          </header>

          <div className={styles.body}>
            {project.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <h2 className={styles.sectionTitle}>What it does</h2>
            <ul className={styles.highlights}>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <h2 className={styles.sectionTitle}>Built with</h2>
            <div className={styles.stack}>
              {project.stack.map((item) => (
                <span key={item} className={styles.tag}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* The outbound link this page exists for. No nofollow: it is a site
              I own and vouch for, which is exactly what the link should say. */}
          <a
            href={project.url}
            className={styles.visit}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {project.name}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ScrollToTop />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: PROJECTS.map((project) => ({ params: { slug: project.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ProjectPageProps> = ({
  params,
}) => {
  const project = getProject(String(params?.slug));
  if (!project) return { notFound: true };
  return { props: { project } };
};
