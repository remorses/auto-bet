
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
  abortMediaRequests
} from "@scraper/helpers"

import * as Debug from "debug";
const debug = Debug("scraper:betfair:scrapeUrls");


async function scrapeUrls({ page, site, days, state, tournaments }: { page: Page, site, days: string[], state, tournaments: string[] }): Promise<string[]> {
  let hrefs: string[] = []
  try {  // go to football
    for (let tournament of tournaments) {

      await page.goto(site);
      // go to state
      await page.$("div#zone-main a.ui-nav.browse-all-arrow > span")
        .then(resolveIf)
        .then(a => a.click())
      await waitForLoad(page)
      await findElement({
        page,
        content: state,
        selector: "div#zone-main li > a > span.label"
      })
        .then(resolveIf)
        .then((a) => a.click())
      await waitForLoad(page)

      await findElement({
        page,
        content: tournament,
        selector: "div#zone-main li > span > a.ui-nav"
      })
        .then(resolveIf)
        .then((a) => a.click())
      // get the links of matches
      await waitForLoad(page)
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
  } catch (e) { debug(e) }
  finally {
    debug(hrefs)
    return hrefs
  }
}


export { scrapeUrls }
