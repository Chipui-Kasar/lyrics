import * as React from "react";
import { cn } from "@/lib/utils";

export interface YouTubePlayerProps {
  videoUrl: string; // Full YouTube URL (e.g., https://www.youtube.com/watch?v=abcd1234)
  className?: string; // Custom styles
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  className,
}) => {
  const videoId = React.useMemo(() => extractYouTubeId(videoUrl), [videoUrl]); // Extract video ID

  if (!videoId) {
    return <p className="text-red-500">❌ Invalid YouTube URL</p>;
  }

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <iframe
        className="w-full h-64 md:h-96 rounded-lg shadow-lg"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Function to extract YouTube Video ID from URL
const extractYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)|youtu.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

export { YouTubePlayer };
