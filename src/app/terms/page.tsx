import { generatePageMetadata } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Terms of Service - Tangkhul Lyrics",
    description:
      "Read the terms and conditions for using Tangkhul Lyrics. Understand your rights and responsibilities when using our platform.",
    url: "https://tangkhullyrics.com/terms",
    keywords:
      "terms of service, terms and conditions, user agreement, Tangkhul Lyrics",
  });
}

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Terms of Service
        </h1>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
            <strong>Last updated:</strong> August 2, 2025
          </p>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please read these Terms of Service carefully before using Tangkhul
            Lyrics. By accessing or using our service, you agree to be bound by
            these terms.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using Tangkhul Lyrics ("we," "our," or "us"), you
            accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p className="mb-4">
            Tangkhul Lyrics is a platform dedicated to preserving and sharing
            Tangkhul song lyrics and cultural. Our service includes:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Access to a collection of Tangkhul song lyrics</li>
            <li>Artist information and profiles</li>
            <li>User-contributed content</li>
            <li>Search and discovery features</li>
            <li>Community interaction features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Contributions</h2>
          <h3 className="text-xl font-medium mb-3">Content Submission</h3>
          <p className="mb-4">
            When you submit content through our contribution form (lyrics,
            artist information, comments), you represent that:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>You have the right to submit the content</li>
            <li>The content is accurate to the best of your knowledge</li>
            <li>The content does not violate any copyright or other rights</li>
            <li>The content is appropriate and respectful</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Email Communication</h3>
          <p className="mb-4">
            By providing your email address when contributing content, you agree
            that we may contact you regarding:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Verification of submitted content</li>
            <li>Questions about your contributions</li>
            <li>Updates about the status of your submissions</li>
            <li>
              Occasional newsletters about Tangkhul cultural preservation (with
              opt-out option)
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Prohibited Activities</h3>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Submit false, misleading, or inappropriate content</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Engage in harassment or abusive behavior</li>
            <li>Attempt to hack or disrupt our service</li>
            <li>Use automated tools to access our service</li>
            <li>Spam or send unsolicited communications</li>
            <li>Provide false email addresses or contact information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Intellectual Property
          </h2>
          <h3 className="text-xl font-medium mb-3">Our Content</h3>
          <p className="mb-4">
            The Tangkhul Lyrics platform, including its design, features, and
            original content, is owned by us and protected by intellectual
            property laws.
          </p>

          <h3 className="text-xl font-medium mb-3">User-Submitted Content</h3>
          <p className="mb-4">
            By submitting content, you grant us a non-exclusive, worldwide,
            royalty-free license to use, display, and distribute your content on
            our platform for the purpose of preserving and sharing Tangkhul
            cultural.
          </p>

          <h3 className="text-xl font-medium mb-3">Traditional Content</h3>
          <p className="mb-4">
            We respect that many lyrics and songs are part of traditional
            Tangkhul. We aim to preserve and honor this cultural content while
            respecting the rights of contemporary artists and creators.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Copyright and DMCA</h2>
          <p className="mb-4">
            We respect intellectual property rights. If you believe content on
            our site infringes your copyright, please contact us with:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Description of the copyrighted work</li>
            <li>Location of the infringing content</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief</li>
            <li>Your electronic or physical signature</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Disclaimers and Limitations
          </h2>
          <h3 className="text-xl font-medium mb-3">Service Availability</h3>
          <p className="mb-4">
            We strive to maintain service availability but cannot guarantee
            uninterrupted access. We reserve the right to modify or discontinue
            the service with or without notice.
          </p>

          <h3 className="text-xl font-medium mb-3">Content Accuracy</h3>
          <p className="mb-4">
            While we strive for accuracy, we cannot guarantee that all content
            is error-free or complete. Users should verify information
            independently when necessary.
          </p>

          <h3 className="text-xl font-medium mb-3">Limitation of Liability</h3>
          <p className="mb-4">
            To the fullest extent permitted by law, Tangkhul Lyrics shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our
            <Link
              href="/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              rel="noopener noreferrer"
            >
              {" "}
              Privacy Policy
            </Link>
            , which also governs your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Changes will
            be effective immediately upon posting. Your continued use of the
            service constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with
            the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please
            contact us:
          </p>
        </section>

        <div className="text-center text-sm text-muted-foreground mt-12">
          <p>
            By using Tangkhul Lyrics, you acknowledge that you have read and
            understood these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
