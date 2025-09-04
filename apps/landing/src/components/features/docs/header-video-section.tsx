"use client";

import { LogoSmall } from "@/components/logo";
import { Pause, Play, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export function HeaderVideoSection({
  videoUrl,
  placeholder,
}: {
  videoUrl: string;
  placeholder: ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div>
      <hr className="mb-5" />

      <div className="h-[200px] overflow-hidden relative">
        <div className="rounded-3xl border-2 border-input bg-background h-[600px]"></div>

        <div className="absolute right-2 top-2 flex items-center gap-3">
          <span className="text-muted-foreground">Explained on</span>

          <div className="flex gap-1 items-center">
            <img
              src="https://img.freepik.com/vektoren-premium/rundes-youtube-logo-auf-weissem-hintergrund-isoliert_469489-983.jpg?semt=ais_hybrid&w=740&q=80"
              className="inline-block size-8"
            />
            <X className="size-6 text-muted-foreground" />
            <LogoSmall />
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={() => setIsPlaying(true)}
          className="group w-40 h-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full shadow-xl grid place-items-center transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed [&>svg]:fill-border"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isLoading ? (
            <div className="size-20 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause
              className="size-20  stroke-border transition-all duration-200"
              strokeWidth={0.5}
            />
          ) : (
            <Play
              className="size-20 stroke-border transition-all duration-200 translate-x-1"
              strokeWidth={0.5}
            />
          )}
        </button>
      </div>
    </div>
  );
}
