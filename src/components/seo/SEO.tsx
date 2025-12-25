import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  jobPosting?: {
    title: string;
    company: string;
    location: string;
    salary?: string;
    datePosted: string;
    validThrough: string;
    description: string;
    applyUrl: string;
  };
}

const SITE_NAME = "job hunting with Codemanishh";
const SITE_URL = "https://freshjobs.lovable.app";
const DEFAULT_DESCRIPTION = "Find the best job opportunities for freshers in India. Get hired by top companies like TCS, Infosys, Wipro, Cognizant with zero experience required. Daily updated fresher job openings 2025.";
const DEFAULT_KEYWORDS = "fresher jobs, fresher jobs 2025, entry level jobs, campus placement, IT jobs India, software developer jobs, TCS jobs, Infosys careers, Wipro hiring, first job, graduate jobs, codemanishh, job hunting";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = `${SITE_URL}/og-image.png`,
  ogType = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  breadcrumbs,
  jobPosting,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Latest Fresher Jobs in India 2025`;
  const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : SITE_URL);

  // Job Posting Schema
  const jobPostingSchema = jobPosting
    ? {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        title: jobPosting.title,
        description: jobPosting.description,
        datePosted: jobPosting.datePosted,
        validThrough: jobPosting.validThrough,
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: jobPosting.company,
          sameAs: `${SITE_URL}/?company=${encodeURIComponent(jobPosting.company.toLowerCase())}`,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: jobPosting.location,
            addressRegion: jobPosting.location,
            addressCountry: "IN",
          },
        },
        ...(jobPosting.salary && {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              value: jobPosting.salary,
              unitText: "YEAR",
            },
          },
        }),
        directApply: true,
        applicationContact: {
          "@type": "ContactPoint",
          url: jobPosting.applyUrl,
        },
        experienceRequirements: "No experience required",
        industry: "Information Technology",
      }
    : null;

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Article specific */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && (
        <meta property="article:author" content={SITE_NAME} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data - Job Posting */}
      {jobPostingSchema && (
        <script type="application/ld+json">
          {JSON.stringify(jobPostingSchema)}
        </script>
      )}
      
      {/* Structured Data - Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};
