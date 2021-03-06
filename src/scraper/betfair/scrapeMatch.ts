
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
import {
  findParentElement,
  waitForLoad,
  logger,
  resolveIf,
} from "@scraper/helpers"
import { singleLine, handicapCorners, goalNoGoal, underOvers } from "./scrapeCases"

import * as Debug from "debug";
const debug = Debug("scraper:betfair:scrapeMatch");



async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);



  let matches: Match[] = []
  // await waitForLoad(page)

  try {

    await page.$("div#zone-rightcolumn a:nth-child(3).market-link")
      .then(resolveIf)
      .then(a => a.click())
    await waitForLoad(page)

    await Promise.all(types.map(async (type: string) => {

      // debug(pureToRaw("oddType", type, "betfair"))
      const matchTable = await findParentElement({
        page,
        content: pureToRaw("oddType", type, "betfair"),
        child: " span.title",
        parent: "div#zone-rightcolumn > div > div > div> div> div> div> div> div> div:not(.filters).list-minimarkets > div > div"
      })
      // debug("matchTable", !!matchTable) // TODO solo esistenza
      await waitForLoad(page)

      if (!matchTable) throw new Error(`can't find matchTable for ` + type)

      switch (type) {
        case "rigore_yesNo":
          matches.push(await singleLine({ page, matchTable, type, url, doRoles: true }))
          break
        case "RimborsoPareggio":
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
        case "underOver_0.5":
        case "underOver_1.5":
        case "underOver_2.5":
        case "underOver_3.5":
        case "underOver_4.5":
        case "underOver_5.5":
        case "underOver_6.5":
        case "underOver_7.5":
          matches.push(await underOvers({ page, matchTable, type, url }))
          break
        case "goal_yesNo":
          matches.push(await goalNoGoal({ page, matchTable, type, url }))
          break



      }


    }))
  } catch (e) {
    debug(Error(e))
  }
  await page.close()
  return matches
}




export { scrapeMatch }
