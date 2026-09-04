import { authorAvatar, authorInitials } from "@/lib/authors";
import { cn } from "@/lib/utils";

/**
 * Round author avatar — the managed photo when we have one, otherwise the
 * author's initials on the muted disc. Decorative: the name is always
 * printed next to it, so the image carries no alt text.
 */
export function AuthorAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const src = authorAvatar(name);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className={cn(
          "size-7 shrink-0 rounded-full object-cover ring-1 ring-fd-foreground/10",
          className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full bg-fd-muted text-[10px] font-semibold text-fd-muted-foreground",
        className,
      )}
    >
      {authorInitials(name)}
    </span>
  );
}
