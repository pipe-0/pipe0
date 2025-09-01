"use client";
import { CodeBlock } from "@/components/ui/code-block";
import { appInfo } from "@/lib/const";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CodeExampleCardProps {
  className?: string;
}

export default function CodeExampleCard({}: CodeExampleCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className="w-full mx-auto px-3 lg:px-8 py-0 lg:py-12 overflow-hidden relative">
      <CodeBlock
        language="typescript"
        code={`// Find work email and company description
const response = await pipe0.request.create({
    pipes: [
      {
        name: "people:workemail:waterfall@1"
      },
      {
        name: "company:description@1"
      }
    ],
    input: [
      {
        id: 1,
        name: "John Doe",
        company_name: "Pipe0"
      }
    ],
  });
              `}
      />
      <button
        onClick={togglePlayback}
        disabled={isLoading}
        className="group w-40 h-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full shadow-xl grid place-items-center transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed [&>svg]:fill-border"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
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

      <audio
        ref={audioRef}
        src={appInfo.audio.intro}
        preload="metadata"
        className="sr-only"
      />
    </div>
  );
}
