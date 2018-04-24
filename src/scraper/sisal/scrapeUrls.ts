
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
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
  abortMediaRequests,
  findElementFromElement
} from "@scraper/helpers"

import * as Debug from "debug";
const debug = Debug("scraper:eurobet:scrapeUrls");


async function scrapeUrls({ page, site, days, state, tournaments }: { page: Page, site, days: string[] | "*", state, tournaments: string[] }): Promise<string[]> {
  let hrefs: string[] = []
  try {  // go to football
    for (let tournament of tournaments) {

      await page.goto(site);
      // await page.waitForNavigation({ waitUntil: "networkidle0" })
      await waitForLoad(page)

      // go to state


      await page.$("div#sidebar-sticky-wrapper div.hide-scroll-bar > ul > li:nth-child(2) > a > img ")
        .then(resolveIf)
        .then(a => a.click())

      // await waitForLoad(page)
      // "div > li:nth-child(4) > a > h4"
      const stateTable = await findParentElement({
        page,
        content: state,
        child: "  a > h4",
        parent: "div > li"
      })//.then(a => a.click())
      // await waitForLoad(page)

      // "li:nth-child(4) > ul > li:nth-child(1) > a > h4"

      await findElementFromElement({
        page,
        content: tournament,
        selector: "ul > li > a > h4",
        element: stateTable
      })
        .then(resolveIf)
        .then((a) => a.click())

      // get the links of matches
      await waitForLoad(page)
      // "div > div.anti-row > div > div.event-row > div.event-wrapper-info > div.event-players > a"
      if (days === "*") {
        const links = await page.$$("div > div.anti-row > div > div.event-row > div.event-wrapper-info > div.event-players > a").catch(debug)
        hrefs.push(... await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue()))))
      } else {
        for (let day of days) {
          const dayTable = await findParentElement({
            page,
            content: day,
            child: "div > span.section-header-label",
            parent: "div#zone-main li "
          })
          if (!dayTable) throw new Error("no day Table")
          const links = await getChildren({
            page,
            element: dayTable,
            selector: "ul > li > div > div.avb-col.avb-col-markets > a.ui-nav.markets-number-arrow.ui-top.event-link"
          }).then(arr => arr.map(getHref))
          hrefs.push(...await Promise.all(links))
        }
      }
    }
  } catch (e) { debug(Error(e)) }
  finally {
    debug(hrefs)
    return hrefs
  }
}


export { scrapeUrls }
