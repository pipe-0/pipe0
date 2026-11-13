import { ArrowRight } from "lucide-react";

/* A small link above the hero headline that promotes one upcoming live
   event. It hides itself once the event has ended, so a stale date never
   stays on the homepage. To promote the next event, edit `EVENT`: the
   circled date is drawn from `startsAt`.

   It used to be a pill with a calendar icon and a round button in it, which
   is where the name comes from (and the UTM campaign, kept so registrations
   stay comparable). Now it is one line with nothing around it: the date,
   circled the way you would circle it on a wall calendar, then what the
   event is, then an arrow. */

const EVENT = {
  /* The Luma event page. The link stays hidden while this is empty. */
  url: "https://luma.com/zh6nerls",
  kind: "Workshop",
  title: "Agentic GTM for PLG Companies",
  /* Luma's start_at and end_at. */
  startsAt: "2026-11-19T17:00:00Z",
  endsAt: "2026-11-19T18:00:00Z",
  /* The date is shown as it falls here (Luma's event timezone), the same
     on the server and in every visitor's browser. */
  timeZone: "Europe/Zurich",
};

/* The crayon: the coral of the illustrations. */
const CRAYON = "#f0593f";

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

  /* Reads left to right: when, what, go. The whole line is the link. */
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group mb-7 inline-flex max-w-full items-center gap-3 rounded-[8px] text-left text-[14px] leading-5 text-foreground/75 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      <span className="relative grid h-[38px] w-[74px] shrink-0 place-items-center text-[14px] font-semibold tracking-[-0.01em] text-foreground">
        {month} {day}
        <CrayonCircle />
      </span>
      <span className="min-w-0 sm:whitespace-nowrap">
        <span className="font-semibold text-foreground">{EVENT.kind}:</span>{" "}
        {EVENT.title}
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 shrink-0 text-foreground/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        strokeWidth={2}
      />
    </a>
  );
}

/* A ring drawn by hand: it starts at the top left, goes once around, and
   runs on past its own start, the way a quick circle does. The filter
   roughens the line's edge and knocks small specks out of it, which is what
   makes it read as wax crayon rather than as a vector stroke. Drawn at its
   own size, never stretched: stretching would smear the grain. */
function CrayonCircle() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 74 38"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <defs>
        <filter
          id="event-crayon"
          filterUnits="userSpaceOnUse"
          x="-6"
          y="-6"
          width="86"
          height="50"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="4"
            result="wobble"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wobble"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="line"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.7"
            numOctaves="1"
            seed="11"
            result="grain"
          />
          {/* Alpha from the noise: mostly solid, with specks let through. */}
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -0.75"
            result="specks"
          />
          <feComposite in="line" in2="specks" operator="in" />
        </filter>
      </defs>
      <path
        d="M14 8.5C26 1.8 52 0.6 64 7.2c9.4 5 9.6 18-0.8 23.8C50 38.2 22 38 9 31 0.4 26 1 13 12.4 7.4 22.5 2.6 40 2 56 5.4"
        fill="none"
        stroke={CRAYON}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#event-crayon)"
      />
    </svg>
  );
}
