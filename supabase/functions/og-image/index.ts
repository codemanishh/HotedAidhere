import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const company = url.searchParams.get("company") || "Company";
    const role = url.searchParams.get("role") || "Job Opening";
    const location = url.searchParams.get("location") || "";
    const experience = url.searchParams.get("experience") || "";

    // Generate a color based on company name for variety
    const hash = company.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const hue = Math.abs(hash) % 360;

    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 20%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360}, 60%, 10%);stop-opacity:1" />
          </linearGradient>
          <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:hsl(${hue}, 80%, 60%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${(hue + 60) % 360}, 70%, 50%);stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bg)"/>
        
        <!-- Decorative circles -->
        <circle cx="1100" cy="100" r="200" fill="hsl(${hue}, 60%, 30%)" opacity="0.3"/>
        <circle cx="100" cy="530" r="150" fill="hsl(${(hue + 40) % 360}, 50%, 25%)" opacity="0.3"/>
        
        <!-- Company Initial Circle -->
        <circle cx="120" cy="120" r="60" fill="url(#accent)"/>
        <text x="120" y="140" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle">${company.charAt(0).toUpperCase()}</text>
        
        <!-- Company Name -->
        <text x="200" y="130" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">${escapeXml(company.length > 35 ? company.substring(0, 35) + '...' : company)}</text>
        
        <!-- Hiring Badge -->
        <rect x="60" y="200" width="140" height="40" rx="20" fill="url(#accent)"/>
        <text x="130" y="228" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🎯 HIRING</text>
        
        <!-- Job Role -->
        <text x="60" y="320" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="white">${escapeXml(role.length > 30 ? role.substring(0, 30) + '...' : role)}</text>
        
        <!-- Location & Experience -->
        <text x="60" y="400" font-family="Arial, sans-serif" font-size="28" fill="hsl(${hue}, 40%, 80%)">📍 ${escapeXml(location.length > 40 ? location.substring(0, 40) + '...' : location)}</text>
        <text x="60" y="450" font-family="Arial, sans-serif" font-size="28" fill="hsl(${hue}, 40%, 80%)">💼 ${escapeXml(experience)}</text>
        
        <!-- Bottom branding -->
        <rect x="0" y="550" width="1200" height="80" fill="rgba(0,0,0,0.3)"/>
        <text x="60" y="600" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.9">FreshersJob.tech - Find Your Dream Job</text>
        <text x="1140" y="600" font-family="Arial, sans-serif" font-size="20" fill="white" opacity="0.7" text-anchor="end">Apply Now →</text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: unknown) {
    console.error("Error generating OG image:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
