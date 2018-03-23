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



/*
// await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

// sign in
await page.waitForSelector(selectors.usernameField);
await page.click(selectors.usernameField)
await page.keyboard.type(config.username)
await page.waitForSelector(selectors.passwordField);
await page.click(selectors.passwordField)
await page.keyboard.type(config.password)
await page.waitForSelector(selectors.submitLogin);
await page.click(selectors.submitLogin);
*/
async function scrapeUrls({ page, site, day, state, tournament }: { page: Page, site, day, state, tournament }): Promise<string[]> {
  // go to football
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


  await waitForLoad(page)
  // find the right tournament button and click
  let tournamentButton
  const tournamentButtons = await stateTable.$$("ul > li > a")
  for (let button of tournamentButtons) {
    if (await getContent(button) === tournament) {
      tournamentButton = button
    }
  }
  await resolveIf(tournamentButton).then((a) => a.click())
  await page.waitForNavigation({ waitUntil: "domcontentloaded" })

  "div#tup_type_1_mkt_grps tr"
  "td:nth-child(1) > span"
  "td:nth-child(3) > a > span"

  // get the links of matches
  // await waitForLoad(page)
  let links = []
  const allMatches = await page.$$("div#tup_type_1_mkt_grps tr ")
  for (let match of allMatches) {
    if (!match) continue
    const date = await match.$("td:nth-child(1) > span")
    const link = await match.$("td:nth-child(3) > a")
    if (!date || !link) continue
    console.log(await getContent(date))
    if (await getContent(date) === day) links.push(link)
  }
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
  // await waitForLoad(page)
  await page.waitForNavigation({ waitUntil: "domcontentloaded" })

  await Promise.all(types.map(async (type: string) => {


    const matchTable = await findParentElement({
      page,
      content: type,
      child: " span.title",
      parent: "div#zone-rightcolumn > div > div > div> div> div> div> div> div> div:not(.filters).list-minimarkets > div > div"
    }).catch(logger("error")) // TODO, undefined
    console.log("matchTable", !!matchTable) // TODO solo esistenza
    // await waitForLoad(page)



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
  //await abortMediaRequests(page)

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls({
    page,
    site: "http://sports.williamhill.it/bet_ita/it/betting/y/5/et/Calcio.html",
    day: "31 Mar",
    state: "Italia",
    tournament: "Serie A"
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
