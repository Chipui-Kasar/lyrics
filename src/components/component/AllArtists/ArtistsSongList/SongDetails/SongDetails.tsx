/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SongDetails({
  params,
}: {
  params: { artists: string; songTitle: string };
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 py-12">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-[1fr_300px] md:gap-12 md:px-6">
          <div className="flex flex-col items-center justify-center">
            <img
              src="/placeholder.svg"
              width={400}
              height={400}
              alt="Album Cover"
              className="mb-6 rounded-lg shadow-lg"
            />
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{params.songTitle}</h1>
              <p className="text-muted-foreground">{params.artists}</p>
              <p className="text-muted-foreground">
                {params.artists} IV (1971)
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <Button variant="outline">
                <ShareIcon className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Link
                href={`/artists/${params.artists}/lyrics/${params.songTitle}`}
              >
                <Button>View Lyrics</Button>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-medium">Details</h2>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Release Year:</div>
                <div>1971</div>
                <div>Genre:</div>
                <div>Rock</div>
                <div>Songwriter:</div>
                <div>Robert Plant, Jimmy Page</div>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-medium">About</h2>
              <p
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: ` "Stairway to Heaven" is a song by the English rock band Led
                Zeppelin, released in 1971. It is widely regarded as one of the
                greatest rock songs of all time, known for its complex structure
                and Robert Plant's poetic lyrics.`,
                }}
              ></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
