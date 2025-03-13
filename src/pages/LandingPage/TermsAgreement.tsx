import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAgreement() {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">User Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">Last Updated: {today}</p>
            
            <div className="prose prose-slate max-w-none">
              <p className="font-semibold">This agreement binds...</p>
              
              <h2 className="text-2xl font-semibold mt-6">1. Acceptance of Terms</h2>
              <p>
                By accessing and using ProfCelerate, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our service.
              </p>

              <h2 className="text-2xl font-semibold mt-6">2. Description of Service</h2>
              <p>
                ProfCelerate provides an automated grading platform for educational institutions.
                Our service includes features for creating assignments, submitting work, and receiving automated feedback.
              </p>

              <h2 className="text-2xl font-semibold mt-6">3. User Responsibilities</h2>
              <p>
                Users are responsible for maintaining the confidentiality of their account information
                and for all activities that occur under their account.
              </p>

              <h2 className="text-2xl font-semibold mt-6">4. Privacy Policy</h2>
              <p>
                We collect and process personal information in accordance with our Privacy Policy.
                By using our service, you consent to such processing.
              </p>

              <h2 className="text-2xl font-semibold mt-6">5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of ProfCelerate are owned by us and are
                protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-semibold mt-6">6. Limitation of Liability</h2>
              <p>
                ProfCelerate shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of the service.
              </p>

              <h2 className="text-2xl font-semibold mt-6">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of
                any material changes via email or through the platform.
              </p>

              <h2 className="text-2xl font-semibold mt-6">8. Contact Information</h2>
              <p>
                For any questions regarding these terms, please contact us at support@profcelerate.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 