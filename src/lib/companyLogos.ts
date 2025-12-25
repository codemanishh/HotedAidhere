// Company name to domain mapping for logo fetching
const companyDomains: Record<string, string> = {
  'tcs': 'tcs.com',
  'tata consultancy services': 'tcs.com',
  'infosys': 'infosys.com',
  'wipro': 'wipro.com',
  'hcl': 'hcltech.com',
  'hcl technologies': 'hcltech.com',
  'tech mahindra': 'techmahindra.com',
  'cognizant': 'cognizant.com',
  'accenture': 'accenture.com',
  'capgemini': 'capgemini.com',
  'ibm': 'ibm.com',
  'microsoft': 'microsoft.com',
  'google': 'google.com',
  'amazon': 'amazon.com',
  'meta': 'meta.com',
  'facebook': 'meta.com',
  'apple': 'apple.com',
  'oracle': 'oracle.com',
  'sap': 'sap.com',
  'dell': 'dell.com',
  'hp': 'hp.com',
  'cisco': 'cisco.com',
  'intel': 'intel.com',
  'nvidia': 'nvidia.com',
  'salesforce': 'salesforce.com',
  'adobe': 'adobe.com',
  'vmware': 'vmware.com',
  'deloitte': 'deloitte.com',
  'pwc': 'pwc.com',
  'ey': 'ey.com',
  'ernst & young': 'ey.com',
  'kpmg': 'kpmg.com',
  'mindtree': 'mindtree.com',
  'ltimindtree': 'ltimindtree.com',
  'lti': 'lntinfotech.com',
  'l&t infotech': 'lntinfotech.com',
  'mphasis': 'mphasis.com',
  'hexaware': 'hexaware.com',
  'cyient': 'cyient.com',
  'persistent': 'persistent.com',
  'zensar': 'zensar.com',
  'birlasoft': 'birlasoft.com',
  'coforge': 'coforge.com',
  'niit': 'niit.com',
  'zoho': 'zoho.com',
  'freshworks': 'freshworks.com',
  'flipkart': 'flipkart.com',
  'paytm': 'paytm.com',
  'swiggy': 'swiggy.com',
  'zomato': 'zomato.com',
  'ola': 'olacabs.com',
  'uber': 'uber.com',
  'byju\'s': 'byjus.com',
  'byjus': 'byjus.com',
  'unacademy': 'unacademy.com',
  'razorpay': 'razorpay.com',
  'phonepe': 'phonepe.com',
  'netflix': 'netflix.com',
  'spotify': 'spotify.com',
  'twitter': 'twitter.com',
  'x': 'x.com',
  'linkedin': 'linkedin.com',
  'slack': 'slack.com',
  'zoom': 'zoom.us',
  'atlassian': 'atlassian.com',
  'shopify': 'shopify.com',
  'stripe': 'stripe.com',
  'paypal': 'paypal.com',
  'qualcomm': 'qualcomm.com',
  'samsung': 'samsung.com',
  'lg': 'lg.com',
  'sony': 'sony.com',
  'bosch': 'bosch.com',
  'siemens': 'siemens.com',
  'ge': 'ge.com',
  'general electric': 'ge.com',
  'honeywell': 'honeywell.com',
  'reliance': 'ril.com',
  'jio': 'jio.com',
  'airtel': 'airtel.in',
  'vodafone': 'vodafone.com',
};

/**
 * Get the domain for a company name
 */
export function getCompanyDomain(companyName: string): string {
  const normalizedName = companyName.toLowerCase().trim();
  
  // Check if we have a known domain mapping
  const domain = companyDomains[normalizedName];
  
  if (domain) {
    return domain;
  }
  
  // Try to guess the domain from company name
  return normalizedName.replace(/[^a-z0-9]/g, '').concat('.com');
}

/**
 * Get company logo URL using img.logo.dev API (free, no API key required for basic use)
 * This API has better CORS support than Clearbit
 */
export function getCompanyLogoUrl(companyName: string): string {
  const domain = getCompanyDomain(companyName);
  // Using logo.dev which has good CORS support
  return `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`;
}

/**
 * Get fallback logo URL using Google Favicon API
 */
export function getFallbackLogoUrl(companyName: string): string {
  const domain = getCompanyDomain(companyName);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
