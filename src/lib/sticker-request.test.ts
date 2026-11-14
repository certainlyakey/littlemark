import { describe, expect, it } from "vitest";
import { labelTypeForRequest, parseRequest } from "./sticker-request";

describe("Sticker request selection", () => {
  it("opens iron-on labels for the requested baby daycare clothes example", () => {
    expect(labelTypeForRequest("iron on stickers for baby daycare clothes")).toBe("Iron-on");
  });
  it("opens stick-on labels for accessories", () => {
    expect(labelTypeForRequest("stickers for water bottles and lunchboxes")).toBe("Stick-on");
  });
  it("pre-fills name, animal art and glow from a full request", () => {
    const p = parseRequest(
      "iron on stickers cute animal illustrations and glow in the dark, child name for example  Kristina K.",
    );
    expect(p).toMatchObject({
      type: "Iron-on",
      name: "Kristina K.",
      illustration: "Bunny",
      glow: true,
    });
  });
  it("leaves glow off when not asked", () => {
    expect(parseRequest("stickers for bottles").glow).toBe(false);
  });
});
