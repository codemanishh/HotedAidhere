import { useState } from "react";
import { getCompanyLogoUrl, getFallbackLogoUrl } from "@/lib/companyLogos";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-base",
  md: "h-12 w-12 text-lg",
  lg: "h-16 w-16 text-2xl",
};

export function CompanyLogo({ companyName, size = "md", className }: CompanyLogoProps) {
  const [currentSrc, setCurrentSrc] = useState<'primary' | 'fallback' | 'none'>('primary');
  
  const logoUrl = getCompanyLogoUrl(companyName);
  const fallbackUrl = getFallbackLogoUrl(companyName);

  const handleError = () => {
    if (currentSrc === 'primary') {
      setCurrentSrc('fallback');
    } else {
      setCurrentSrc('none');
    }
  };

  // Show letter fallback
  if (currentSrc === 'none') {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-display font-bold",
          sizeClasses[size],
          className
        )}
      >
        {companyName.charAt(0).toUpperCase()}
      </div>
    );
  }

  const imgSrc = currentSrc === 'primary' ? logoUrl : fallbackUrl;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-background border border-border overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={imgSrc}
        alt={`${companyName} logo`}
        className="h-full w-full object-contain p-1.5"
        onError={handleError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  );
}
