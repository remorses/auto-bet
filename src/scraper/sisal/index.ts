

import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { abortMediaRequests } from "@scraper/helpers"
import { rawToPure, pureToRaw } from "@aliases/index"
import { scrapeMatches } from "./scrapeMatches"
//import { login } from "./login"


import * as Debug from "debug";
const debug = Debug("scraper:sisal:index");

// XXX main logic
export const run = async ({ browser, options, days, tournaments, types }): Promise<Match[]> => {
  const page = await browser.newPage();
  await page.setViewport({ width: options.width, height: options.height });
  //await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day

  const matches = await scrapeMatches({
    page,
    days,
    types,
    tournaments,
    site: "https://www.sisal.it/scommesse-matchpoint",
  })






  // await page.close()
  return matches
}
