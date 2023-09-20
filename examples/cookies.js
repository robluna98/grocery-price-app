require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const userDataDir = process.env.USER_DATA_DIR;

// Run Once
// Setup Cookies to allow puppeteer to access Instacart website with saved login
// credentials used are saved in cookies.json to allow user login with userDataDir which is accessed through process.env.USER_DATA_DIR
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userDataDir,
  });
  const page = await browser.newPage();
  await page.goto("https://www.google.com/", { waitUntil: "load" });

  // Save Cookies
  const cookies = await page.cookies();
  // Write file to anywhere
  await fs.writeFile("cookies.json", JSON.stringify(cookies, null, 2));

  await browser.close();
})();
