import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { abortMediaRequests } from "@scraper/helpers"

import { scrapeUrls } from "./scrapeUrls"
import { scrapeMatch } from "./scrapeMatch"
import { login } from "./login"





// XXX main logic
(async () => {
  const width = 1000
  const height = 1000
  const browser = await launch({
    headless: false,
    args: [
      `--window-size=${width},${height}`
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height })
  //await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls({
    page,
    site: "http://sports.williamhill.it/bet_ita/it/betting/y/5/et/Calcio.html",
    day: "31 Mar",
    state: "Italia",
    tournament: "Serie A"
  })
  /*
    const matches: Match[] = await Promise.all(urls.map(url =>
      scrapeMatch({
        browser,
        url,
        types: ["Over/Under 2.5 Goal"]
      }))
    ).then(arr => arr.reduce((acc, curr) => acc.concat(curr), []))
    */
  const matches: Match[] = await scrapeMatch({
    browser,
    url: urls[0],
    types: ["Over/Under 2.5 Goal"]
  })

  console.log(JSON.stringify(matches))


  // await browser.close()
})()
