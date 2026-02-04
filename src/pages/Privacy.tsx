import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">TaxForm Pro</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 4, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                TaxForm Pro ("we," "our," or "us") is committed to protecting your privacy. This 
                Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our tax form generation service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, phone number, mailing address</li>
                <li><strong>Financial Information:</strong> Income details, tax identification numbers (SSN, EIN)</li>
                <li><strong>Employment Information:</strong> Employer details, wages, tax withholdings</li>
                <li><strong>Account Information:</strong> Login credentials, account preferences</li>
                <li><strong>Payment Information:</strong> Credit card details (processed securely by our payment provider)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Generate accurate tax forms and documents as requested</li>
                <li>Process payments and prevent fraud</li>
                <li>Communicate with you about your account and services</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations and tax regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Secure, encrypted storage of sensitive information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to provide our services 
                and comply with legal obligations. Tax-related documents may be retained for up to 7 
                years as required by IRS regulations. You may request deletion of your account and 
                associated data at any time, subject to legal retention requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Third parties who assist in operating our service (payment processors, hosting providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law, subpoena, or court order</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to improve your experience, analyze usage, 
                and personalize content. You can control cookie preferences through your browser 
                settings. Some features may not function properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Service is not intended for individuals under 18 years of age. We do not knowingly 
                collect personal information from children. If we become aware that we have collected 
                data from a child, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. California Privacy Rights</h2>
              <p className="text-muted-foreground">
                California residents have additional rights under the California Consumer Privacy Act 
                (CCPA), including the right to know what personal information is collected, request 
                deletion, and opt-out of the sale of personal information (which we do not do).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-1 text-muted-foreground mt-4">
                <li>Email: privacy@taxformpro.com</li>
                <li>Phone: 1-800-TAX-FORM</li>
                <li>Address: 123 Tax Street, Suite 100, New York, NY 10001</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 TaxForm Pro. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/privacy" className="text-foreground font-medium">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}