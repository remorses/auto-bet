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
  const hrefs: string[] = await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue())))


  console.log(hrefs)

  return hrefs
}






async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);
  await waitForLoad(page)


  await page.$("a#collection25Show").then(a => a ? a.click() : null)
  await page.$("a#collection26Show").then(a => a ? a.click() : null)
  await page.$("a#collection178Show").then(a => a ? a.click() : null)
  await waitForLoad(page)



  let matches: Match[] = []
  await Promise.all(types.map(async (type: string) => {




    "div#primaryCollectionContainer div:nth-child(12) > table > thead > tr > th > span"
    "div#primaryCollectionContainer div:nth-child(12) > table > tbody > tr > td:nth-child(1) > div > div.eventselection"
    "div#primaryCollectionContainer div:nth-child(12) > table > tbody > tr > td:nth-child(2) > div > div.eventselection"


    const matchTable = await findParentElement({
      page,
      content: type,
      child: "  table > thead > tr > th > span",
      parent: "div#primaryCollectionContainer  div.marketHolderExpanded "
    }).catch(logger("error")) // TODO, undefined
    console.log("matchTable", !!matchTable) // TODO solo esistenza
    // await waitForLoad(page)





    const tournament: string = await page.$("ul#breadcrumb li:nth-child(4) > a")
      .then(resolveIf)
      .then(getContent)


    // get the odds, in an array
    const oddValues: number[] = await getChildren({
      page,
      element: matchTable,
      selector: "table > tbody > tr > td > div > div.eventprice"
    }).then(parseChildren)//.then(a => a.map(t => parseFloat(t.trim())))
      .then(logger("odds, with getChildren"))



    // get the odd roles (handicap value, under or over...)
    const roles: string[] = await getChildren({
      page,
      element: <any>matchTable,
      selector: "table > tbody > tr > td:nth-child(1) > div > div.eventselection"
    }).then(parseChildren)

    /*
        // get the odds, in an array
        const players: number[] = await getChildren({
          page,
          element: <any>page,
          selector: "div#contentHead > h2"
        }).then(parseChildren)
          .then(arr => arr.map(s => s.split("-")))
          .then(arr => arr.slice(0, -1))
          .then(logger("players, with getChildren"))
          */

    const players = await page.$("div#contentHead > h2")
      .then(resolveIf)
      .then(a => getContent(a))
      .then(s => s.split("-"))
      .then(arr => arr.slice(0, -1))
      .then(arr => arr.map(s => s.trim()))






    const metadata = {
      sport: "football",
      tournament: tournament,
      matchName: players.join(", "),
      date: "date",
      time: "time",
    }
    console.log(type)
    const odds = oddsConstructor({  type, oddValues, roles, url })

    const match = {
      site: "williamhill",
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
  /*
    const matches: Match[][] = await Promise.all(urls.map(url =>
      scrapeMatch({
        browser,
        url,
        types: ["Over/Under 2.5 Goal"]
      }))
    )
    */



  const matches: Match[] = await scrapeMatch({
    browser,
    url: urls[0],
    types: ["Over/Under 2.5 Goal"]
  })

  console.log(JSON.stringify(matches))


  // await browser.close()
})()
