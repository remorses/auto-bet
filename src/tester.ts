


import * as puppeteer from "puppeteer";
import { Page } from 'puppeteer'

interface waiterArg {
  page: any,
  site: string,
  time: number
}

const waiter = async ({ page, site, time = 0 }: waiterArg) => {
  // await page.goto(site);
  await (new Promise((resolve, reject) => setTimeout(() => resolve("done"), time))
    .then(a => console.log(a)))
}



(async () => {
  const browser = await puppeteer.launch();
  const pageA = await browser.newPage();
  const pageB = await browser.newPage();
  const pageC = await browser.newPage();
  var start = new Date();

  Promise.all([
    waiter({
      page: pageA,
      site: "https://github.com/GoogleChrome/puppeteer",
      time: 6000
    }), waiter({
      page: pageB,
      site: "https://github.com/GoogleChrome/puppeteer",
      time: 6000
    })
  ])
  //console.info("Execution time : %dms", new Date() - start);
  await browser.close();
})();


const finder = async (page: Page, selector: string, content: string) => {
  const textContent = await page.evaluate(() => {
    const elements = document.querySelectorAll(selector)
    for (let element of elements) {
      if (element.textContent === content) { return element }
    }
  })
}
