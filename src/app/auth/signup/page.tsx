import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up — Tangkhul Lyrics",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tangkhullyrics.com/auth/signup" },
};

export default function SignUpPage() {
  return <SignUpForm />;
}
