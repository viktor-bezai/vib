import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { getDirectApiUrl } from "@/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Viktor Bezai - Software Developer</title>
        <meta name="description" content="Full-Stack Software Developer specializing in Python, Django, React, and modern web technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.greeting}>Hello, I'm</h1>
              <h2 className={styles.name}>Viktor Bezai</h2>
              <p className={styles.tagline}>Full-Stack Software Developer</p>
              <p className={styles.description}>
                Building scalable web applications with modern technologies.
                Specializing in Python, Django, React, and cloud infrastructure.
              </p>
              
              <div className={styles.ctaButtons}>
                <a 
                  href={getDirectApiUrl("/api/v1/accounts/resume/viktorbezai@gmail.com/download/")} 
                  className={styles.primaryButton}
                >
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
                <Link href="/about" className={styles.secondaryButton}>
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className={styles.heroVisual}>
              <div className={styles.floatingCard}>
                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span className={styles.dot} style={{background: '#ff5f56'}}></span>
                    <span className={styles.dot} style={{background: '#ffbd2e'}}></span>
                    <span className={styles.dot} style={{background: '#27c93f'}}></span>
                  </div>
                  <pre className={styles.code}>
{`class Developer:
    def __init__(self):
        self.name = "Viktor Bezai"
        self.role = "Full-Stack Developer"
        self.location = "London, ON"
        
    def skills(self):
        return {
            "backend": ["Django", "FastAPI", "Python"],
            "frontend": ["React", "Next.js", "TypeScript"],
            "database": ["PostgreSQL", "Redis"],
            "cloud": ["AWS", "Azure", "Docker"]
        }`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className={styles.features}>
            <h3 className={styles.sectionTitle}>My Experience</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4>Full-Stack Development</h4>
                <p>End-to-end web application development with modern frameworks and best practices</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h4>Cloud Solutions</h4>
                <p>Scalable cloud infrastructure on AWS and Azure with CI/CD pipelines</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h4>API Development</h4>
                <p>RESTful APIs and microservices with high performance and reliability</p>
              </div>
            </div>
          </section>

          {/* Quick Links Section */}
          <section className={styles.quickLinks}>
            <h3 className={styles.sectionTitle}>Explore More</h3>
            <div className={styles.linkGrid}>
              <Link href="/about" className={styles.linkCard}>
                <div className={styles.linkIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className={styles.linkContent}>
                  <h4>About Me</h4>
                  <p>Learn about my journey and experience</p>
                </div>
                <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <a 
                href="https://prepenglish.viktorbezai.online/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.linkCard}
              >
                <div className={styles.linkIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className={styles.linkContent}>
                  <h4>Prepare to English</h4>
                  <p>Check out my English learning platform</p>
                </div>
                <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contact}>
            <h3 className={styles.sectionTitle}>Let's Connect</h3>
            <p className={styles.contactText}>
              I'm always interested in new opportunities and collaborations
            </p>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/in/viktor-bezai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/viktor-bezai" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="mailto:viktorbezai@gmail.com" 
                className={styles.socialLink}
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}