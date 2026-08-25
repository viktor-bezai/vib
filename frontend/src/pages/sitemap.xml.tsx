import { GetServerSideProps } from "next";
import { PROJECTS } from "@/constants/projects";
import { absoluteUrl } from "@/constants/site";

/**
 * Sitemap generated at request time from the same constants the pages use, so
 * it cannot drift: adding a project to PROJECTS adds it here automatically.
 *
 * Only <loc> is emitted. `changefreq` and `priority` are ignored by Google, and
 * a build-stamped `lastmod` would claim every URL changed on every deploy,
 * which teaches Google to distrust the one field that does matter.
 */
const staticPaths = ["/", "/about", "/projects"];

const buildSitemap = (): string => {
  const paths = [
    ...staticPaths,
    ...PROJECTS.map((project) => `/projects/${project.slug}`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.write(buildSitemap());
  res.end();
  return { props: {} };
};

// Never rendered: getServerSideProps writes the response directly.
export default function Sitemap() {
  return null;
}
