import { test, expect } from "./fixtures";

const request = "Iron-on labels with a bunny, glow in the dark, sky blue, small, name Élodie K.";
const query = new URLSearchParams({ request }).toString();

test("home loads its styles, photo, favicon, and base-aware navigation", async ({
  page,
  baseURL,
}) => {
  const response = await page.goto("./");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Name stickers");
  await expect(page).toHaveTitle(/Littlemark/);
  await expect(page.locator(".site-header")).toHaveCSS("display", "flex");
  const photo = page.getByAltText(/Pastel personalized name stickers/);
  await expect(photo).toBeVisible();
  await expect
    .poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: "Littlemark home" })).toHaveAttribute(
    "href",
    new URL(baseURL!).pathname,
  );

  const iconURL = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(iconURL).toBe(`${new URL(baseURL!).pathname}favicon.ico`);
  const icon = await page.request.get(iconURL!);
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/x-icon");
});

test("prompt submission opens the designer with validated URL state", async ({ page, baseURL }) => {
  await page.goto("./");
  await page.getByRole("textbox", { name: "What stickers would you like?" }).fill(request);
  await page.getByRole("button", { name: "Find my stickers" }).click();

  await expect(page).toHaveURL(
    (url) =>
      url.pathname.replace(/\/$/, "") === `${new URL(baseURL!).pathname}design` &&
      url.searchParams.get("request") === request,
  );
  await expect(page.getByLabel("02 · Their name")).toHaveValue("Élodie K.");
  await expect(page.getByRole("button", { name: /^Iron-on/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Bunny", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Glow in the dark", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Sky", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Small", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Buy stickers" })).toBeDisabled();
});

for (const path of ["design", "design/"]) {
  test(`direct ${path} link and reload preserve the request`, async ({ page, baseURL }) => {
    if (path === "design") {
      const redirect = await page.request.get(`${path}?${query}`, { maxRedirects: 0 });
      expect(redirect.status()).toBe(301);
      expect(redirect.headers()["location"]).toBe(`${new URL(baseURL!).pathname}design/?${query}`);
    }
    const response = await page.goto(`${path}?${query}`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(
      (url) =>
        url.pathname.replace(/\/$/, "") === `${new URL(baseURL!).pathname}design` &&
        url.searchParams.get("request") === request,
    );
    await expect(page.getByLabel("02 · Their name")).toHaveValue("Élodie K.");
    await expect(page.locator(".sticker-name")).toHaveText(Array(4).fill("Élodie K."));

    const reloaded = await page.reload();
    expect(reloaded?.status()).toBe(200);
    await expect(page.getByLabel("02 · Their name")).toHaveValue("Élodie K.");
    await expect(
      page.getByRole("button", { name: "Glow in the dark", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });
}

test("customization updates the preview and reset restores the requested design", async ({
  page,
}) => {
  await page.goto(`design/?${query}`);
  await page.getByLabel("02 · Their name").fill("Ada");
  for (const name of ["Lilac", "Pill", "Large", "Handwritten", "Cherries", "Classic"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByRole("button", { name, exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
  await page.getByLabel("08 · Quantity of stickers").fill("48");
  await expect(page.locator(".sticker-name")).toHaveText(Array(4).fill("Ada"));
  await expect(page.locator(".label-sheet .sticker").first()).toHaveClass(/tone-lilac/);
  await expect(page.locator(".label-sheet .sticker").first()).toHaveClass(/sticker-round/);
  await expect(page.locator(".preview-caption")).toContainText("Large");
  await expect(page.getByRole("button", { name: "Buy stickers" })).toBeDisabled();

  await page.getByRole("button", { name: "Reset design" }).click();
  await expect(page.getByLabel("02 · Their name")).toHaveValue("Élodie K.");
  await expect(page.getByLabel("08 · Quantity of stickers")).toHaveValue("");
  for (const name of ["Sky", "Rounded", "Small", "Friendly", "Bunny", "Glow in the dark"]) {
    await expect(page.getByRole("button", { name, exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
});

test("missing and non-string request values fall back to a usable default design", async ({
  page,
}) => {
  for (const search of [
    "",
    "?request=123",
    "?request=true",
    "?request=%7B%22name%22%3A%22Ada%22%7D",
  ]) {
    await page.goto(`design/${search}`);
    await expect(page.getByLabel("02 · Their name")).toHaveValue("");
    await expect(page.locator(".sticker-name")).toHaveText(Array(4).fill("Your name"));
    await expect(page.getByRole("button", { name: /^Stick-on/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("button", { name: "Buy stickers" })).toBeDisabled();
  }
});

test("home links and browser history remain inside the deployment prefix", async ({
  page,
  baseURL,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Daycare clothes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make it");
  await page.getByRole("link", { name: "Back to your little world" }).click();
  await expect(page).toHaveURL((url) => url.pathname === new URL(baseURL!).pathname);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Name stickers");

  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make it");
  await expect(page).toHaveURL(
    (url) => url.searchParams.get("request") === "Iron-on labels for daycare clothes",
  );
  await page.goForward();
  await expect(page).toHaveURL((url) => url.pathname === new URL(baseURL!).pathname);
  await page.getByRole("link", { name: "Make it theirs" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make it");
  await page.getByRole("link", { name: "Littlemark home" }).click();
  await expect(page).toHaveURL((url) => url.pathname === new URL(baseURL!).pathname);
});

test("unknown URLs return HTTP 404 and a working link home", async ({ page, baseURL }) => {
  const response = await page.goto("does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toHaveAttribute(
    "href",
    new URL(baseURL!).pathname,
  );
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Name stickers");
});

test("home and designer fit the viewport without horizontal overflow", async ({ page }) => {
  for (const path of ["./", `design/?${query}`]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
