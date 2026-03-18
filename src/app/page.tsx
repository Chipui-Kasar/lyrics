import HomePage from "./home/page";

export { generateMetadata, dynamic, revalidate } from "./home/page";

export default function MainPage() {
  return <HomePage />;
}
