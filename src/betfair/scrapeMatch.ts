
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


async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);
  let matches: Match[] = []
  // await waitForLoad(page)


  await page.waitForSelector("div#zone-rightcolumn a:nth-child(3).market-link").then(a => a.click())
  await waitForLoad(page)

  await Promise.all(types.map(async (type: string) => {


    const matchTable = await findParentElement({
      page,
      content: type,
      child: " span.title",
      parent: "div#zone-rightcolumn > div > div > div> div> div> div> div> div> div:not(.filters).list-minimarkets > div > div"
    }).catch(logger("error")) // TODO, undefined
    console.log("matchTable", !!matchTable) // TODO solo esistenza
    await waitForLoad(page)


    // get the players in an array of three
    const players: string[] = await getChildContent({
      page,
      parent: matchTable,
      selector: " span.runner-name"
    }).then(logger("players, before parse")).catch(logger("error")) // TODO niente, array vuoto


    // tournament
    const tournament: string = await page.$("div#zone-leftcolumn div:nth-child(1) > div > div > div > a > span")
      .then(a => a ? getContent(a) : "Error")


    // get the odds, in an array
    const oddValues: number[] = await getChildren({
      page,
      element: matchTable,
      selector: "ul > li > a > span.ui-runner-price"
    }).then(parseChildren).then(a => a.map(t => parseFloat(t.trim())))
      .then(logger("odds, with getChildren"))

    /*
        // get the odd types ( handicap value)
        const handicapTypes: string[] = await getChildren({
          page,
          element: <any>matchTable,
          selector: "div.minimarketview-content.ui-market.ui-expanded.ui-market-open > ul > li > span.ui-runner-handicap"
        }).then(parseChildren)
      */

    // XXX Match constructor
    const metadata = {
      sport: "football",
      tournament: tournament,
      matchName: players.join(", "),
      date: "date",
      time: "time",
    }
    const odds = oddsConstructor({ players, type, oddValues, url })
    const match = {
      site: "betfair",
      metadata,
      odds
    }

    matches.push(match)
  }))
  return matches
}


export { scrapeMatch }
