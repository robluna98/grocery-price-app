require("dotenv").config();
const { Cluster } = require("puppeteer-cluster");
const fs = require("fs/promises");
const path = require("path");

/**
 * Extracts the category from a given link.
 *
 * @param {string} link - The link to extract the category from.
 * @return {string} The category extracted from the link.
 */
function getCategoryFromLink(link) {
  const { categoriesMapping } = require("./categories.js");

  for (const category in categoriesMapping) {
    if (categoriesMapping[category].some((pattern) => link.includes(pattern))) {
      return category;
    }
  }
  // Default to "Other" category if no match is found
  return "Other";
}

/**
 * Scrapes the names of items from a web page.
 *
 * @param {Page} page - The page to scrape the item names from.
 * @return {Promise<Array<string>>} An array of item names.
 */
async function scrapeItemNames(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".e-vijstc")).map((x) => {
      const item = x.innerText
        .split(",")[0]
        .replace(/\s*,?\s*-count$/i, "")
        .trim();
      return item;
    });
  });
}

/**
 * Scrapes the units from the given page.
 *
 * @param {Object} page - The page object to scrape units from.
 * @return {Promise<Array>} An array of unit text values.
 */
async function scrapeUnits(page) {
  return await page.evaluate(() => {
    const elementHeader = document.querySelectorAll(".e-fsno8i");
    const unitTextArray = [];

    elementHeader.forEach((element) => {
      const unitValue = element.querySelectorAll(".e-wfknno");
      if (unitValue.length > 0) {
        unitValue.forEach((unit) => {
          unitTextArray.push(unit.innerText);
        });
      } else {
        unitTextArray.push(null); // Push null if .e-wfknno is not found
      }
    });
    return unitTextArray;
  });
}

/**
 * Scrapes images from a web page.
 *
 * @param {Page} page - The page to scrape images from.
 * @return {Promise<Array<string>>} An array of URLs of the scraped images.
 */
async function scrapeImages(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".e-ec1gba img"))
      .map((x) => {
        const srcset = x.getAttribute("srcset");
        if (srcset) {
          const srcsetParts = srcset.split(/,\s+/);
          const firstURL = srcsetParts[0].split(" ")[0];
          return firstURL || null;
        } else {
          return null;
        }
      })
      .filter((image) => image !== null);
  });
}

/**
 * Scrapes prices from a web page.
 *
 * @param {Page} page - The page to scrape prices from.
 * @return {Promise<Array<string>>} An array of prices
 */
async function scrapePrices(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".e-1jioxed"))
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
}

/**
 * Scrapes data from multiple stores using a list of links.
 *
 * @param {Array<string>} links - The list of links to the stores.
 * @param {string} storeName - The name of the store.
 * @return {Promise<void>} - A promise that resolves when the scraping is complete.
 */
async function scrapeStores(links, storeName) {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4, // Adjust this based on your system's capacity
    timeout: 2147483647, // Set timeout to safest 32 bit integer as puppeteer-cluster does not support max_timeout
    monitor: true,
    puppeteerOptions: {
      headless: "new",
      defaultViewport: false,
    },
  });

  // Event handler to be called in case of problems
  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: storeLink }) => {
    // Set Sleep Function
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      await sleep(2500);
    }

    const itemName = await scrapeItemNames(page);
    const prices = await scrapePrices(page);
    const img = await scrapeImages(page);
    const category = getCategoryFromLink(storeLink);
    const unit = await scrapeUnits(page);

    const combinedData = itemName.map((item, index) => ({
      category: category, // Get the category from the link
      item: item,
      price: prices[index],
      image: img[index],
      unit: unit[index],
    }));

    let existingData = {};
    const dataFilePath = path.join(__dirname, "../../data/storeData.json");
    try {
      const existingDataStr = await fs.readFile(dataFilePath, "utf-8");
      existingData = JSON.parse(existingDataStr);
    } catch (error) {}

    if (!existingData[storeName]) {
      existingData[storeName] = [];
    }

    const uniqueData = combinedData.filter((newItem) => {
      // Check for duplicates based on the 'item' property
      const isDuplicate = existingData[storeName].some(
        (existingItem) => existingItem.item === newItem.item
      );

      // Check if the category matches
      const categoryMatches = existingData[storeName].every(
        (existingItem) => existingItem.category === newItem.category
      );

      // Only add the item if it's not a duplicate and the category matches
      return !isDuplicate && categoryMatches;
    });

    existingData[storeName].push(...uniqueData);

    await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));
    console.log("Scraped data from:", storeLink);
  });

  for (const link of links) {
    cluster.queue(link);
  }

  await cluster.idle();
  await cluster.close();
}

/**
 * Executes the main function.
 *
 * @return {Promise<void>} A promise that resolves when the function is finished executing.
 */
async function main() {
  const { hebLinks, costcoLinks } = require("./links.js"); // Import the links from your module
  await scrapeStores(hebLinks, "heb");
  // await scrapeStores(costcoLinks, "costco");
}

main();

// TODO::
// Add puppeteer stealth plugin
// Connect to local database
