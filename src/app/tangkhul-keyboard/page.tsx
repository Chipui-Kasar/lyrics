import TangkhulKeyboard from "@/components/component/TangkhulKeyboard/TangkhulKeyboard";
import {
  faqs,
  iosFaqs,
  installSteps,
  TangkhulKeyboardManifest,
} from "@/components/component/TangkhulKeyboard/TangkhulKeyboard.data";
import StructuredData from "@/components/StructureDataComponent";
import { generatePageMetadata } from "@/lib/utils";
export const dynamic = "force-static";
export const dynamicParams = false;
// Re-check the manifest URL periodically so APK link/version/date updates
// show up without redeploying this site.
export const revalidate = 3600; // 1 hour

const PAGE_URL = "https://tangkhullyrics.com/tangkhul-keyboard";
const MANIFEST_URL = process.env.NEXT_PUBLIC_TANGKHUL_KEYBOARD_MANIFEST_URL;

async function getManifest(): Promise<TangkhulKeyboardManifest> {
  const fallback: TangkhulKeyboardManifest = {
    apkUrl: "#",
    version: "",
    updatedAt: "",
  };

  if (!MANIFEST_URL) return fallback;

  try {
    const res = await fetch(MANIFEST_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return fallback;
    const data = await res.json();

    return {
      apkUrl: typeof data.apkUrl === "string" && data.apkUrl ? data.apkUrl : "#",
      version: typeof data.version === "string" ? data.version : "",
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    };
  } catch (error) {
    console.error("Failed to fetch Tangkhul Keyboard manifest:", error);
    return fallback;
  }
}

// ✅ Generate Metadata for SEO
export async function generateMetadata() {
  return generatePageMetadata({
    title:
      "Tangkhul Keyboard APK Download for Android (iOS Coming Soon) - Tangkhul Lyrics",
    description:
      "Download Tangkhul Keyboard APK free for Android. Type macron above (ā) and macron below (a̱) — marks unique to Tangkhul that no other keyboard supports. Step-by-step install guide, 100% safe. iOS version coming soon.",
    url: PAGE_URL,
    keywords:
      "Tangkhul Keyboard, Tangkhul Keyboard APK, download Tangkhul Keyboard, Tangkhul Keyboard download, Tangkhul language keyboard, macron above keyboard, macron below keyboard, a with macron below, Tangkhul typing app, Tangkhul Naga keyboard Android, Tangkhul Keyboard iOS",
  });
}

// ✅ Server Component for Tangkhul Keyboard Download Page
const TangkhulKeyboardPage = async () => {
  const { apkUrl, version, updatedAt } = await getManifest();

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tangkhul Keyboard",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Android",
    url: PAGE_URL,
    ...(apkUrl !== "#" ? { downloadUrl: apkUrl, installUrl: apkUrl } : {}),
    ...(version ? { softwareVersion: version } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    description:
      "An Android keyboard built for Tangkhul people, with dedicated macron above (ā) and macron below (a̱) keys — marks unique to Tangkhul orthography that aren't available on any other keyboard.",
    inLanguage: "tkh",
    featureList: [
      "Macron above vowel key (ā, ē, ī, ō, ū)",
      "Macron below vowel key (a̱, e̱, i̱, o̱, u̱) — unique to Tangkhul, unavailable elsewhere",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Tangkhul Lyrics",
      url: "https://tangkhullyrics.com",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Install Tangkhul Keyboard APK on Android",
    step: installSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.detail,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...faqs, ...iosFaqs].map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://tangkhullyrics.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tangkhul Keyboard",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <>
      <StructuredData data={softwareApplicationSchema} />
      <StructuredData data={howToSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <TangkhulKeyboard apkUrl={apkUrl} version={version} updatedAt={updatedAt} />
    </>
  );
};

export default TangkhulKeyboardPage;
