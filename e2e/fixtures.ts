import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ runtimeChecks: void }>({
  runtimeChecks: [
    async ({ page, baseURL }, use) => {
      if (!baseURL) throw new Error("The static demo base URL is required.");
      const origin = new URL(baseURL).origin;
      const errors: string[] = [];

      // Font availability must not determine whether the demo's behavior passes.
      await page.route("https://fonts.googleapis.com/**", (route) =>
        route.fulfill({ contentType: "text/css", body: "" }),
      );
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydrat|Minified React error #(?:418|423|425)/i.test(message.text())
        ) {
          errors.push(message.text());
        }
      });
      page.on("request", (request) => {
        if (/lovable/i.test(request.url())) {
          errors.push(`Unexpected Lovable request: ${request.url()}`);
        }
      });
      page.on("response", (response) => {
        if (
          new URL(response.url()).origin === origin &&
          response.request().resourceType() !== "document" &&
          response.status() >= 400
        ) {
          errors.push(`Broken asset: ${response.status()} ${response.url()}`);
        }
      });

      await use();
      expect(errors, "No runtime/hydration errors, broken assets, or Lovable requests").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
