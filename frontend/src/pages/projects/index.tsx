import Link from "next/link";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import ScrollToTop from "@/components/ScrollToTop";
import { PROJECTS } from "@/constants/projects";
import { SITE_NAME } from "@/constants/site";
import { projectsPageSchema } from "@/utils/structuredData";
import styles from "@/styles/Projects.module.css";

export default function Projects() {
  return (
    <>
      <SEOHead
        title={`Projects - ${SITE_NAME}`}
        description="Sites built and run by Viktor Bezai: EnvolPrep, free CELPIP practice with AI feedback, and Anna-Egypt, guided tours across Egypt."
        structuredData={projectsPageSchema()}
      />
      <main className={styles.main}>
        <Header />
        <div className={styles.container}>
          <header className={styles.header}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Projects</span>
            </nav>
            <h1 className={styles.title}>Projects</h1>
            <p className={styles.intro}>
              Two products I built and still run. Both are live, both are used
              by real people, and both are maintained by one person.
            </p>
          </header>

          <div className={styles.list}>
            {PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={styles.card}
              >
                <h2 className={styles.cardTitle}>{project.name}</h2>
                <p className={styles.cardTagline}>{project.tagline}</p>
                <p className={styles.cardSummary}>{project.summary}</p>
              </Link>
            ))}
          </div>
        </div>
        <ScrollToTop />
      </main>
    </>
  );
}
