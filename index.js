require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { heb_links, costco_links } = require("./links.js");

const user_data_dir = process.env.USER_DATA_DIR;

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [user_data_dir],
  });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.instacart.com/store/directory");
  await sleep(5000);
  // Click location button
  await page.waitForSelector(
    "#commonHeader > div > div > div:nth-child(5) > div > button"
  );
  await page.click(
    "#commonHeader > div > div > div:nth-child(5) > div > button"
  );
  // Click use current location
  await sleep(5000);
  await page.click(
    "#id-5 > div.e-1hudhoo > div.e-1rvobel > div > div.e-149yvev > div > div"
  );
  // Click Submit
  await page.waitForSelector(
    "#id-5 > div.e-1hudhoo > div.e-1rvobel > div > form > button"
  );
  await page.click(
    "#id-5 > div.e-1hudhoo > div.e-1rvobel > div > form > button"
  );

  // Grab the hrefs of all the links filtered
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a"))
      .map((x) => x.href)
      .filter(
        (link) =>
          link.includes("storefront") &&
          (link.includes("h-e-b") ||
            link.includes("costco") ||
            link.includes("central-market") ||
            link.includes("sprouts") ||
            link.includes("target"))
      )
      .filter(
        (link) =>
          !link.includes("sprouts-express") && !link.includes("target-now")
      );
  });

  for (const link of links) {
    await page.goto(link);
    await sleep(5000);
    if (link.includes("h-e-b")) {
      for (const heb_link of heb_links) {
        await page.goto(heb_link);
        await sleep(5000);
        while (true) {
          const loadMoreButton = await page.$(
            "#store-wrapper > div > div > div.e-1bfgc1k > div.e-14cjhfa > button"
          );
          if (!loadMoreButton) {
            break;
          }
          await loadMoreButton.click();
          await sleep(1000);
        }
        console.log("It worked");
      }
    }
  }
  await browser.close();
}

run();
