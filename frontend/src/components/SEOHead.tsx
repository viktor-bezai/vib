import Head from "next/head";
import { useRouter } from "next/router";
import { SITE_NAME, absoluteUrl } from "@/constants/site";

const OG_IMAGE_MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const ogImageMimeType = (url: string) => {
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return OG_IMAGE_MIME_TYPES[extension] ?? "image/jpeg";
};

interface SEOHeadProps {
  title: string;
  description: string;
  /** Only pass this when the canonical differs from the current route. */
  canonical?: string;
  /** Site-relative or absolute. Site-relative is absolutized here. */
  ogImage?: string;
  ogType?: string;
  robots?: string;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "/viktor-bezai.jpg",
  ogType = "website",
  robots = "index, follow",
  structuredData,
}: SEOHeadProps) {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  // Derived from the route so it follows URL changes instead of going stale.
  const resolvedCanonical = canonical ?? absoluteUrl(path);
  const resolvedOgImage = ogImage.startsWith("http")
    ? ogImage
    : absoluteUrl(ogImage);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta
        property="og:image:type"
        content={ogImageMimeType(resolvedOgImage)}
      />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
