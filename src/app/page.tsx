import HomePage from "./home/page";

export const dynamic = "force-static";
export const revalidate = 300;

export default function MainPage() {
  return <HomePage />;
}
