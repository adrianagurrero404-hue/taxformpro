import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
          <h1 className="text-4xl font-display font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 4, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using TaxForm Pro ("Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                TaxForm Pro provides online tax form generation services including but not limited to 
                W-2, 1099 series forms, and paystub generation. The Service is designed to assist users 
                in creating tax documents for legitimate purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information when using our services</li>
                <li>Use the generated documents only for lawful purposes</li>
                <li>Not use the Service to create fraudulent or misleading documents</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Comply with all applicable federal, state, and local tax laws</li>
                <li>Not share, resell, or redistribute generated documents for profit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">You may not use this Service to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Create fraudulent tax documents or commit tax fraud</li>
                <li>Misrepresent income, employment, or tax status</li>
                <li>Submit false information to the IRS or any government agency</li>
                <li>Engage in identity theft or impersonation</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices. We implement industry-standard 
                security measures to protect your personal and financial information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Payment and Refunds</h2>
              <p className="text-muted-foreground">
                All payments are processed securely. Refunds may be issued at our discretion within 
                30 days of purchase if the Service was not delivered as described. Once a document 
                has been generated and downloaded, refunds will not be provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE 
                THAT THE DOCUMENTS GENERATED WILL BE ACCEPTED BY THE IRS OR ANY OTHER AGENCY. 
                USERS ARE RESPONSIBLE FOR VERIFYING THE ACCURACY OF ALL INFORMATION.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall TaxForm Pro, its officers, directors, employees, or agents be liable 
                for any indirect, incidental, special, consequential, or punitive damages arising out 
                of or in connection with your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless TaxForm Pro and its affiliates from any claims, 
                damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the 
                United States of America, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-none space-y-1 text-muted-foreground mt-4">
                <li>Email: legal@taxformpro.com</li>
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
            <Link to="/terms" className="text-foreground font-medium">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}