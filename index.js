require("dotenv").config();
const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");
const fs = require("fs/promises");

const userDataDir = process.env.USER_DATA_DIR;

// Run Once
// Setup Cookies to allow puppeteer to access Instacart website with saved login from userDataDir
// credentials used are saved in cookies.json to allow user login with userDataDir which is accessed through process.env.USER_DATA_DIR
async function grabCookies() {
  const cookiesFileExists = await fs
    .access("./data/cookies.json")
    .then(() => true)
    .catch(() => false);

  if (!cookiesFileExists) {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: userDataDir,
    });
    const page = await browser.newPage();
    await page.goto("https://www.instacart.com/", { waitUntil: "load" });

    // Save Cookies
    const cookies = await page.cookies();
    await fs.writeFile("./data/cookies.json", JSON.stringify(cookies, null, 2));

    await browser.close();
  }
}

async function scrapeStores(links, storeName) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4, // Adjust this based on your system's capacity
    timeout: 2147483647, // Set timeout to safest 32 bit integer as puppeteer-cluster does not support max_timeout
    monitor: true,
    puppeteerOptions: {
      headless: false,
      defaultViewport: false,
      userDataDir: userDataDir,
    },
  });

  // Event handler to be called in case of problems
  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: storeLink }) => {
    // Set Sleep Function
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Load Cookies
    const cookiesString = await fs.readFile("./data/cookies.json");
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    await page.goto(storeLink);
    await sleep(5000);
    while (true) {
      const loadMoreButton = await page.$(
        "#store-wrapper > div > div > div.e-1bfgc1k > div.e-14cjhfa > button"
      );
      if (!loadMoreButton) {
        break;
      }
      await loadMoreButton.click();
      await sleep(1500);
    }

    const itemName = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".e-vijstc")).map((x) => {
        const item = x.innerText
          .split(",")[0]
          // Regex to remove unnecessary text
          .replace(/\s*,?\s*-count$/i, "")
          .trim();
        return item;
      });
    });

    const prices = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".e-m67vuy"))
        .map((x) => {
          const price = x.innerText.split("\n")[0];
          let unit = "";
          if (x.innerText.includes("/lb")) {
            unit = "/lb";
          } else if (x.innerText.includes("pkg")) {
            unit = "/pkg";
          } else if (x.innerText.includes("each")) {
            unit = "/each";
          }
          return price + unit;
        })
        .filter((x) => x.includes("$"));
    });

    // Image Grabber
    const img = await page.evaluate(() => {
      return (
        Array.from(document.querySelectorAll(".e-ec1gba img"))
          .map((x) => {
            const srcset = x.getAttribute("srcset");
            if (srcset) {
              // Split the srcset by commas and spaces
              const srcsetParts = srcset.split(/,\s+/);

              // Extract the URL from the first part (before the first space)
              const firstURL = srcsetParts[0].split(" ")[0];

              return firstURL || null;
            } else {
              return null;
            }
          })
          // Filter out null values from the img array
          .filter((image) => image !== null)
      );
    });

    const combinedData = itemName.map((item, index) => ({
      item: item,
      price: prices[index],
      image: img[index],
    }));

    let existingData = {};
    try {
      const existingDataStr = await fs.readFile(
        `./data/storeData.json`,
        "utf-8"
      );
      existingData = JSON.parse(existingDataStr);
    } catch (error) {}

    if (!existingData[storeName]) {
      existingData[storeName] = [];
    }

    const uniqueData = combinedData.filter((newItem) => {
      return !existingData[storeName].some(
        (existingItem) => existingItem.item === newItem.item
      );
    });

    existingData[storeName].push(...uniqueData);

    await fs.writeFile(
      `./data/storeData.json`,
      JSON.stringify(existingData, null, 2)
    );
    console.log("Scraped data from:", storeLink);
  });

  for (const link of links) {
    cluster.queue(link);
  }

  await cluster.idle();
  await cluster.close();
}

async function main() {
  const { hebLinks, costcoLinks } = require("./links.js"); // Import the links from your module
  await grabCookies();
  await scrapeStores(hebLinks, "heb");
  await scrapeStores(costcoLinks, "costco");
}

main();

// TODO::
// Add puppeteer stealth plugin
// Seperate data into categories
