

import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { abortMediaRequests } from "@scraper/helpers"
import { rawToPure, pureToRaw } from "@aliases/index"
import { scrapeUrls } from "./scrapeUrls"
import { scrapeMatch } from "./scrapeMatch"
//import { login } from "./login"


import * as Debug from "debug";
const debug = Debug("scraper:eurobet:index");

// XXX main logic
export const run = async ({ browser, options, days, state, tournaments, types }): Promise<any[]> => {
  const page = await browser.newPage();
  await page.setViewport({ width: options.width, height: options.height });
  //await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day

  const urls = await scrapeUrls({
    page,
    days,
    state,
    tournaments,
    site: "https://www.eurobet.it/it/scommesse/#!/calcio",
  })


  const matches = await Promise.all(urls.map(url =>
    scrapeMatch({
      browser,
      url,
      types
    }))).then(arr => arr.reduce((acc, curr) => acc.concat(curr), []))

  /*
// testing purpose
const matches = [...await scrapeMatch({
browser,
url: "https://www.eurobet.it/it/scommesse/#!/calcio/it-serie-a/inter-cagliari-201804172045",
types: ["1X2 + Multigoal 1-3","U/O 2.5", "somma goal" ]
})]
*/

  // await page.close()
  return matches
}



(async () => {
  const options = {
    width: 300,
    height: 1000
  };
  const browser = await launch({
    headless: false,
    args: [
      `--window-size=${options.width},${options.height}`
    ],
  });

  const matches = await run({
    browser,
    options,
    days: "*",
    state: "Italia",
    tournaments: ["Serie A"],
    types: ["1X2 + Multigoal 1-3","U/O 2.5", "somma goal" ]
  })
  debug(matches)
})()
