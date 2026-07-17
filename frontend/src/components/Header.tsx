import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { pathname } = useRouter();

  return (
    <header className={styles.header}>
      <nav className={styles.inner} aria-label="Primary">
        <Link
          href="/"
          className={styles.brand}
          aria-label="Viktor Bezai — home"
        >
          <span className={styles.prompt}>viktor@bezai</span>
          <span className={styles.sep}>:~$</span>
          <span className={styles.caret} aria-hidden="true" />
        </Link>

        <ul className={styles.links}>
          <li>
            <Link
              href="/about"
              className={styles.link}
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              About Me
            </Link>
          </li>
          <li>
            <a
              href="https://prepenglish.viktorbezai.online/"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              PrepEnglish
              <span className={styles.external} aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://anna-egypt.com/"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Anna-Egypt
              <span className={styles.external} aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
