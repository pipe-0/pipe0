import { AnnouncementBanner } from "@/components/features/announcements/announcement-banner";

export function BetaAnnouncementBanner() {
  return (
    <AnnouncementBanner
      content={
        <>
          <b className="hidden md:inline">📄 Introducing Sheets!</b>
          &nbsp;A clay alternative from the future.
        </>
      }
    />
  );
}
