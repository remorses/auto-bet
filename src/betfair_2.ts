import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import * as puppeteer from 'puppeteer'
import { config, selectors } from "./config/betfair"
import { Match, Metadata, Odd, } from "./interfaces"
import * as Parallel from "async-parallel"
import { when, observable, action, reaction } from "mobx"
import { Observable, Subject } from "rxjs"
import { oddsConstructor } from "./oddsConstructor"
import { rawToPure } from "./aliases"
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
} from "./helpers"



async function scrapeUrls({ page, site, day, state, tournament }: { page: Page, site, day, state, tournament }): Promise<string[]> {
  // go to football
  await page.goto(site);

  // go to italia
  const button = await page.waitForSelector("div#zone-main a.ui-nav.browse-all-arrow > span").then(a => a.click())
  await waitForLoad(page)
  let italia = await findElement({
    page,
    content: state,
    selector: "div#zone-main li > a > span.label"
  });

  await resolveIf(italia).then((a) => a.click())

  // go to serie A
  await waitForLoad(page)
  let serieA = await findElement({
    page,
    content: tournament,
    selector: "div#zone-main li > span > a.ui-nav"
  });

  await resolveIf(serieA).then((a) => a.click())

  // get the links of matches
  await waitForLoad(page)
  const domaniTable = await findParentElement({
    page,
    content: day,
    child: "div > span.section-header-label",
    parent: "div#zone-main li "
  })
  const links: JSHandle[] = await getChildren({
    page,
    element: domaniTable,
    selector: "ul > li > div > div.avb-col.avb-col-markets > a.ui-nav.markets-number-arrow.ui-top.event-link"
  });
  const hrefs: string[] = await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue())))
  console.log(hrefs)


  return hrefs
}






async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);
  let matches: Match[] = []
  // await waitForLoad(page)

  // whenUpdated(page)

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

    const metadata = {
      sport: "football",
      tournament: tournament,
      matchName: players.join(", "),
      date: "date",
      time: "time",
    }
    console.log(type)

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




// XXX main logic
(async () => {
  const width = 1000
  const height = 1000
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=${width},${height}`
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height })
  await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls({
    page,
    site: "https://www.betfair.it/sport/football",
    day: "giovedì, 05 aprile",
    state: "UEFA Europa League",
    tournament: "UEFA Europa League"
  })

  const matches: Match[][] = await Promise.all(urls.map(url =>
    scrapeMatch({
      browser,
      url,
      types: ["Rimborso in Caso di Pareggio"]
    }))
  )

  console.log(JSON.stringify(matches))

  /*
    await scrapeMatch({
      browser,
      url: urls[0],
      types: ["Rigore Si/No", "Primo Goal"]
    })
    */

  // await browser.close()
})()
