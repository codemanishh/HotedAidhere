import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  const websiteUrl = "https://jobhuntingwithcodemanishh.lovable.app";
  const websiteName = "Job Hunting with Codemanishh";
  const contactEmail = "talk2manish.me@gmail.com";
  const instagramHandle = "@codemanishh";
  const telegramChannel = "@TechJob_finder";

  return (
    <>
      <Helmet>
        <title>Privacy Policy | {websiteName}</title>
        <meta name="description" content={`Privacy Policy for ${websiteName}. Learn how we collect, use, and protect your information when you use our free job listing platform.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${websiteUrl}/privacy-policy`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-foreground/90 mb-4">
                Welcome to <strong>{websiteName}</strong> (accessible at {websiteUrl}). We operate a free job listing platform that aggregates and displays job opportunities from various companies for job seekers, particularly freshers and early-career professionals in the tech industry.
              </p>
              <p className="text-foreground/90 mb-4">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. We are committed to protecting your privacy and being transparent about our data practices.
              </p>
              <p className="text-foreground/90">
                By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not agree with this policy, please do not use our website.
              </p>
            </section>

            {/* About Our Service */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. About Our Service</h2>
              <p className="text-foreground/90 mb-4">
                {websiteName} is a <strong>free job aggregation platform</strong> that:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Displays job listings from various companies (we are not the employer)</li>
                <li>Provides direct links to official company career pages for job applications</li>
                <li>Allows users to browse jobs without creating an account</li>
                <li>Features an anonymous comment section for job discussions</li>
                <li>Does not store resumes, CVs, or job applications on our platform</li>
              </ul>
              <p className="text-foreground/90">
                <strong>Important:</strong> When you click "Apply Now" on any job listing, you are redirected to the company's official career page. Any information you provide during the application process is handled by that company, not by us.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">3.1 Information Collected Automatically</h3>
              <p className="text-foreground/90 mb-4">When you visit our website, we automatically collect certain information through cookies and similar technologies:</p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li><strong>Device Information:</strong> Browser type and version, operating system, device type, screen resolution</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referring/exit pages</li>
                <li><strong>Network Information:</strong> IP address (may be anonymized), approximate geographic location (country/city level)</li>
                <li><strong>Technical Data:</strong> Date and time of access, error logs, performance metrics</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">3.2 Information You Provide</h3>
              <p className="text-foreground/90 mb-4">We collect minimal personal information:</p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li><strong>Comments:</strong> When you post a comment on job listings, we collect the anonymous display name you choose and your comment content. We do not require email or registration.</li>
                <li><strong>Contact Communications:</strong> If you contact us via Instagram ({instagramHandle}) or Telegram ({telegramChannel}), we receive information you voluntarily share.</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">3.3 Information We Do NOT Collect</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Resumes, CVs, or cover letters</li>
                <li>Social Security numbers or government IDs</li>
                <li>Bank account or credit card information</li>
                <li>Passwords (we don't have user accounts)</li>
                <li>Precise GPS location data</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-foreground/90 mb-4">
                We use cookies and similar tracking technologies to enhance your experience and serve relevant advertisements. A cookie is a small text file stored on your device.
              </p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">4.1 Types of Cookies We Use</h3>
              <table className="w-full border-collapse border border-border mb-4">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left text-foreground">Cookie Type</th>
                    <th className="border border-border p-3 text-left text-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 text-foreground/90"><strong>Essential Cookies</strong></td>
                    <td className="border border-border p-3 text-foreground/90">Required for website functionality (e.g., theme preferences, session management)</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 text-foreground/90"><strong>Analytics Cookies</strong></td>
                    <td className="border border-border p-3 text-foreground/90">Help us understand how visitors use our site, which pages are popular, and how to improve user experience</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 text-foreground/90"><strong>Advertising Cookies</strong></td>
                    <td className="border border-border p-3 text-foreground/90">Used by Google AdSense and advertising partners to serve personalized ads based on your interests and browsing history</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-xl font-medium text-foreground mb-3">4.2 Managing Cookies</h3>
              <p className="text-foreground/90 mb-4">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>View and delete cookies</li>
                <li>Block all cookies or third-party cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
              <p className="text-foreground/90">
                <strong>Note:</strong> Disabling cookies may affect website functionality and limit personalized content.
              </p>
            </section>

            {/* Third-Party Advertising */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Advertising (Google AdSense)</h2>
              <p className="text-foreground/90 mb-4">
                We use <strong>Google AdSense</strong> to display advertisements on our website. This helps us keep the service free for all users. Google AdSense uses cookies to serve ads based on your prior visits to our website and other sites.
              </p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">5.1 How Google Uses Your Data</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Google uses cookies (including the DoubleClick cookie) to serve ads based on your browsing history</li>
                <li>Google may collect information about your visits to this and other websites to provide relevant advertisements</li>
                <li>This data helps display ads for products and services that may interest you</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">5.2 Your Choices for Personalized Advertising</h3>
              <p className="text-foreground/90 mb-4">You can opt out of personalized advertising:</p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>
                  <strong>Google Ads Settings:</strong>{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    https://www.google.com/settings/ads
                  </a>
                </li>
                <li>
                  <strong>Network Advertising Initiative:</strong>{" "}
                  <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    https://optout.networkadvertising.org
                  </a>
                </li>
                <li>
                  <strong>Digital Advertising Alliance:</strong>{" "}
                  <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    https://optout.aboutads.info
                  </a>
                </li>
                <li>
                  <strong>Google's Privacy Policy:</strong>{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    https://policies.google.com/privacy
                  </a>
                </li>
              </ul>
              <p className="text-foreground/90">
                <strong>Note:</strong> Opting out does not mean you won't see ads; it means the ads may not be personalized to your interests.
              </p>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. How We Use Your Information</h2>
              <p className="text-foreground/90 mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li><strong>Provide Services:</strong> Display job listings and allow anonymous commenting</li>
                <li><strong>Improve User Experience:</strong> Analyze usage patterns to enhance website functionality and content</li>
                <li><strong>Display Relevant Ads:</strong> Show advertisements through Google AdSense to support our free service</li>
                <li><strong>Ensure Security:</strong> Detect and prevent spam, abuse, and malicious activity</li>
                <li><strong>Technical Operations:</strong> Maintain and optimize website performance</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Sharing and Disclosure</h2>
              <p className="text-foreground/90 mb-4">We do not sell your personal information. We may share information in the following circumstances:</p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">7.1 Third-Party Service Providers</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li><strong>Google AdSense:</strong> For serving advertisements</li>
                <li><strong>Hosting Providers:</strong> For website hosting and infrastructure</li>
                <li><strong>Analytics Services:</strong> For understanding website usage</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">7.2 Legal Requirements</h3>
              <p className="text-foreground/90 mb-4">
                We may disclose information if required by law, court order, or government request, or to protect our rights, safety, or property.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">7.3 Public Comments</h3>
              <p className="text-foreground/90">
                Comments you post on job listings are publicly visible. Do not share personal information in comments.
              </p>
            </section>

            {/* External Links */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Links and External Websites</h2>
              <p className="text-foreground/90 mb-4">
                Our website contains links to external websites, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Company career pages (when you click "Apply Now")</li>
                <li>LinkedIn, Glassdoor, and other job-related platforms</li>
                <li>Our social media profiles (Instagram, Telegram)</li>
              </ul>
              <p className="text-foreground/90">
                <strong>We are not responsible for the privacy practices of these external websites.</strong> We encourage you to read the privacy policies of any website you visit.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Data Security</h2>
              <p className="text-foreground/90 mb-4">
                We implement reasonable security measures to protect information, including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>HTTPS encryption for secure data transmission</li>
                <li>Regular security updates and monitoring</li>
                <li>Limited access to data on a need-to-know basis</li>
              </ul>
              <p className="text-foreground/90">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Data Retention</h2>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li><strong>Comments:</strong> Retained until manually deleted or upon user request</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely</li>
                <li><strong>Server Logs:</strong> Typically retained for 30-90 days for security purposes</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Children's Privacy</h2>
              <p className="text-foreground/90 mb-4">
                Our website is intended for users who are at least <strong>18 years old</strong> or of legal working age in their jurisdiction. We do not knowingly collect personal information from children under 13 years of age.
              </p>
              <p className="text-foreground/90">
                If you believe a child under 13 has provided us with personal information, please contact us immediately at {contactEmail}, and we will delete such information.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Your Privacy Rights</h2>
              <p className="text-foreground/90 mb-4">Depending on your location, you may have the following rights:</p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">For All Users</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Opt out of personalized advertising (see Section 5.2)</li>
                <li>Control cookies through browser settings</li>
                <li>Request deletion of your comments</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">For EU/EEA Residents (GDPR)</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">For California Residents (CCPA)</h3>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to request deletion of personal information</li>
                <li>Right to opt-out of the sale of personal information (Note: We do not sell personal information)</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>

              <p className="text-foreground/90">
                To exercise any of these rights, please contact us at {contactEmail}.
              </p>
            </section>

            {/* International Users */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. International Users</h2>
              <p className="text-foreground/90">
                Our website is primarily designed for users in India. If you access our website from other countries, please be aware that your information may be transferred to, stored, and processed in India or other countries where our service providers are located. By using our website, you consent to this transfer.
              </p>
            </section>

            {/* Policy Updates */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to This Privacy Policy</h2>
              <p className="text-foreground/90 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make material changes:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 mb-4 space-y-2">
                <li>We will update the "Last Updated" date at the top of this page</li>
                <li>For significant changes, we may post a notice on our homepage</li>
              </ul>
              <p className="text-foreground/90">
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact Us</h2>
              <p className="text-foreground/90 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none text-foreground/90 space-y-2">
                <li><strong>Website:</strong> {websiteName}</li>
                <li><strong>Email:</strong> {contactEmail}</li>
                <li>
                  <strong>Instagram:</strong>{" "}
                  <a href="https://www.instagram.com/codemanishh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {instagramHandle}
                  </a>
                </li>
                <li>
                  <strong>Telegram:</strong>{" "}
                  <a href="https://t.me/TechJob_finder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {telegramChannel}
                  </a>
                </li>
              </ul>
            </section>

            {/* Consent */}
            <section className="mb-8 p-4 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold text-foreground mb-3">Consent</h2>
              <p className="text-foreground/90">
                By using {websiteName}, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please discontinue use of our website.
              </p>
            </section>
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
