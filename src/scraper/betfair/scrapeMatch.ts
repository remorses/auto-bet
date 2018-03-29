
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
import {
  findParentElement,
  waitForLoad,
  logger
} from "@scraper/helpers"
import { singleLine, handicapCorners, } from "./scrapeCases"

import * as Debug from "debug";
const debug = Debug("scraper:betfair:scrapeMatch");



async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);
  let matches: Match[] = []
  // await waitForLoad(page)


  await page.waitForSelector("div#zone-rightcolumn a:nth-child(3).market-link").then(a => a.click())
  await waitForLoad(page)

  await Promise.all(types.map(async (type: string) => {

    try {
      // debug(pureToRaw("oddType", type, "betfair"))
      const matchTable = await findParentElement({
        page,
        content: pureToRaw("oddType", type, "betfair"),
        child: " span.title",
        parent: "div#zone-rightcolumn > div > div > div> div> div> div> div> div> div:not(.filters).list-minimarkets > div > div"
      })
      // debug("matchTable", !!matchTable) // TODO solo esistenza
      await waitForLoad(page)

      if (!matchTable) return

      switch (type) {
        case "underOver_2.5":
        case "rigore_yesNo":
          matches.push(await singleLine({ page, matchTable, type, url, doRoles: true }))
          break
        case "Rimborso in Caso di Pareggio":
        case "outcome":
          matches.push(await singleLine({ page, matchTable, type, url }))
          break
        case 'handicapCorners_["-1","+2"]':
        case 'handicapCorners_["-2","+3"]':
        case 'handicapCorners_["-3","+4"]':
        case 'handicapCorners_["-4","+5"]':
        case 'handicapCorners_["+2","-1"]':
        case 'handicapCorners_["+3","-2"]':
        case 'handicapCorners_["+4","-3"]':
        case 'handicapCorners_["+5","-4"]':
          matches.push(... await handicapCorners({ page, matchTable, type, url }))
          break
      }
    } catch (e) {
      debug("Error: ", e)
      return
    }

  }))
  return matches
}


export { scrapeMatch }
