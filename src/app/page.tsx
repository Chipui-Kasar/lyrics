import HomePage from "./home/page";
// import RootLayout from "./layout";

export const dynamic = "force-static";
export const revalidate = 300;

export default function MainPage() {
  return <HomePage />;
}
