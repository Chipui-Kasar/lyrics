import { generatePageMetadata } from "@/lib/utils";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Cookie Policy - Tangkhul Lyrics",
    description:
      "Learn about how Tangkhul Lyrics uses cookies and similar technologies to enhance your browsing experience.",
    url: "https://tangkhullyrics.com/cookies",
    keywords:
      "cookie policy, cookies, tracking, web technologies, Tangkhul Lyrics",
  });
}

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-center">Cookie Policy</h1>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <p className="text-sm text-green-800 dark:text-green-200 mb-2">
            <strong>Last updated:</strong> August 2, 2025
          </p>
          <p className="text-green-700 dark:text-green-300">
            This Cookie Policy explains how Tangkhul Lyrics uses cookies and
            similar technologies when you visit our website.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small text files that are stored on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and to provide information to website
            owners.
          </p>
          <p className="mb-4">
            Cookies allow us to recognize your device and store some information
            about your preferences or past actions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="mb-4">
            Tangkhul Lyrics uses cookies for several purposes:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>To ensure our website functions properly</li>
            <li>To remember your preferences and settings</li>
            <li>To analyze how our website is used</li>
            <li>To improve user experience</li>
            <li>To provide personalized content</li>
            <li>To maintain security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Types of Cookies We Use
          </h2>

          <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
          <p className="mb-4">
            These cookies are necessary for the website to function and cannot
            be switched off. They are usually only set in response to actions
            you take, such as setting privacy preferences or logging in.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <ul className="text-sm space-y-1">
              <li>
                <strong>Session cookies:</strong> Expire when you close your
                browser
              </li>
              <li>
                <strong>Authentication cookies:</strong> Remember your login
                status
              </li>
              <li>
                <strong>Security cookies:</strong> Protect against fraud and
                security threats
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-medium mb-3">Performance Cookies</h3>
          <p className="mb-4">
            These cookies collect information about how visitors use our
            website, such as which pages are visited most often. This data helps
            us improve how our website works.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <ul className="text-sm space-y-1">
              <li>
                <strong>Analytics cookies:</strong> Track website usage and
                performance
              </li>
              <li>
                <strong>Error reporting:</strong> Help us identify and fix
                issues
              </li>
              <li>
                <strong>Load balancing:</strong> Distribute traffic efficiently
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-medium mb-3">Functional Cookies</h3>
          <p className="mb-4">
            These cookies enable the website to provide enhanced functionality
            and personalization. They may be set by us or by third-party
            providers.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <ul className="text-sm space-y-1">
              <li>
                <strong>Theme cookies:</strong> Remember dark/light mode
                preference
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-medium mb-3">
            Targeting/Advertising Cookies
          </h3>
          <p className="mb-4">
            These cookies may be set through our site by advertising partners.
            They may be used to build a profile of your interests and show
            relevant advertisements.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <ul className="text-sm space-y-1">
              <li>
                <strong>Ad targeting:</strong> Show relevant advertisements
              </li>
              <li>
                <strong>Social media:</strong> Enable social sharing features
              </li>
              <li>
                <strong>Cross-site tracking:</strong> Track across different
                websites (if applicable)
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Third-Party Cookies
          </h2>
          <p className="mb-4">
            Some cookies are placed by third-party services that appear on our
            pages. We may use:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              <strong>Google Analytics:</strong> To analyze website traffic and
              user behavior
            </li>
            <li>
              <strong>Social Media Platforms:</strong> For sharing buttons and
              embedded content
            </li>
            <li>
              <strong>Content Delivery Networks:</strong> To improve website
              performance
            </li>
            <li>
              <strong>Authentication Providers:</strong> For secure login
              functionality
            </li>
          </ul>
          <p className="mb-4">
            These third parties may use cookies in accordance with their own
            privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Managing Your Cookie Preferences
          </h2>

          <h3 className="text-xl font-medium mb-3">Browser Settings</h3>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their
            settings preferences. You can:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>View what cookies are stored on your device</li>
            <li>Delete cookies from your device</li>
            <li>Block cookies from specific websites</li>
            <li>Block all cookies</li>
            <li>Get notifications when cookies are set</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            Browser-Specific Instructions
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Chrome</h4>
              <p className="text-sm">
                Settings → Privacy and Security → Cookies and other site data
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Firefox</h4>
              <p className="text-sm">
                Settings → Privacy & Security → Cookies and Site Data
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Safari</h4>
              <p className="text-sm">
                Preferences → Privacy → Manage Website Data
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Edge</h4>
              <p className="text-sm">
                Settings → Cookies and site permissions → Cookies and site data
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Disabling cookies may affect the
              functionality of our website and limit your user experience.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookie Consent</h2>
          <p className="mb-4">
            When you first visit our website, you may see a cookie consent
            banner. You can:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Accept all cookies</li>
            <li>Reject non-essential cookies</li>
            <li>Customize your cookie preferences</li>
            <li>Change your preferences at any time</li>
          </ul>
          <p className="mb-4">
            Essential cookies will still be used to ensure basic website
            functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p className="mb-4">
            Different types of cookies have different lifespans:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              <strong>Session cookies:</strong> Deleted when you close your
              browser
            </li>
            <li>
              <strong>Persistent cookies:</strong> Remain for a predetermined
              period (typically 30 days to 2 years)
            </li>
            <li>
              <strong>User preference cookies:</strong> Stored until you clear
              them or change settings
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Updates to This Cookie Policy
          </h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time to reflect
            changes in our practices or applicable laws. We will notify you of
            any significant changes by posting the updated policy on our
            website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies, please contact
            us:
          </p>
        </section>

        <div className="text-center text-sm text-muted-foreground mt-12">
          <p>
            This cookie policy helps you understand how we use cookies to
            improve your experience on Tangkhul Lyrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
