import About from "@/components/component/About/About";
import { generatePageMetadata } from "@/lib/utils";
export const dynamic = "force-static";
// ✅ Generate Metadata for SEO
export async function generateMetadata() {
  return generatePageMetadata({
    title: "About Us - Tangkhul Lyrics",
    description:
      "Learn more about Tangkhul Lyrics, our mission, and how we bring Tangkhul music lyrics to the world.",
    url: "https://tangkhullyrics.com/about",
    keywords:
      "About Tangkhul Lyrics, Tangkhul music, Tangkhul songs, lyrics platform",
  });
}

// ✅ Server Component for About Page
const AboutPage = () => {
  return <About />;
};

export default AboutPage;
