import { generatePageMetadata } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Privacy Policy - Tangkhul Lyrics",
    description:
      "Learn how Tangkhul Lyrics collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
    url: "https://tangkhullyrics.com/privacy",
    keywords:
      "privacy policy, data protection, personal information, Tangkhul Lyrics",
  });
}

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            <strong>Last updated:</strong> August 2, 2025
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            This Privacy Policy describes how Tangkhul Lyrics collects, uses,
            and protects your information when you use our website.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-xl font-medium mb-3">Personal Information</h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              Contribute lyrics or artist information through our contribution
              form
            </li>
            <li>Share your email address when submitting contributions</li>
            <li>Contact us through our contact form</li>
            <li>Subscribe to our newsletter or updates</li>
            <li>Participate in community discussions</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            Automatically Collected Information
          </h3>
          <p className="mb-4">
            When you visit our website, we automatically collect certain
            information about your device and usage:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website</li>
            <li>Device information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To improve user experience and website functionality</li>
            <li>To communicate with you about updates and new features</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To prevent fraud and ensure website security</li>
            <li>To analyze website usage and improve our content</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Information Sharing and Disclosure
          </h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties except in the following circumstances:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>With your explicit consent</li>
            <li>
              To trusted service providers who assist us in operating our
              website
            </li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, please note that no method of transmission
            over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Cookies and Tracking Technologies
          </h2>
          <p className="mb-4">
            Our website uses cookies and similar tracking technologies to
            enhance your browsing experience. You can control cookie settings
            through your browser preferences. For more details, please see our
            <Link
              href="/cookies"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              rel="noopener noreferrer"
            >
              {" "}
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Changes to This Privacy Policy
          </h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
        </section>

        <div className="text-center text-sm text-muted-foreground mt-12">
          <p>
            This privacy policy is designed to help you understand how we
            collect and use your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
