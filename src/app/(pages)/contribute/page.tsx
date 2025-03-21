import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";
import { generatePageMetadata } from "@/lib/utils";

// ✅ Generate Metadata for SEO
export async function generateMetadata() {
  return generatePageMetadata({
    title: "Contribute Tangkhul Lyrics - Share Your Songs",
    description:
      "Contribute your Tangkhul song lyrics and help preserve the beauty of Tangkhul music. Join our community today!",
    url: "https://tangkhullyrics.com/contribute",
    keywords:
      "contribute Tangkhul lyrics, add Tangkhul songs, share lyrics, Tangkhul music community",
  });
}

// ✅ Contribute Page Component
const ContributePage = () => {
  return <ContributeLyrics />;
};

export default ContributePage;
