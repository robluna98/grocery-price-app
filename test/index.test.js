const puppeteer = require("puppeteer");
require("dotenv").config();
const userDataDir = process.env.USER_DATA_DIR;
let browser;
let page;
let url = "https://www.instacart.com/store/h-e-b/collections/fresh-fruits";
let TIMEOUT = 30000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    userDataDir: userDataDir,
  });

  page = await browser.newPage();
  await page.goto(url);
});

describe("Item Name Validation", () => {
  test(
    "Should Retrieve Item Names",
    async () => {
      // Wait for the selector to appear on the page
      await page.waitForSelector(".e-n9fc4b");

      const items = await page.evaluate(() => {
        // Select elements with the specified class and extract item names
        return Array.from(document.querySelectorAll(".e-n9fc4b")).map((x) => {
          const item = x.innerText
            .split(",")[0]
            .replace(/\s*,?\s*-count$/i, "")
            .trim();
          return item;
        });
      });
      // Total items grabbed
      console.log(items.length, "items grabbed");
      // Check if items.length is greater than 0
      expect(items.length).toBeGreaterThan(0);
    },
    TIMEOUT
  );
});

afterAll(async () => {
  await browser.close();
});
