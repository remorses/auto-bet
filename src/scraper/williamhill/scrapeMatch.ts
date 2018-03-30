
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { oddsConstructor } from "@scraper/oddsConstructor"
import {
  getAttribute,
  logger,
  resolveIf,
  getHref,
  parseChildren,
  getContent,
  //whenUpdated,
  getChildContent,
  findParentElement,
  waitForLoad,
  getChildren,
  findElement,
  abortMediaRequests
} from "@scraper/helpers"
import { singleLine, handicapCorners, } from "./scrapeCases"
import { rawToPure, pureToRaw } from "@aliases/index"

import * as Debug from "debug";
const debug = Debug("scraper:williamhill:scrapeMatch");

async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);
  await waitForLoad(page)


  await page.$("a#collection25Show")
    .then(resolveIf)
    .then(a => a.click())
  await page.$("a#collection26Show")
    .then(resolveIf)
    .then(a => a.click())
  await page.$("a#collection178Show")
    .then(resolveIf)
    .then(a => a.click())
  await waitForLoad(page)



  let matches: Match[] = []
  await Promise.all(types.map(async (type: string) => {

    try {
      // find the table element, with right type
      const matchTable = await findParentElement({
        page,
        content: pureToRaw("oddType", type, "williamhill"),
        child: "  table > thead > tr > th > span",
        parent: "  div.marketHolderExpanded "
      }).catch(logger("error")) // TODO, undefined
      console.log("matchTable", !!matchTable) // TODO solo esistenza

      if (!matchTable) throw new Error("can't find matchTable for " + type)

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
           matches.push( await handicapCorners({ page, matchTable, type, url }))
          break
      }

    } catch (e) { debug(e) }
  }))
  return matches
}


export { scrapeMatch }
