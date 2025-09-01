import { ReactNode } from "react";

export function AnnouncementBanner({ content }: { content: ReactNode }) {
  return (
    <div className="h-10 bg-secondary text-foreground border-b flex justify-center items-center">
      {content}
    </div>
  );
}
