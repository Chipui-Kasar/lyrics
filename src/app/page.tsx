import HomePage from "./home/page";

export const dynamic = "force-static";
// PERFORMANCE FIX: Increased from 300s to reduce ISR writes on high-traffic landing page
// Homepage content doesn't change frequently enough to justify 5-minute revalidation
export const revalidate = 1800; // 30 minutes

export default function MainPage() {
  return <HomePage />;
}
