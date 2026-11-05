const TOKEN =
  /(?<string>"[^"\n]*")|(?<comment>\/\/[^"\n]*)|\b(?<keyword>const|await)\b/g;

const COLOR = {
  string: "text-emerald-700",
  comment: "text-[#98a1b5]",
  keyword: "text-[#2c37a4]",
};

/**
 * A short code sample in a marketing card, coloured by a few rules. The docs
 * highlight with Shiki, which is not worth loading for three sentences of code.
 */
export function CodeSample({ code }: { code: string }) {
  let end = 0;
  const parts = [...code.matchAll(TOKEN)].flatMap((match) => {
    const [kind] = Object.entries(match.groups!).find(([, text]) => text)!;
    const plain = code.slice(end, match.index);
    end = match.index + match[0].length;
    return [
      plain,
      <span key={match.index} className={COLOR[kind as keyof typeof COLOR]}>
        {match[0]}
      </span>,
    ];
  });
  return (
    <code>
      {parts}
      {code.slice(end)}
    </code>
  );
}
