"use client";

import { LogoSmall } from "@/components/logo";
import { Loader, Pause, Play, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

// Utility function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function HeaderVideoSection({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoId = getYouTubeVideoId(videoUrl);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const handlePlay = useCallback(async () => {
    if (!videoId) return;

    setIsLoading(true);
    setIsExpanded(true);

    // Wait for the container to expand
    setTimeout(() => {
      setIsPlaying(true);
      setIsLoading(false);
    }, 300); // Match this with your CSS transition duration
  }, [videoId]);

  // Construct YouTube embed URL with parameters
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${
        typeof window !== "undefined" ? window.location.origin : ""
      }&autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`
    : "";

  return (
    <div>
      <hr className="mb-5" />

      <div
        ref={containerRef}
        className={`overflow-hidden relative transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[600px]" : "h-[200px]"
        }`}
      >
        <div className="rounded-3xl border-2 border-input bg-background h-[600px] relative">
          {/* YouTube iframe - only render when playing */}
          {isPlaying && embedUrl && (
            <iframe
              ref={videoRef}
              src={embedUrl}
              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            />
          )}
        </div>

        <div className="absolute right-2 top-2 flex items-center gap-3 z-10">
          {!isPlaying && (
            <>
              <span className="text-muted-foreground">Explained on</span>
              <div className="flex gap-1 items-center">
                <img
                  src="https://img.freepik.com/vektoren-premium/rundes-youtube-logo-auf-weissem-hintergrund-isoliert_469489-983.jpg?semt=ais_hybrid&w=740&q=80"
                  className="inline-block size-8"
                  alt="YouTube logo"
                />
                <X className="size-6 text-muted-foreground" />
                <LogoSmall />
              </div>
            </>
          )}
        </div>

        {/* Play/Pause button - only show when not playing or when paused */}
        {!isPlaying && (
          <button
            disabled={isLoading || !videoId}
            onClick={handlePlay}
            className="group w-40 h-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full shadow-xl grid place-items-center transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed [&>svg]:fill-border z-10"
            aria-label="Play video"
          >
            {isLoading ? (
              <div className="size-20 border-2 border-accent/30 border-t-accent rounded-full animate-spin">
                <Loader className="size-20 stroke-border" />
              </div>
            ) : (
              <Play
                className="size-20 stroke-border transition-all duration-200 translate-x-1"
                strokeWidth={0.5}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
