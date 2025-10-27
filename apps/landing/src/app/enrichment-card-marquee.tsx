import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Jack Hill",
    username: "@jack",
    body: "Account Executive at Vercel",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill Grant",
    username: "@jill",
    body: "GTM Lead at Klarna.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John Cutney",
    username: "@john",
    body: "VP of Growth at Google",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane Yu",
    username: "@jane",
    body: "Head of Design at Figma",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny Schoeder",
    username: "@jenny",
    body: "Partnership Manager at Vercel",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James Jones",
    username: "@james",
    body: "Leadership Coach at Udemy",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function EnrichmentCardMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div> */}
    </div>
  );
}
