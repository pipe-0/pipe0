import { AnnouncementBanner } from "@/components/features/announcements/announcement-banner";

export function BetaAnnouncementBanner() {
  return (
    <AnnouncementBanner
      content={
        <>
          <b className="md:inline">🎉 Introducing Sheets!</b>
          <span className="md:hidden">&nbsp;Infinite data tables.</span>
          <span className="hidden md:inline">
            &nbsp;A Clay alternative from the future.
          </span>
        </>
      }
    />
  );
}
