import Link from "next/link";

interface PromotionalItem {
  title: string;
  description: string;
  linkUrl: string;
  buttonText: string;
  backgroundColor: string;
}

// A single static promotion. This used to be an auto-rotating carousel, but
// swapping to slide 2 after 5s produced a new, larger paint that Lighthouse
// and Chrome's real-user metrics counted as the page's LCP (~5.8s on mobile).
// To change the promotion, edit this object (e.g. swap in the "Submit Your
// Lyrics" copy: linkUrl "/contribute", buttonText "Contribute").
const PROMOTION: PromotionalItem = {
  title: "🎵 New Release: Tangkhul Songs Collection",
  description:
    "Discover authentic traditional melodies preserved for generations",
  linkUrl: "/lyrics",
  buttonText: "Explore Now",
  backgroundColor: "bg-gradient-to-r from-[#79095c] to-[#001fff]",
};

const PromotionalBanner = () => {
  const item = PROMOTION;

  return (
    <section
      className="w-full bg-gray-50 dark:bg-gray-900 py-6 border-y border-gray-200 dark:border-gray-700"
      style={{ minHeight: "200px" }}
    >
      <div className="container mx-auto p-4 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <div
          className={`relative overflow-hidden rounded-xl shadow-lg ${item.backgroundColor} p-6 md:p-8`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white">
                {item.title}
              </p>
              <p className="text-lg mb-4 text-white opacity-90">
                {item.description}
              </p>

              <Link
                href={item.linkUrl}
                className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 transform"
              >
                {item.buttonText}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
