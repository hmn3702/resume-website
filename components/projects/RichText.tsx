import { Fragment } from "react";

const BULLET = /^\s*[-*•]\s+/;

/**
 * Renders admin-entered plain text safely (no HTML):
 *  - a blank line starts a new paragraph
 *  - lines starting with "- ", "* " or "• " become a bulleted list
 *  - other single line breaks are kept
 */
export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);

  return (
    <div className="space-y-4">
      {blocks.flatMap((block, bi) => {
        const groups: { type: "ul" | "p"; lines: string[] }[] = [];
        for (const raw of block.split("\n")) {
          if (!raw.trim()) continue;
          const isBullet = BULLET.test(raw);
          const type = isBullet ? "ul" : "p";
          const line = isBullet ? raw.replace(BULLET, "") : raw.trim();
          const last = groups[groups.length - 1];
          if (last && last.type === type) last.lines.push(line);
          else groups.push({ type, lines: [line] });
        }

        return groups.map((g, gi) =>
          g.type === "ul" ? (
            <ul key={`${bi}-${gi}`} className="list-disc pl-5 space-y-1.5 marker:text-accent-500">
              {g.lines.map((l, li) => <li key={li}>{l}</li>)}
            </ul>
          ) : (
            <p key={`${bi}-${gi}`}>
              {g.lines.map((l, li) => (
                <Fragment key={li}>{li > 0 && <br />}{l}</Fragment>
              ))}
            </p>
          )
        );
      })}
    </div>
  );
}
