require("dotenv").config();
const { Cluster } = require("puppeteer-cluster");
const fs = require("fs/promises");
const { hebLinks } = require("./links.js");

const userDataDir = process.env.USER_DATA_DIR;

async function scrapeLinks() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4, // Adjust this based on your system's capacity
    timeout: 60000,
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

  await cluster.task(async ({ page, data: hebLink }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.goto(hebLink);
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

    const item_name = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".e-vijstc")).map((x) => {
        const item = x.innerText.split("\n")[0];
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
    // const img = await page.evaluate(() => {
    //   return Array.from(document.querySelectorAll(".e-ec1gba img")).map((x) => {
    //     const image = x.getAttribute("srcset");
    //     return image;
    //   });
    // });

    const combinedData = item_name.map((item, index) => ({
      item: item,
      price: prices[index],
      image: img[index],
    }));

    let existingData = [];
    try {
      const exisingDataStr = await fs.readFile("data.json", "utf-8");
      existingData = JSON.parse(exisingDataStr);
    } catch (error) {}

    const updatedData = [...existingData, ...combinedData];
    await fs.writeFile("data.json", JSON.stringify(updatedData, null, 2));
    console.log("Scraped data from:", hebLink);
  });

  for (const link of hebLinks) {
    cluster.queue(link);
  }

  await cluster.idle();
  await cluster.close();
}

scrapeLinks();

// TODO::
// Add puppeteer stealth plugin
