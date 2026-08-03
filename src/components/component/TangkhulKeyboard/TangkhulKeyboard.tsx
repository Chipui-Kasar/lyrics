"use client";

import { useState } from "react";
import {
  Download,
  ShieldCheck,
  Keyboard,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  MacronBelow,
  features,
  installSteps,
  faqs,
  iosFaqs,
  type TangkhulKeyboardManifest,
} from "./TangkhulKeyboard.data";

type Platform = "android" | "ios";

const TangkhulKeyboard = ({
  apkUrl,
  version,
  updatedAt,
}: TangkhulKeyboardManifest) => {
  const [platform, setPlatform] = useState<Platform>("android");
  const isAndroid = platform === "android";

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

          <div
            role="group"
            aria-label="Choose platform"
            className="inline-flex rounded-lg bg-background/20 p-1"
          >
            <button
              type="button"
              onClick={() => setPlatform("android")}
              aria-pressed={isAndroid}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                isAndroid
                  ? "bg-background text-foreground shadow"
                  : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              Android
            </button>
            <button
              type="button"
              onClick={() => setPlatform("ios")}
              aria-pressed={!isAndroid}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAndroid
                  ? "bg-background text-foreground shadow"
                  : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              iOS
            </button>
          </div>

          {isAndroid ? (
            <>
              <p className="max-w-[700px] mx-auto md:text-xl text-primary-foreground">
                Download the Tangkhul Keyboard APK for Android — built for
                Tangkhul people, with dedicated keys for macron above (ā) and
                macron below (<MacronBelow>a</MacronBelow>), marks you won't
                find on any other available keyboard.
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
            </>
          ) : (
            <>
              <p className="max-w-[700px] mx-auto md:text-xl text-primary-foreground">
                Tangkhul Keyboard for iOS is coming soon — built for Tangkhul
                people, with dedicated keys for macron above (ā) and macron
                below (<MacronBelow>a</MacronBelow>), marks you won't find on
                any other available keyboard.
              </p>

              <div className="inline-flex items-center gap-2 h-12 rounded-md bg-background/50 text-foreground/70 px-8 text-base font-medium cursor-not-allowed">
                <Clock className="h-5 w-5" aria-hidden="true" />
                Coming Soon on iOS
              </div>

              <p className="text-sm font-medium text-primary-foreground">
                In development &middot; Will launch on the App Store
              </p>
            </>
          )}
        </div>
      </section>

      {/* Why direct download + safety reassurance */}
      {isAndroid && (
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
      )}

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto">
          <h2 className="text-3xl font-bold text-center">
            Tangkhul Keyboard Features
          </h2>
          <p className="mt-3 text-center text-muted-foreground max-w-[600px] mx-auto">
            Two dedicated keys designed specifically for typing correct
            Tangkhul spelling
            {isAndroid ? " on Android." : " — coming soon on iOS."}
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

      {/* Installation steps / iOS status */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 m-auto max-w-[800px]">
          <div className="flex items-center gap-3 justify-center">
            {isAndroid ? (
              <Smartphone className="h-8 w-8 text-primary" aria-hidden="true" />
            ) : (
              <Clock className="h-8 w-8 text-primary" aria-hidden="true" />
            )}
            <h2 className="text-3xl font-bold text-center">
              {isAndroid
                ? "How to Install Tangkhul Keyboard on Android"
                : "Tangkhul Keyboard for iOS is Coming Soon"}
            </h2>
          </div>

          {isAndroid ? (
            <ol className="mt-10 flex flex-col gap-6">
              {installSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-10 rounded-lg border bg-muted p-8 text-center">
              <p className="text-muted-foreground">
                We're working on bringing Tangkhul Keyboard to iPhone and iPad
                through the App Store. There's no install flow yet —{" "}
                <a href="/contact" className="underline underline-offset-4">
                  contact us
                </a>{" "}
                to be notified as soon as it launches.
              </p>
            </div>
          )}
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
            {(isAndroid ? faqs : iosFaqs).map((faq) => (
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
