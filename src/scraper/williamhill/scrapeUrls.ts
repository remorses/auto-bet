
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
  // whenUpdated,
  getChildContent,
  findParentElement,
  waitForLoad,
  getChildren,
  findElement,
  abortMediaRequests
} from "@scraper/helpers"


async function scrapeUrls({ page, site, days, state, tournaments }: { page: Page, site, days: string[] | "*", state, tournaments: string[] }): Promise<string[]> {

  let hrefs: string[] = []

  for (let tournament of tournaments) {

    await page.goto(site);
    await waitForLoad(page)
    // await page.waitForNavigation({waitUntil: "domcontentloaded"})

    await page.waitForSelector("#popupClose").then(a => a.click())
    await waitForLoad(page)

    // find right state container
    const stateTable = await findParentElement({
      page,
      content: state,
      child: "h3",
      parent: "#contentA > div.listContainer > ul > li "
    })

    // find the right tournament button and click
    await waitForLoad(page)
    let tournamentButton
    const tournamentButtons = await stateTable.$$("ul > li > a")
    for (let button of tournamentButtons) {
      if (await getContent(button) === tournament) {
        tournamentButton = button
      }
    }
    await resolveIf(tournamentButton).then((a) => a.click())
    await page.waitForNavigation({ waitUntil: "domcontentloaded" })
    if (days === "*") {
      const links = await page.$$("div#tup_type_1_mkt_grps tr td:nth-child(3) > a")
      hrefs.push(... await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue()))))
    } else {
      for (let day of days) {
        // get the links of matches
        // await waitForLoad(page)
        let links: ElementHandle[] = []
        const allMatches = await page.$$("div#tup_type_1_mkt_grps tr ")
        for (let match of allMatches) {
          if (!match) continue
          const date = await match.$("td:nth-child(1) > span")
          const link = await match.$("td:nth-child(3) > a")
          if (!date || !link) continue
          console.log(await getContent(date))
          if (await getContent(date) === day) links.push(link)
        }
        hrefs.push(... await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue()))))
      }
    }
  }
  console.log(hrefs)

  return hrefs
}

export { scrapeUrls }
