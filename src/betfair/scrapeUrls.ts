
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "../interfaces"
import { oddsConstructor } from "../oddsConstructor"
import {
  getAttribute,
  logger,
  resolveIf,
  getHref,
  parseChildren,
  getContent,
  whenUpdated,
  getChildContent,
  findParentElement,
  waitForLoad,
  getChildren,
  findElement,
  abortMediaRequests
} from "../helpers"



async function scrapeUrls({ page, site, day, state, tournament }: { page: Page, site, day, state, tournament }): Promise<string[]> {
  // go to football
  await page.goto(site);

  // go to italia
  const button = await page.waitForSelector("div#zone-main a.ui-nav.browse-all-arrow > span").then(a => a.click())
  await waitForLoad(page)
  await findElement({
    page,
    content: state,
    selector: "div#zone-main li > a > span.label"
  })
    .then(resolveIf)
    .then((a) => a.click())


  // go to tournament
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
  const dayTable = await findParentElement({
    page,
    content: day,
    child: "div > span.section-header-label",
    parent: "div#zone-main li "
  })
  const links: JSHandle[] = await getChildren({
    page,
    element: dayTable,
    selector: "ul > li > div > div.avb-col.avb-col-markets > a.ui-nav.markets-number-arrow.ui-top.event-link"
  });
  const hrefs: string[] = await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue())))
  console.log(hrefs)
  return hrefs
}


export { scrapeUrls }
