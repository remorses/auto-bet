import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { abortMediaRequests } from "@scraper/helpers"
import { rawToPure, pureToRaw } from "@aliases/index"
import { scrapeUrls } from "./scrapeUrls"
import { scrapeMatch } from "./scrapeMatch"
import { login } from "./login"

// XXX main logic
const run = async (browser, options): Promise<Match[]> => {

  const page = await browser.newPage();
  await page.setViewport({ width: options.width, height: options.height });
  await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls({
    page,
    site: "https://www.betfair.it/sport/football",
    day: "giovedì, 05 aprile",
    state: "UEFA Europa League",
    tournament: "UEFA Europa League"
  })

  const matches: Match[] = await Promise.all(urls.map(url =>
    scrapeMatch({
      browser,
      url,
      types: ["Rimborso in Caso di Pareggio",'handicapCorners_["-1","+2"]']
    }))
  ).then(arr => arr.reduce((acc, curr) => acc.concat(curr), []))

/*
  // testing purpose
  const matches = [...await scrapeMatch({
    browser,
    url: "https://www.betfair.it/sport/football/event?eventId=28642064",
    types: ['handicapCorners_["-1","+2"]']
  })]*/


  // await browser.close()
  return matches

}
export { run }
