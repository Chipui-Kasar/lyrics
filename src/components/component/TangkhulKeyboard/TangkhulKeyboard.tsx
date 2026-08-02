import type { ReactNode } from "react";
import {
  Download,
  ShieldCheck,
  Keyboard,
  HelpCircle,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export interface TangkhulKeyboardManifest {
  apkUrl: string;
  version: string;
  updatedAt: string;
}

// The Unicode combining macron-below mark (U+0331) is positioned incorrectly
// by most system fonts — it's a rare diacritic most font shaping tables don't
// account for. Drawing it as a CSS underline renders it consistently instead.
const MacronBelow = ({ children }: { children: string }) => (
  <span className="underline decoration-2 underline-offset-[3px]">
    {children}
  </span>
);

export const features: {
  id: string;
  title: ReactNode;
  description: ReactNode;
}[] = [
  {
    id: "macron-above",
    title: "Macron Above (ā)",
    description:
      "Type vowels with a macron above — ā, ē, ī, ō, ū — with a single key press, used to mark long vowel sounds in Tangkhul spelling.",
  },
  {
    id: "macron-below",
    title: (
      <>
        Macron Below (<MacronBelow>a</MacronBelow>)
      </>
    ),
    description: (
      <>
        Type vowels with a macron below — <MacronBelow>a</MacronBelow>,{" "}
        <MacronBelow>e</MacronBelow>, <MacronBelow>i</MacronBelow>,{" "}
        <MacronBelow>o</MacronBelow>, <MacronBelow>u</MacronBelow> — a mark
        unique to Tangkhul orthography. Built specifically for Tangkhul people,
        since this character can't be typed on any other available keyboard.
      </>
    ),
  },
];

export const installSteps = [
  {
    title: "Download the APK",
    detail:
      'Tap the "Download Tangkhul Keyboard" button above. Your browser will download the file (tangkhul-keyboard.apk) to your Downloads folder.',
  },
  {
    title: "Allow installs from this source",
    detail:
      'When you open the file, Android may block it with "For your security, your phone is not allowed to install unknown apps from this source." Tap Settings on that prompt, then turn on "Allow from this source." This only applies to the app you used to download the file (e.g. Chrome), not your whole phone.',
  },
  {
    title: "Continue past the Play Protect warning",
    detail:
      'Google Play Protect may show "This app may be unsafe" simply because the app isn\'t installed via the Play Store. Tap "More details," then tap "Install anyway." This is a routine warning for any app installed outside the Play Store — it does not mean the app itself is harmful.',
  },
  {
    title: "Install and enable the keyboard",
    detail:
      "Tap Install, then Open once it finishes. Go to Settings > System > Languages & input > On-screen keyboard, enable Tangkhul Keyboard, then switch to it from the keyboard selector when typing.",
  },
];

export const faqs = [
  {
    question: "Is Tangkhul Keyboard safe to install?",
    answer:
      "Yes, it's 100% safe to install. Tangkhul Keyboard is not published on the Google Play Store, so Android shows extra security prompts when you install it — this is standard behavior for any app installed outside the Play Store, not a sign that something is wrong. The app only provides keyboard input for typing Tangkhul and does not request access to your contacts, messages, or personal data.",
  },
  {
    question: "Why isn't Tangkhul Keyboard on the Google Play Store?",
    answer:
      "Tangkhul Keyboard is distributed as a direct APK download instead of through the Play Store. You can install it manually on any Android phone using the steps on this page.",
  },
  {
    question:
      'Why does Android say "unknown apps blocked" when I try to install it?',
    answer:
      "Android blocks installs from any source other than the Play Store by default. This is a general Android setting, not a warning about this specific app. Enabling it for your browser only allows that browser to prompt an install — it doesn't install anything automatically.",
  },
  {
    question: 'Why does Google Play Protect say "this app may be unsafe"?',
    answer:
      "Play Protect flags apps it hasn't scanned through the Play Store, regardless of whether they're actually harmful. Since Tangkhul Keyboard isn't listed on the Play Store, this notice will appear every time — tapping \"Install anyway\" is expected and safe here.",
  },
  {
    question: "How can I verify the APK myself before installing?",
    answer:
      "You can scan the downloaded APK with any antivirus app, or check the permissions it requests in Settings > Apps > Tangkhul Keyboard > Permissions after installing.",
  },
];

const TangkhulKeyboard = ({
  apkUrl,
  version,
  updatedAt,
}: TangkhulKeyboardManifest) => {
  const formattedUpdatedAt = updatedAt
    ? new Date(`${updatedAt}T00:00:00Z`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6 text-center flex flex-col items-center gap-6 m-auto">
          <Keyboard
            className="h-12 w-12 text-primary-foreground"
            aria-hidden="true"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
            Tangkhul Keyboard
          </h1>
          <p className="max-w-[700px] mx-auto md:text-xl text-primary-foreground">
            Download the Tangkhul Keyboard APK for Android — built for Tangkhul
            people, with dedicated keys for macron above (ā) and macron below (
            <MacronBelow>a</MacronBelow>), marks you won't find on any other
            available keyboard.
          </p>

          <a
            href={apkUrl}
            download
            className="inline-flex items-center gap-2 h-12 rounded-md bg-background text-foreground px-8 text-base font-medium shadow transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download Tangkhul Keyboard (APK)
          </a>

          <p className="text-sm font-medium text-primary-foreground">
            Free direct APK download for Android &middot; Not available on
            Google Play
          </p>

          {(version || formattedUpdatedAt) && (
            <p className="text-xs text-primary-foreground">
              {version && <>Version {version}</>}
              {version && formattedUpdatedAt && <> &middot; </>}
              {formattedUpdatedAt && <>Last updated {formattedUpdatedAt}</>}
            </p>
          )}
        </div>
      </section>

      {/* Why direct download + safety reassurance */}
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 m-auto max-w-[800px]">
          <div className="flex gap-4 rounded-lg border bg-muted p-6">
            <ShieldCheck
              className="h-8 w-8 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-xl font-bold">100% Safe to Install</h2>
              <p className="mt-2 text-muted-foreground">{faqs[0].answer}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto">
          <h2 className="text-3xl font-bold text-center">
            Tangkhul Keyboard Features
          </h2>
          <p className="mt-3 text-center text-muted-foreground max-w-[600px] mx-auto">
            Two dedicated keys designed specifically for typing correct Tangkhul
            spelling on Android.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-lg border bg-background p-6"
              >
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation steps */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 m-auto max-w-[800px]">
          <div className="flex items-center gap-3 justify-center">
            <Smartphone className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-center">
              How to Install Tangkhul Keyboard on Android
            </h2>
          </div>

          <ol className="mt-10 flex flex-col gap-6">
            {installSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="mt-1 text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto max-w-[800px]">
          <div className="flex items-center gap-3 justify-center">
            <HelpCircle className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-center">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border bg-background p-6"
              >
                <h3 className="font-bold text-lg">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-background p-6 mt-6">
            <CheckCircle2
              className="h-6 w-6 shrink-0 text-primary mt-0.5"
              aria-hidden="true"
            />
            <p className="text-muted-foreground">
              Still have questions?{" "}
              <a href="/contact" className="underline underline-offset-4">
                Contact us
              </a>{" "}
              and we'll help you get Tangkhul Keyboard set up.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TangkhulKeyboard;
