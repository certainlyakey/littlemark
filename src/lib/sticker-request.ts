export type LabelType = "Iron-on" | "Stick-on";
export type RequestIllustration = "Sunshine" | "Rainbow" | "Cherries" | "Flower" | "Bunny";
export type RequestTone = "Mint" | "Peach" | "Butter" | "Lilac" | "Sky";
export type RequestFont = "Friendly" | "Simple" | "Handwritten";
export type RequestSize = "Small" | "Medium" | "Large";

export function labelTypeForRequest(request: string): LabelType {
  return /iron[ -]?on|cloth|jumper|shirt|baby|daycare/i.test(request) ? "Iron-on" : "Stick-on";
}

export interface ParsedRequest {
  type: LabelType;
  name?: string | undefined;
  illustration?: RequestIllustration | undefined;
  glow: boolean;
  tone?: RequestTone | undefined;
  font?: RequestFont | undefined;
  size?: RequestSize | undefined;
}

export function parseRequest(request: string): ParsedRequest {
  const r = request.toLowerCase();
  const pick = <T,>(pairs: [RegExp, T][]) => pairs.find(([re]) => re.test(r))?.[1];
  let name: string | undefined;
  const m = request.match(/name\s*(?:is|:|-)?\s*(?:for example|e\.g\.)?[\s,:]*([\p{Lu}][\p{L}'-]+(?:\s+[\p{Lu}][\p{L}'-]*\.?)?)/u);
  if (m?.[1]) {
    name = m[1].trim();
    const last = name.split(/\s+/).pop()!;
    if (last.length > 2 && name.endsWith(".")) name = name.slice(0, -1);
  }
  return {
    type: labelTypeForRequest(request),
    name,
    glow: /glow/.test(r),
    illustration: pick<RequestIllustration>([[/animal|bunny|rabbit|bear|cat|fox|puppy|dog/, "Bunny"], [/sun/, "Sunshine"], [/rainbow/, "Rainbow"], [/cherr|fruit/, "Cherries"], [/flower|floral/, "Flower"]]),
    tone: pick<RequestTone>([[/mint|green/, "Mint"], [/peach|pink|orange/, "Peach"], [/butter|yellow/, "Butter"], [/lilac|purple|violet/, "Lilac"], [/sky|blue/, "Sky"]]),
    font: pick<RequestFont>([[/handwrit|script/, "Handwritten"], [/simple|plain|clean/, "Simple"]]),
    size: pick<RequestSize>([[/small|tiny/, "Small"], [/large|big/, "Large"]]),
  };
}
