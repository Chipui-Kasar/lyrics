import { Button } from "@/components/ui/button";
import Link from "next/link";

const Lyrics = ({
  params,
}: {
  params: { artists: string; songTitle: string };
}) => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <main className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1fr_300px] md:gap-12 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              Lyrics
            </div>
            <h1 className="text-3xl font-bold">{params.songTitle}</h1>
            <div className="text-muted-foreground">{params.artists}</div>
          </div>
          <div className="flex w-full items-start gap-6">
            <img
              src="/placeholder.svg"
              width="200"
              height="200"
              alt="Album Cover"
              className="aspect-square overflow-hidden rounded-lg object-cover"
            />
            <div className="prose text-muted-foreground">
              <p>
                Is this the real life? Is this just fantasy? Caught in the
                landslide, no escape from reality. Open your eyes, look up to
                the skies and see, I'm just a poor boy, I need no sympathy.
              </p>
              <p>
                Because I'm easy come, easy go, a little high, little low.
                Anyway the wind blows, nothing really matters to me.
              </p>
              <p>
                Mama, just killed a man, put a gun against his head, pulled my
                trigger, now he's dead.
              </p>
              <p>
                Mama, life had just begun, but now I've gone and thrown it all
                away.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Song Details
              </div>
              <Button variant="ghost" size="icon">
                <ShareIcon className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Artist:</span>
                <span>Queen</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Album:</span>
                <span>A Night at the Opera</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Release Date:</span>
                <span>31 October 1975</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duration:</span>
                <span>5:55</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Genre:</span>
                <span>Rock</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="#"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Stream on Spotify
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Lyrics;

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
