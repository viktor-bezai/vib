/**
 * Single source of truth for the public site identity.
 *
 * Every canonical URL, OG tag and sitemap entry must build on these. Moving the
 * domain should mean changing SITE_URL here and nothing else.
 */
export const SITE_URL = "https://viktorbezai.com";
export const SITE_HOST = "viktorbezai.com";
export const SITE_NAME = "Viktor Bezai";
export const SITE_ROLE = "Software Developer";
export const SITE_LOCATION = "London, Ontario, Canada";
export const SITE_DESCRIPTION =
  "Software developer in London, Ontario. Python, Django, React and cloud infrastructure. Builder of EnvolPrep and Anna-Egypt.";

/** Profiles Google can use to tie this person to the same entity elsewhere. */
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/viktor-bezai/",
  github: "https://github.com/viktor-bezai",
} as const;

/** Absolute URL for a site-relative path. The trailing slash on "/" is dropped so canonicals never vary by a slash. */
export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path === "/" ? "" : path}`;
