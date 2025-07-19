import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/About.module.css";

export default function AboutPage() {
  const experiences = [
    {
      title: "Software Developer",
      company: "Bucketlist Rewards",
      period: "April 2025 - Present",
      location: "Remote, Canada",
      highlights: [
        "Built and improved backend features using Django, making the system easier to understand and maintain",
        "Worked on the frontend using React and Angular to improve user interactions",
        "Created and updated REST APIs to connect different parts of the system",
        "Developed automation tools saving time and reducing manual work"
      ]
    },
    {
      title: "Software Developer",
      company: "Peavey Industries LP",
      period: "August 2023 - February 2025",
      location: "London, Ontario",
      highlights: [
        "Maintained and scaled backend APIs using Django and PostgreSQL",
        "Integrated with third-party APIs (Shopify, KIBO, Azure services)",
        "Built and maintained CI/CD pipelines using Jenkins and GitHub Actions",
        "Developed data import/export modules for CSV, Excel, XML, and JSON formats"
      ]
    },
    {
      title: "Python Developer",
      company: "Andersen Lab",
      period: "December 2020 - June 2023",
      location: "Remote, Ukraine",
      highlights: [
        "Developed scalable microservices using Event Driven Design (Kafka, RabbitMQ)",
        "Achieved 94% test coverage following TDD principles",
        "Optimized SQL queries, reducing database response times by up to 30%",
        "Mentored junior developers and conducted technical interviews"
      ]
    }
  ];

  const skills = {
    "Languages": ["Python", "JavaScript", "TypeScript", "HTML5", "CSS3"],
    "Backend": ["Django", "FastAPI", "Django REST", "Celery", "RabbitMQ", "Kafka"],
    "Frontend": ["React", "Next.js", "Angular", "Redux", "Tailwind CSS"],
    "Database": ["PostgreSQL", "MySQL", "Redis", "MongoDB", "SQLAlchemy"],
    "Cloud & DevOps": ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "CI/CD"],
    "Tools": ["Git", "Linux", "Nginx", "Sentry", "OpenAI API", "Pytest"]
  };

  return (
    <>
      <Head>
        <title>About Me - Viktor Bezai</title>
        <meta name="description" content="Full-Stack Software Developer specializing in Python, Django, React, and cloud technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Navigation */}
          <nav className={styles.navigation}>
            <Link href="/" className={styles.backLink}>
              <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </nav>
          
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.profileSection}>
                <div className={styles.profileImage}>
                  <div className={styles.imageGradient}>
                    <span className={styles.initials}>VB</span>
                  </div>
                </div>
                <div className={styles.profileInfo}>
                  <h1 className={styles.name}>Viktor Bezai</h1>
                  <p className={styles.role}>Full-Stack Software Developer</p>
                  <p className={styles.location}>
                    <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    London, ON, Canada
                  </p>
                </div>
              </div>
              
              <div className={styles.summary}>
                <p>
                  Experienced Software Engineer with a strong background in building scalable backend systems using Python and 
                  Django/FastAPI, and frontend interfaces using React/Next.js. Proven ability to take ownership of critical platform 
                  components, contribute to cross-functional teams, and deliver production-ready solutions with high availability.
                </p>
              </div>

              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <h3>5+</h3>
                  <p>Years of Experience</p>
                </div>
                <div className={styles.statCard}>
                  <h3>20+</h3>
                  <p>Projects Delivered</p>
                </div>
                <div className={styles.statCard}>
                  <h3>94%</h3>
                  <p>Test Coverage Average</p>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Timeline */}
          <section className={styles.experienceSection}>
            <h2 className={styles.sectionTitle}>Professional Journey</h2>
            <div className={styles.timeline}>
              {experiences.map((exp, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}></div>
                  <div className={styles.experienceCard}>
                    <div className={styles.experienceHeader}>
                      <div>
                        <h3 className={styles.jobTitle}>{exp.title}</h3>
                        <h4 className={styles.company}>{exp.company}</h4>
                      </div>
                      <div className={styles.experienceMeta}>
                        <span className={styles.period}>{exp.period}</span>
                        <span className={styles.location}>{exp.location}</span>
                      </div>
                    </div>
                    <ul className={styles.highlights}>
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.skillsSection}>
            <h2 className={styles.sectionTitle}>Technical Expertise</h2>
            <div className={styles.skillsContainer}>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className={styles.skillGroup}>
                  <h3 className={styles.skillCategory}>{category}</h3>
                  <div className={styles.skillTags}>
                    {items.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Competencies */}
          <section className={styles.competenciesSection}>
            <h2 className={styles.sectionTitle}>Core Competencies</h2>
            <div className={styles.competencyGrid}>
              <div className={styles.competencyCard}>
                <div className={styles.competencyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3>Problem Solving</h3>
                <p>Strong analytical skills with a track record of solving complex technical challenges</p>
              </div>
              
              <div className={styles.competencyCard}>
                <div className={styles.competencyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3>Team Collaboration</h3>
                <p>Excellent team player with experience mentoring juniors and leading technical initiatives</p>
              </div>
              
              <div className={styles.competencyCard}>
                <div className={styles.competencyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3>Performance Focus</h3>
                <p>Dedicated to optimizing applications for speed, scalability, and reliability</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2 className={styles.sectionTitle}>Let's Work Together</h2>
            <p className={styles.ctaText}>
              I'm always interested in new opportunities and exciting projects
            </p>
            <div className={styles.ctaButtons}>
              <a 
                href="https://www.linkedin.com/in/viktor-bezai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.primaryCta}
              >
                <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
              <a 
                href="mailto:viktorbezai@gmail.com" 
                className={styles.secondaryCta}
              >
                <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send an Email
              </a>
            </div>
            
            <div className={styles.socialLinks}>
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
                href="tel:+12269739711" 
                className={styles.socialLink}
                aria-label="Phone"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}