"use client";

import { cn } from "@/lib/utils";

interface Item {
  name: string;
  description: string;
  icon: string;
  provider: string;
}

let notifications = [
  {
    name: "Find work email",
    description: "Waterfall enrichments",
    provider: "Leadmagic, Prospeo, Findymail",
    icon: "📧",
  },
  {
    name: "Verify email",
    description: "Additional checks",
    provider: "NeverBounce",
    icon: "✅",
  },
  {
    name: "Find company description",
    description: "Organisational data",
    provider: "Leadmagic",
    icon: "💬",
  },
  {
    name: "Technology stack",
    description: "Technolgraphics",
    provider: "BuiltWith",
    icon: "🤖",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, provider }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-accent border">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{provider}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function EnrichmentAnimatedList({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </div>
    </div>
  );
}
