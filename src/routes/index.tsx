import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowUp,
  Sparkles,
  Shirt,
  Backpack,
  Droplets,
  Flower2,
  Heart,
  Pencil,
  Tag,
  Baby,
  Snowflake,
  Plane,
  Users,
  GraduationCap,
  Tent,
} from "lucide-react";

const kits = [
  {
    name: "Daycare Bundle",
    description: "Clothing labels, bottle and bag labels",
    request: "Daycare bundle: iron-on clothing labels plus stick-on labels for bottles and bags",
    icon: Baby,
  },
  {
    name: "Kindergarten Kit",
    description: "Outdoor clothing, indoor shoes and personal belongings",
    request: "Kindergarten kit: labels for outdoor clothing, indoor shoes and personal belongings",
    icon: Backpack,
  },
  {
    name: "School Starter Kit",
    description: "Stationery, books, lunchboxes and sports gear",
    request:
      "School starter kit: stick-on labels for stationery, books, lunchboxes and sports gear",
    icon: GraduationCap,
  },
  {
    name: "Summer Camp Kit",
    description: "Clothing, shoes, water bottles and luggage",
    request: "Summer camp kit: labels for clothing, shoes, water bottles and luggage",
    icon: Tent,
  },
  {
    name: "Winter Adventure Kit",
    description: "Overalls, gloves, boots, hats and equipment",
    request: "Winter adventure kit: iron-on labels for overalls, gloves, boots, hats and equipment",
    icon: Snowflake,
  },
  {
    name: "Baby Kit",
    description: "Bottles, pacifiers, clothes and nursery belongings",
    request: "Baby kit: labels for bottles, pacifiers, clothes and nursery belongings",
    icon: Heart,
  },
  {
    name: "Travel Kit",
    description: "Backpacks, luggage, water bottles and accessories",
    request: "Travel kit: labels for backpacks, luggage, water bottles and accessories",
    icon: Plane,
  },
  {
    name: "Sibling Bundle",
    description: "Coordinated designs personalized for multiple children",
    request: "Sibling bundle: coordinated label designs personalized for multiple children",
    icon: Users,
  },
];
import { Button } from "@/components/ui/button";
import { ShopHeader, ShopFooter } from "@/components/shop-shell";
import productPhoto from "@/assets/labels-flatlay.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Littlemark — Personalized stickers for their little world" },
      {
        name: "description",
        content:
          "Personalized name stickers for kids’ clothes and accessories. Find their little labels and choose a name, color, font and illustration.",
      },
      { property: "og:title", content: "Littlemark — Little labels. Big personality." },
      {
        property: "og:description",
        content: "Make clothes and everyday essentials their own with personalized name stickers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [request, setRequest] = useState("");
  const navigate = useNavigate();
  function openDesigner(value: string) {
    navigate({
      to: "/design",
      search: { request: value.trim() || "Iron-on stickers for baby daycare clothes" },
    });
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    openDesigner(request);
  }
  return (
    <>
      <ShopHeader />
      <main className="fade-in">
        <section className="home-intro">
          <div className="eyebrow">
            <Flower2 size={14} /> LITTLE LABELS. BIG PERSONALITY.
          </div>
          <h1 className="home-title">
            Name stickers for
            <br />
            <span className="title-soft">their little world.</span>
          </h1>
          <p className="intro-copy">
            For the favorite jumper. The first daycare bag. The bottle that goes everywhere.
            <br className="hidden sm:block" /> A little label that’s a whole lot of them.
          </p>
          <form className="prompt-form" onSubmit={submit}>
            <label htmlFor="sticker-request" className="sr-only">
              What stickers would you like?
            </label>
            <textarea
              id="sticker-request"
              placeholder="Iron-on stickers with cute animals, glow in the dark, name Kristina K.…"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  openDesigner(request);
                }
              }}
            />
            <div className="prompt-bottom">
              <span className="prompt-decoration">
                <Sparkles size={13} /> What stickers would you like?
              </span>
              <Button
                type="submit"
                size="icon"
                className="prompt-submit"
                aria-label="Find my stickers"
              >
                <ArrowUp size={18} />
              </Button>
            </div>
          </form>
          <div className="suggestions">
            <Button
              variant="outline"
              className="suggestion"
              onClick={() => openDesigner("Iron-on labels for daycare clothes")}
            >
              <Shirt /> Daycare clothes
            </Button>
            <Button
              variant="outline"
              className="suggestion"
              onClick={() => openDesigner("Stick-on labels for water bottles and lunchboxes")}
            >
              <Droplets /> Bottles & lunchboxes
            </Button>
            <Button
              variant="outline"
              className="suggestion"
              onClick={() => openDesigner("Stick-on name labels for school essentials")}
            >
              <Backpack /> School essentials
            </Button>
          </div>
        </section>
        <section className="photo-section" aria-label="Personalized name stickers">
          <div className="photo-heading">
            <span>
              <Heart size={12} /> A little name. A lot of belonging.
            </span>
            <span>Clothes, bottles, bags & all their favorite things</span>
          </div>
          <img
            src={productPhoto}
            alt="Pastel personalized name stickers on a baby jumper, water bottle and sticker sheets"
            width={1536}
            height={768}
            className="product-photo"
          />
        </section>
        <section className="kits-section" aria-label="Kits and bundles">
          <div className="kits-heading">
            <span className="eyebrow">
              <Sparkles size={13} /> KITS & BUNDLES
            </span>
            <h2>A kit for every little adventure.</h2>
            <p>
              Pick a bundle and make it theirs — every kit opens in the designer, ready to
              personalize.
            </p>
          </div>
          <div className="kits-grid">
            {kits.map((kit) => (
              <button
                key={kit.name}
                type="button"
                className="kit-card"
                onClick={() => openDesigner(kit.request)}
              >
                <span className="kit-icon">
                  <kit.icon size={18} />
                </span>
                <span className="kit-name">{kit.name}</span>
                <span className="kit-description">{kit.description}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="everyday-notes" aria-label="Littlemark labels">
          <div className="everyday-note">
            <span className="note-icon bg-mint">
              <Pencil />
            </span>
            A name that makes it theirs
          </div>
          <div className="everyday-note">
            <span className="note-icon bg-butter">
              <Tag />
            </span>
            For clothes & everyday things
          </div>
          <div className="everyday-note">
            <span className="note-icon bg-peach">
              <Flower2 />
            </span>
            A little personality in every label
          </div>
        </section>
      </main>
      <ShopFooter />
    </>
  );
}
