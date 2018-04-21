import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { abortMediaRequests } from "@scraper/helpers"
import { rawToPure, pureToRaw } from "@aliases/index"
import { scrapeUrls } from "./scrapeUrls"
import { scrapeMatch } from "./scrapeMatch"
import { login } from "./login"


import * as Debug from "debug";
const debug = Debug("scraper:betfair:index");

// XXX main logic
const run = async ({ browser, options, days, state, tournaments, types }): Promise<Match[]> => {
  let matches: Match[] = []
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });
  await abortMediaRequests(page)
  const urls: string[] = []
  try {

    // get the matches urls of a determinated tournament and day

    urls.push(...await scrapeUrls({
      page,
      days,
      state,
      tournaments,
      site: "https://www.betfair.it/sport/football",
    }))


    matches = await Promise.all(urls.map(url =>
      scrapeMatch({
        browser,
        url,
        types
      }))).then(arr => arr.reduce((acc, curr) => acc.concat(curr), []))
    /*
      // testing purpose
      const matches = [...await scrapeMatch({
        browser,
        url: "https://www.betfair.it/sport/football/event?eventId=28642064",
        types: ['handicapCorners_["-1","+2"]']
      })]*/
  } catch (e) {
    debug(e)
  } finally {
    await page.close()
    return matches
  }

}
export { run }
