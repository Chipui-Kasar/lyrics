import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Tangkhul Lyrics",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tangkhullyrics.com/auth/signin" },
};

export default function SignInPage() {
  return <SignInForm />;
}
