export type Illustration = "Sunshine" | "Rainbow" | "Cherries" | "Flower" | "Bunny" | "None";

export function StickerArt({
  kind,
  className = "sticker-art",
}: {
  kind: Illustration;
  className?: string;
}) {
  if (kind === "None") return null;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {kind === "Sunshine" && (
        <>
          <g className="art-sun" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="20" cy="20" r="11" />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M20 2v3" transform={`rotate(${i * 30} 20 20)`} />
            ))}
          </g>
          <g className="art-face">
            <path d="M15 18v1m10-1v1M15 23q5 6 10 0" />
          </g>
        </>
      )}
      {kind === "Rainbow" && (
        <g fill="none" strokeWidth="5" strokeLinecap="round">
          <path className="art-rainbow-outer" d="M5 32V21a15 15 0 0 1 30 0v11" />
          <path className="art-rainbow-middle" d="M10 32V21a10 10 0 0 1 20 0v11" />
          <path className="art-rainbow-inner" d="M15 32V21a5 5 0 0 1 10 0v11" />
        </g>
      )}
      {kind === "Cherries" && (
        <>
          <path className="art-leaf" d="M11 26Q12 9 24 6q-3 12 6 21M23 7Q14 1 11 7q6 6 12 0" />
          <circle className="art-petal" cx="11" cy="29" r="8" />
          <circle className="art-petal" cx="30" cy="30" r="8" />
        </>
      )}
      {kind === "Flower" && (
        <>
          <path className="art-leaf" d="M20 20v17m0-5q-10 0-9-8 9 0 9 8m0-2q10 0 10-7-10 0-10 7" />
          <g className="art-petal">
            {Array.from({ length: 5 }, (_, i) => (
              <ellipse key={i} cx="20" cy="9" rx="5" ry="7" transform={`rotate(${i * 72} 20 16)`} />
            ))}
          </g>
          <circle className="art-sun" cx="20" cy="16" r="5" />
        </>
      )}
      {kind === "Bunny" && (
        <>
          <ellipse className="art-fur" cx="14" cy="10" rx="3.5" ry="8" />
          <ellipse className="art-fur" cx="26" cy="10" rx="3.5" ry="8" />
          <circle className="art-fur" cx="20" cy="24" r="11" />
          <circle className="art-petal" cx="13.5" cy="27" r="2" />
          <circle className="art-petal" cx="26.5" cy="27" r="2" />
          <g className="art-face">
            <path d="M16 22v1m8-1v1M18 27q2 2 4 0" />
          </g>
        </>
      )}
    </svg>
  );
}

export function BrandFlower() {
  return (
    <svg className="brand-flower" viewBox="0 0 40 40" aria-hidden="true">
      <g fill="currentColor">
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx="20" cy="10" rx="7" ry="9" transform={`rotate(${i * 60} 20 20)`} />
        ))}
      </g>
      <circle className="art-face" cx="20" cy="20" r="6" />
      <path className="art-face" d="M17 21q3 3 6 0" />
    </svg>
  );
}
