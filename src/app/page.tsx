import HomePage from "./(pages)/home/page";
// import RootLayout from "./layout";

export const dynamic = "force-static";
export const revalidate = 604800;

export default function MainPage() {
  return <HomePage />;
}
