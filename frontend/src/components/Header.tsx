import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/Header.module.css";

type Splash = { id: number; text: string };

// How long the full-screen takeover stays before it fades out (ms).
const SPLASH_DURATION = 2800;

export default function Header() {
  const { pathname } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [splash, setSplash] = useState<Splash | null>(null);

  const clearSplash = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSplash(null);
  }, []);

  const runCommand = useCallback(() => {
    const text = value.trim();
    if (!text) return;
    setSplash({ id: nextId.current++, text });
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSplash(null), SPLASH_DURATION);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand();
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  // Dismiss the takeover with Escape; clean up the timer on unmount.
  useEffect(() => {
    if (!splash) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSplash();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [splash, clearSplash]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.inner} aria-label="Primary">
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.host}
              aria-label="Viktor Bezai — home"
            >
              viktor@bezai
            </Link>
            <span
              className={styles.terminal}
              onClick={() => inputRef.current?.focus()}
            >
              <span className={styles.sep}>:~$</span>
              <input
                ref={inputRef}
                className={styles.input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{ width: `${Math.max(value.length, 1)}ch` }}
                aria-label="Terminal — type a message and press Enter"
                spellCheck={false}
                autoComplete="off"
                maxLength={60}
              />
              <span className={styles.caret} aria-hidden="true" />
              {focused && !value && (
                <span className={styles.hint} aria-hidden="true">
                  type &amp; press enter
                </span>
              )}
            </span>
          </div>

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

      {splash && (
        <div
          key={splash.id}
          className={styles.splash}
          onClick={clearSplash}
          role="status"
          aria-live="assertive"
        >
          <span className={styles.splashText}>
            {splash.text}
            <span className={styles.splashCaret} aria-hidden="true" />
          </span>
        </div>
      )}
    </>
  );
}
