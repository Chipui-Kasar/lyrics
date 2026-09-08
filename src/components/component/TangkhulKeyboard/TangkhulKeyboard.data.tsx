import type { ReactNode } from "react";

export interface TangkhulKeyboardManifest {
  apkUrl: string;
  version: string;
  updatedAt: string;
}

// The Unicode combining macron-below mark (U+0331) is positioned incorrectly
// by most system fonts — it's a rare diacritic most font shaping tables don't
// account for. Drawing it as a CSS underline renders it consistently instead.
export const MacronBelow = ({ children }: { children: string }) => (
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

export const iosFaqs = [
  {
    question: "Is Tangkhul Keyboard available for iOS?",
    answer:
      "Not yet. iOS only allows custom keyboards to be installed through the App Store, so we're preparing a proper App Store release instead of a sideloaded install. Check back on this page or contact us to be notified when it launches.",
  },
  {
    question: "When will Tangkhul Keyboard launch on iOS?",
    answer:
      "There's no fixed release date yet. Android is the current focus — once that's stable, the same macron above and macron below keys will come to iPhone and iPad through the App Store.",
  },
];
