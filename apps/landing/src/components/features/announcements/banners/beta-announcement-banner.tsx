import { AnnouncementBanner } from "@/components/features/announcements/announcement-banner";

export function BetaAnnouncementBanner() {
  return (
    <AnnouncementBanner
      content={
        <>
          🎉<b className="hidden md:inline">v0.5 is live.</b>&nbsp;The official
          beta is here!
        </>
      }
    />
  );
}
