import { Helmet } from "react-helmet-async";

const SITE_URL = "https://buddybeeai.com";
const SITE_NAME = "BuddyBee AI";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Drop this into any page to control that route's <head> tags.
 * Falls back to sensible site-wide defaults if a prop is omitted.
 *
 * path      - route path starting with "/", e.g. "/features"
 * title     - page title (site name is appended automatically)
 * description - meta description (~150-160 chars ideal)
 * image     - absolute URL to a 1200x630 social preview image
 * noindex   - set true for auth/dashboard/utility pages that should never be indexed
 */
export default function SEO({
  path = "/",
  title,
  description = "BuddyBee AI is an AI-powered student wellness platform that helps schools detect stress early, support student mental health, and improve academic outcomes.",
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  const url = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Student Wellness Companion`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
