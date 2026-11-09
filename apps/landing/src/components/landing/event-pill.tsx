import { ArrowRight } from "lucide-react";

/* A small link above the hero headline that promotes one upcoming live
   event. It hides itself once the event has ended, so a stale date never
   stays on the homepage. To promote the next event, edit `EVENT`: the
   calendar icon draws its month and day from `startsAt`. */

const EVENT = {
  /* The Luma event page. The pill stays hidden while this is empty. */
  url: "https://luma.com/zh6nerls",
  kind: "Workshop",
  title: "Agentic GTM for PLG Companies",
  /* Luma's start_at and end_at. */
  startsAt: "2026-11-19T17:00:00Z",
  endsAt: "2026-11-19T18:00:00Z",
  /* The calendar shows the date as it falls here (Luma's event timezone),
     the same on the server and in every visitor's browser. */
  timeZone: "Europe/Zurich",
};

export function EventPill() {
  if (!EVENT.url || Date.now() >= Date.parse(EVENT.endsAt)) return null;

  const start = new Date(EVENT.startsAt);
  const month = start.toLocaleString("en-US", {
    month: "short",
    timeZone: EVENT.timeZone,
  });
  const day = start.toLocaleString("en-US", {
    day: "numeric",
    timeZone: EVENT.timeZone,
  });

  /* Luma reports UTM parameters per registration, so homepage sign-ups
     can be told apart from other sources. */
  const href = `${EVENT.url}?utm_source=pipe0&utm_medium=homepage&utm_campaign=hero-pill`;

  /* Reads left to right: when (the calendar), what, go. The whole pill is
     the link; the round button only gives the click a visible target.
     The button sets the pill's height and sits 4px in from the top, right
     and bottom, so its circle is concentric with the pill's round end.
     Everything else is kept at most 32px tall so it never stretches the
     pill: on phones the title wraps onto two 16px lines. */
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[var(--rule)] bg-background p-1 pl-2.5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_14px_-4px_rgba(59,73,224,0.18)] transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_-6px_rgba(59,73,224,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <CalendarIcon month={month} day={day} />
      <span className="min-w-0 text-[14px] leading-4 text-foreground/80 max-sm:text-[13px] sm:whitespace-nowrap">
        <span className="sr-only">
          {month} {day}.{" "}
        </span>
        <span className="font-semibold text-foreground">{EVENT.kind}:</span>{" "}
        {EVENT.title}
      </span>
      {/* The site's secondary button skin (.btn-glossy-outline), round. */}
      <span
        aria-hidden
        className="btn-glossy-outline grid size-8 shrink-0 place-items-center rounded-full border text-foreground transition-[background,border-color] group-hover:border-[rgba(14,17,23,0.34)] group-hover:bg-white"
      >
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-px motion-reduce:transition-none"
          strokeWidth={2}
        />
      </span>
    </a>
  );
}

/* A small desk calendar in CSS: a glossy brand-blue band with the month,
   a white page with the day, two steel rings on top. Gradients and inset
   edges give it the same raised, slightly 3D feel as the site's buttons. */
function CalendarIcon({ month, day }: { month: string; day: string }) {
  return (
    <span
      aria-hidden
      className="relative mt-[2px] block w-[26px] shrink-0 transition-transform duration-200 group-hover:-rotate-6 motion-reduce:transition-none"
    >
      <span className="block overflow-hidden rounded-[6px] border border-[rgba(14,17,23,0.14)] shadow-[0_1px_1px_rgba(14,17,23,0.06),0_3px_6px_-2px_rgba(14,17,23,0.22)]">
        <span className="block bg-[linear-gradient(180deg,#6c75f2_0%,#3b49e0_55%,#2c37c6_100%)] py-px text-center text-[9.5px] font-semibold leading-[12px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          {month}
        </span>
        <span className="block bg-[linear-gradient(180deg,#ffffff_0%,#f1f2f7_100%)] pb-px text-center text-[12px] font-semibold leading-[13px] tracking-[-0.02em] text-foreground tabular-nums shadow-[inset_0_-1.5px_0_rgba(14,17,23,0.06)]">
          {day}
        </span>
      </span>
      {[6, 17].map((left) => (
        <span
          key={left}
          className="absolute -top-[2px] h-[5px] w-[3px] rounded-full bg-[linear-gradient(90deg,#9aa0ad_0%,#eef0f4_50%,#9aa0ad_100%)] shadow-[0_0_0_0.5px_rgba(14,17,23,0.25)]"
          style={{ left }}
        />
      ))}
    </span>
  );
}
