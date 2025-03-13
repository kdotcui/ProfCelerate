import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationBar } from "@/components/landingpage/navigation-bar";

export default function PrivacyPolicy() {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">Last Updated: {today}</p>
            
            <div className="prose prose-slate max-w-none">
              <p className="font-semibold">This Privacy Policy describes how ProfCelerate collects, uses, and protects your personal information...</p>
              
              <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Account information (name, email, institution)</li>
                <li>Profile information</li>
                <li>Assignment submissions and grades</li>
                <li>Communication preferences</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
              <p>
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Provide and maintain our services</li>
                <li>Process your assignments and provide grading</li>
                <li>Send you important updates and notifications</li>
                <li>Improve our services and user experience</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">3. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information
                from unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-semibold mt-6">4. Data Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Service providers who assist in our operations</li>
                <li>Educational institutions you are associated with</li>
                <li>When required by law</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience
                and collect usage data. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-2xl font-semibold mt-6">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-semibold mt-6">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@profcelerate.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 