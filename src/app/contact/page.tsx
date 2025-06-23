import Contact from "@/components/component/Contact/Contact";
import { generatePageMetadata } from "@/lib/utils";
export const dynamic = "force-static";
// ✅ Generate Metadata for SEO
export async function generateMetadata() {
  return generatePageMetadata({
    title: "Contact Us - Tangkhul Lyrics",
    description:
      "Get in touch with us for inquiries, suggestions, or contributions. We'd love to hear from you!",
    url: "https://tangkhullyrics.com/contact",
    keywords:
      "contact Tangkhul lyrics, reach out, support, Tangkhul music inquiries, song lyrics help",
  });
}

// ✅ Contact Page Component
const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
