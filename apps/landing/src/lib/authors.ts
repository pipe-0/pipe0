/**
 * Blog authors we manage. Frontmatter names an author by `name`; a match
 * here supplies the avatar. Anyone not listed falls back to a lettered
 * avatar, so a guest post never needs an entry to render.
 */
const AUTHORS: { name: string; avatar: string }[] = [
  {
    name: "Florian",
    avatar:
      "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/9a5da7c5-b8e7-44fb-5070-f2b1c8842e00/catalogpreview",
  },
];

/** Avatar URL for a managed author, or undefined for anyone else. */
export function authorAvatar(name: string): string | undefined {
  const key = name.trim().toLowerCase();
  return AUTHORS.find((a) => a.name.toLowerCase() === key)?.avatar;
}

/** "Florian Martens" → "FM"; the lettered fallback. */
export function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
