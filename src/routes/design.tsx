import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader, ShopFooter } from "@/components/shop-shell";
import { StickerArt, type Illustration } from "@/components/sticker-art";
import { parseRequest, type LabelType } from "@/lib/sticker-request";
import productPhoto from "@/assets/labels-flatlay.jpg";

export const Route = createFileRoute("/design")({
  validateSearch: (search: Record<string, unknown>) => ({
    request: typeof search["request"] === "string" ? search["request"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Design your name stickers — Littlemark" },
      {
        name: "description",
        content:
          "Create your child’s personalized label with colors, sizes, playful illustrations and their very own name.",
      },
      { property: "og:title", content: "Make it theirs — Littlemark sticker designer" },
      {
        property: "og:description",
        content:
          "Personalize name stickers for clothes and accessories. Pick a color, a font and a little personality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Designer,
});

const tones = ["Mint", "Peach", "Butter", "Lilac", "Sky"] as const;
const illustrations: Illustration[] = [
  "Sunshine",
  "Rainbow",
  "Cherries",
  "Flower",
  "Bunny",
  "None",
];
const fonts = ["Friendly", "Simple", "Handwritten"] as const;
const sizes = ["Small", "Medium", "Large"] as const;

function Designer() {
  const { request } = Route.useSearch();
  const p = parseRequest(request);
  const [name, setName] = useState(p.name ?? "");
  const [type, setType] = useState<LabelType>(p.type);
  const [tone, setTone] = useState<(typeof tones)[number]>(p.tone ?? "Mint");
  const [size, setSize] = useState<(typeof sizes)[number]>(p.size ?? "Medium");
  const [shape, setShape] = useState("Rounded");
  const [font, setFont] = useState<(typeof fonts)[number]>(p.font ?? "Friendly");
  const [art, setArt] = useState<Illustration>(p.illustration ?? "Sunshine");
  const [glow, setGlow] = useState(p.glow);
  const [quantity, setQuantity] = useState("");
  const displayName = name.trim() || "Your name";
  function reset() {
    setName(p.name ?? "");
    setType(p.type);
    setTone(p.tone ?? "Mint");
    setSize(p.size ?? "Medium");
    setShape("Rounded");
    setFont(p.font ?? "Friendly");
    setArt(p.illustration ?? "Sunshine");
    setGlow(p.glow);
    setQuantity("");
  }
  return (
    <>
      <ShopHeader />
      <main className="designer-page fade-in">
        <Link to="/" className="back-link">
          <ArrowLeft size={13} /> Back to your little world
        </Link>
        <div className="designer-heading">
          <h1>
            Make it <span className="title-soft">theirs.</span>
          </h1>
          <p>
            {request
              ? `A little something for: ${request.slice(0, 180)}`
              : "A name, a color, a little personality. A label that’s all them."}
          </p>
        </div>
        <div className="designer-grid">
          <div>
            <div className="preview-panel">
              <span className="preview-eyebrow">THEIR LITTLE LABELS</span>
              <div className="label-sheet" aria-label="Live sticker preview">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`sticker tone-${tone.toLowerCase()} sticker-${size.toLowerCase()} ${shape === "Pill" ? "sticker-round" : shape === "Square" ? "sticker-square" : ""} ${glow ? "sticker-glow" : ""}`}
                  >
                    <StickerArt kind={art} />
                    <span
                      className={`sticker-name font-${font.toLowerCase()} ${displayName.length > 22 ? "very-long-name" : displayName.length > 12 ? "long-name" : ""}`}
                    >
                      {displayName}
                    </span>
                  </div>
                ))}
              </div>
              <span className="preview-caption">
                {type} labels · {size}
                {glow ? " · Glow in the dark" : ""} · A little bit of {name.trim() || "them"}
              </span>
            </div>
            <img
              src={productPhoto}
              width={1536}
              height={768}
              loading="lazy"
              className="preview-photo"
              alt="Personalized labels on kids’ clothing and a bottle"
            />
          </div>
          <div className="designer-controls">
            <fieldset className="control-group">
              <legend className="control-title">01 · Label type</legend>
              <div className="option-row">
                {(["Iron-on", "Stick-on"] as const).map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="option-button"
                    data-selected={type === option}
                    aria-pressed={type === option}
                    onClick={() => setType(option)}
                  >
                    {option}{" "}
                    <span className="text-muted-foreground">
                      {option === "Iron-on" ? "· Clothes" : "· Accessories"}
                    </span>
                  </Button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="child-name" className="control-title">
                02 · Their name
              </label>
              <input
                id="child-name"
                className="text-input"
                placeholder="e.g. Oliver"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <fieldset className="control-group">
              <legend className="control-title">
                03 · Color <span>{tone}</span>
              </legend>
              <div className="option-row">
                {tones.map((option) => (
                  <Button
                    key={option}
                    variant="ghost"
                    className={`swatch tone-${option.toLowerCase()}`}
                    aria-label={option}
                    title={option}
                    aria-pressed={tone === option}
                    onClick={() => setTone(option)}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset className="control-group">
              <legend className="control-title">04 · Shape & size</legend>
              <div className="option-row">
                {["Rounded", "Pill", "Square"].map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="option-button"
                    data-selected={shape === option}
                    aria-pressed={shape === option}
                    onClick={() => setShape(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="option-row mt-2">
                {sizes.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="option-button"
                    data-selected={size === option}
                    aria-pressed={size === option}
                    onClick={() => setSize(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </fieldset>
            <fieldset className="control-group">
              <legend className="control-title">05 · Font style</legend>
              <div className="option-row">
                {fonts.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className={`option-button font-${option.toLowerCase()}`}
                    data-selected={font === option}
                    aria-pressed={font === option}
                    onClick={() => setFont(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </fieldset>
            <fieldset className="control-group">
              <legend className="control-title">
                06 · A little illustration <span>{art}</span>
              </legend>
              <div className="option-row">
                {illustrations.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="illustration-button"
                    title={option}
                    aria-label={option}
                    aria-pressed={art === option}
                    onClick={() => setArt(option)}
                  >
                    {option === "None" ? <Minus /> : <StickerArt kind={option} />}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-center ml-auto"
                  aria-label="Reset design"
                  title="Reset design"
                  onClick={reset}
                >
                  <RotateCcw />
                </Button>
              </div>
            </fieldset>
            <fieldset className="control-group">
              <legend className="control-title">07 · Finish</legend>
              <div className="option-row">
                {[false, true].map((option) => (
                  <Button
                    key={String(option)}
                    variant="outline"
                    className="option-button"
                    data-selected={glow === option}
                    aria-pressed={glow === option}
                    onClick={() => setGlow(option)}
                  >
                    {option ? "Glow in the dark" : "Classic"}
                  </Button>
                ))}
              </div>
            </fieldset>
            <div className="control-group">
              <label htmlFor="sticker-quantity" className="control-title">
                08 · Quantity of stickers
              </label>
              <input
                id="sticker-quantity"
                type="number"
                inputMode="numeric"
                className="text-input"
                placeholder="Number of stickers"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="order-price">
              <span>Price</span>
              <span className="text-muted-foreground">Not available yet</span>
            </div>
            <Button className="buy-button" disabled>
              <ShoppingBag /> Buy stickers
            </Button>
            <p className="purchase-note">
              No products found · Pack quantities and prices are coming soon.
            </p>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
