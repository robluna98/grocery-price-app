require("dotenv").config();
const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");
const fs = require("fs/promises");
const path = require("path");
const { Client } = require("pg");
const { random } = require("user-agents");

function logErrorToFile(message) {
  const logFilePath = path.join(__dirname, "logs", "scraping_error.log");
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: - ${message}\n`;

  // Append the error message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

function getStoreNameFromLink(link) {
  const { stores } = require("./links.js");
  for (const [storeName, { url }] of Object.entries(stores)) {
    if (link.startsWith(url)) {
      return storeName;
    }
  }
  return "Other";
}

function getCategoryFromLink(link) {
  const { stores } = require("./links.js");
  for (const [, { url, categories }] of Object.entries(stores)) {
    if (link.startsWith(url)) {
      for (const [categoryName, subpaths] of Object.entries(categories)) {
        if (subpaths.some((subpath) => link.includes(`${url}/${subpath}`))) {
          return categoryName;
        }
      }
    }
  }
  return "Other";
}

async function scrapeProductInfo(page) {
  const selectors = {
    productContainer: ".e-fsno8i",
    productName: ".e-n9fc4b",
    productPrice: ".e-m67vuy",
    productUnits: ".e-zjik7",
    productUnitElements: ".e-k9ly30", // Child of .e-zjik7
    alternativeProductUnitsElements: ".e-svr0zh",
    productImage: ".e-ec1gba img",
    productUniqueID: ".e-1dlf43s",
  };

  return await page.evaluate(
    ({ selectors }) => {
      // Helper function to find the first non-null element from an array of selectors
      const findFirstValidElement = (element, selectors) => {
        for (const selector of selectors) {
          const result = element.querySelector(selector);
          if (result) {
            return result;
          }
        }
        return null;
      };
      const extractProductInfo = (element) => {
        // Grab product name
        const productNameContainer = element.querySelector(
          selectors.productName
        ).innerText;

        // Grab product price
        const priceElementContainer = element.querySelector(
          selectors.productPrice
        );
        const productText = priceElementContainer.innerText;
        const unitMatch = /\/lb|\/pkg|\/?each/.exec(productText);
        let unit = "";

        if (unitMatch) {
          if (unitMatch[0].startsWith("/")) {
            unit = unitMatch[0];
          } else {
            unit = " " + unitMatch[0];
          }
        }
        const productPrice = productText.split("\n")[0] + unit || null;

        // Grab product units
        const productUnitContainer = findFirstValidElement(element, [
          selectors.productUnits,
          selectors.alternativeProductUnitsElements,
        ]);
        const unitElements = productUnitContainer
          ? Array.from(
              productUnitContainer.querySelectorAll(
                selectors.productUnitElements
              )
            ).map((unitElement) => unitElement.innerText)
          : null;

        const productUnits =
          unitElements && unitElements.length === 1
            ? unitElements[0]
            : unitElements;

        // Grab product image
        const productImageContainer = element.querySelector(
          selectors.productImage
        );
        const productImage =
          productImageContainer
            .getAttribute("srcset")
            .split(/,\s+/)[0]
            .split(" ")[0] || null;

        // Create a productUniqueID
        const productUniqueID = element
          .querySelector(selectors.productUniqueID)
          .getAttribute("href")
          .split("?")[0];

        // Create a timestamp for when the product was scraped
        const timestamp =
          new Date().toISOString() + Math.floor(Math.random() * 10000);

        // Return data
        return {
          timestamp: timestamp,
          productName: productNameContainer,
          productPrice: productPrice,
          productUnits: productUnits,
          productImage: productImage,
          productUniqueID: productUniqueID,
        };
      };

      return Array.from(
        document.querySelectorAll(selectors.productContainer)
      ).map(extractProductInfo);
    },
    { selectors }
  );
}

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

async function scrapeStores(links) {
  let errorOccurred = false; // flag to keep track of errors
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4, // Adjust this based on your system's capacity
    timeout: 2147483647, // Set timeout to safest 32 bit integer as puppeteer-cluster does not support max_timeout
    monitor: true,
    puppeteerOptions: {
      headless: false,
    },
  });

  // Event handle to be called in case of problems
  cluster.on("taskerror", (err, data) => {
    const errorMessage = `Error crawling ${data}: ${err.message}`;
    logErrorToFile(errorMessage);
    errorOccurred = true;
  });

  let allData = [];

  await cluster.task(async ({ page, data: storeLink }) => {
    // Set Sleep Function
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const buttonSelector =
      "#store-wrapper > div > div > div.e-1bfgc1k > div.e-14cjhfa > button";

    // Set Cookies
    const cookiesString = await fs.readFile("./data/cookies.json");
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    // Set User Agent
    const randomUserAgent = random();
    await page.setUserAgent(randomUserAgent.toString());

    await page.goto(storeLink);
    const productCategory = getCategoryFromLink(storeLink);
    const productStoreName = getStoreNameFromLink(storeLink);

    await page.waitForSelector(buttonSelector, {
      visible: true,
    });
    while (true) {
      const loadMoreButton = await page.$(buttonSelector);
      if (!loadMoreButton) {
        break;
      }
      await loadMoreButton.click();
      await sleep(1500);
    }

    const data = await scrapeProductInfo(page);
    // Append productCategory data and handle duplicate names
    data.forEach((product) => {
      product.productCategory = productCategory;
      product.productStoreName = productStoreName;
    });
    allData.push(...data);
  });

  for (const link of links) {
    cluster.queue(link);
  }

  await cluster.idle();
  await cluster.close();

  if (errorOccurred) {
    throw new Error("An error occurred during scraping"); // throw if there was an error
  }

  return allData;
}

async function pushPostgresDB(data) {
  const pgClient = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

  try {
    await pgClient.connect();

    for (const product of data) {
      const updateQuery = `
        INSERT INTO products (timestamp, product_unique_id, product_name, product_price, product_units, product_image, product_category, product_store_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (timestamp) DO UPDATE
        SET
          product_unique_id = $2,
          product_name = $3,
          product_price = $4,
          product_units = $5,
          product_image = $6,
          product_category = $7,
          product_store_name = $8
      `;

      const values = [
        product.timestamp,
        product.productUniqueID,
        product.productName,
        product.productPrice,
        product.productUnits,
        product.productImage,
        product.productCategory,
        product.productStoreName,
      ];

      await pgClient.query(updateQuery, values);
    }
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } finally {
    await pgClient.end();
    console.log("Data has been pushed to PostgreSQL");
  }
}

async function main() {
  try {
    await grabCookies();
    const { allLinks } = require("./links.js"); // Import the links from your module
    const allData = await scrapeStores(allLinks);
    await pushPostgresDB(allData);
  } catch (err) {
    const errorMessage = `Scraping failed, not pushing to PostgreSQL: ${err}`;
    logErrorToFile(errorMessage);
    console.error(
      "An error has occured during scraping, please check the logs for more details. The log file is located at ./logs/scraping_error.log"
    );
  }
}

main();
