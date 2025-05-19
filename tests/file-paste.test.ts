import { readFileSync } from "fs";
import path from "path";
import test, { expect } from "playwright/test";

const __dirname = path.resolve(path.dirname(""));
const htmlFilePath = path.join(__dirname, "tests", "file-paste.html");
const imageFilePath = path.join(__dirname, "tests", "image.png");

test("File paste", async ({ page }) => {
  await page.goto(`file://${htmlFilePath}`);

  await page.route("**/image.png", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: readFileSync(imageFilePath),
    });
  });

  // Copy the image to clipboard
  await page.evaluate(async () => {
    const response = await fetch("https://example.com/image.png");
    const blob = await response.blob();
    // This should not work in Firefox headless mode
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
  });

  // You can uncomment these lines to see that Playwright correctly copies the image to the clipboard

  // await page.evaluate(async () => {
  //   const clipboardData = await navigator.clipboard.read();
  //   throw new Error(clipboardData[0].types[0]);
  // });

  const locator = page.locator("#uploadFile");

  await locator.press("ControlOrMeta+V");
  await expect(locator).toHaveText("File uploaded: image.png");
});

test("Text paste", async ({ page }) => {
  await page.goto(`file://${htmlFilePath}`);

  // Copy the text to clipboard
  await page.evaluate(() => {
    navigator.clipboard.writeText("Hello World");
  });

  const locator = page.locator("#uploadText");

  await locator.press("ControlOrMeta+V");
  await expect(locator).toHaveValue("Hello World");
});
