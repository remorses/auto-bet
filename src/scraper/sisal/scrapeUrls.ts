
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


async function scrapeUrls({ page, site, days, tournaments }: { page: Page, site, days: string[] | "*", tournaments: string[] }): Promise<string[]> {
  let hrefs: string[] = []
  try {  // go to football
    for (let tournament of tournaments) {

      await page.goto(site);
      // await page.waitForNavigation({ waitUntil: "networkidle0" })
      await waitForLoad(page)

      // go to state


      await page.$("div#p_p_id_AlberaturaAntepost_WAR_scommesseportlet_ div.items > div > div > div:nth-child(1) > a")
        .then(resolveIf)
        .then(a => a.click())

      // await waitForLoad(page)
      // "div > li:nth-child(4) > a > h4"
      const stateTable = await findElement({
        page,
        content: tournament,
        selector: "div.event > a "
      }).then(resolveIf)
        .then((a) => a.click())

      await page.waitForNavigation()
      // get the links of matches
      await waitForLoad(page)

      if (days === "*") {
        const links = await page.$$(" div.event> div.detail > p.name > a")
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
