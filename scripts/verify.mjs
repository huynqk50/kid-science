import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const url = process.env.APP_URL ?? "http://127.0.0.1:5173/";
const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = new URL("../verification/", import.meta.url);

function outPath(fileName) {
  return fileURLToPath(new URL(fileName, outDir));
}

function assert(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

async function verifyViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".sort-object", { timeout: 15000 });

  const heading = await page.locator("h1").innerText();
  const modules = await page.locator(".module-card").count();
  const bins = await page.locator(".category-bin").count();
  const objectName = await page.locator(".sort-object h2").innerText();
  const notebook = await page.locator(".field-notebook").innerText();

  await page.screenshot({ path: outPath(`${name}.png`), fullPage: true });

  assert(heading === "Kid Science", `${name}: heading mismatch`);
  assert(modules === 2, `${name}: expected two modules`);
  assert(bins === 3, `${name}: rocks module should have three bins`);
  assert(objectName === "Granite", `${name}: expected Granite as the first object`);
  assert(notebook.includes("Field Notebook"), `${name}: missing notebook`);
  await page.close();
}

async function verifyInteraction(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".sort-object", { timeout: 15000 });

  await page.locator(".reason-bank button", { hasText: "cooled magma" }).click();
  await page.getByRole("button", { name: /Igneous/ }).click();

  const feedback = await page.locator(".feedback").innerText();
  const score = await page.locator(".score-strip").innerText();
  const nextObject = await page.locator(".sort-object h2").innerText();

  await page.getByRole("button", { name: /Changes to Materials/ }).click();
  const materialsBins = await page.locator(".category-bin").count();
  const materialObject = await page.locator(".sort-object h2").innerText();

  await page.screenshot({ path: outPath("interaction.png"), fullPage: true });

  assert(feedback.includes("Granite: correct"), "sort feedback did not confirm Granite");
  assert(score.includes("Score 120"), "score did not update after correct sort");
  assert(nextObject === "Shale", "queue did not advance to Shale");
  assert(materialsBins === 2, "materials module should have two bins");
  assert(materialObject === "Melting Ice", "materials module did not reset queue");
  await page.close();
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  await verifyViewport(browser, "desktop", { width: 1440, height: 1000 });
  await verifyViewport(browser, "mobile", { width: 390, height: 900 });
  await verifyInteraction(browser);

  console.log(
    JSON.stringify(
      {
        ok: true,
        url,
        screenshots: ["verification/desktop.png", "verification/mobile.png", "verification/interaction.png"],
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
