
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


    // find the table element, with right type
    const matchTable = await findParentElement({
      page,
      content: type,
      child: "  table > thead > tr > th > span",
      parent: "div#primaryCollectionContainer  div.marketHolderExpanded "
    }).catch(logger("error")) // TODO, undefined
    console.log("matchTable", !!matchTable) // TODO solo esistenza


    // tournament name
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


    const players = await page.$("div#contentHead > h2")
      .then(resolveIf)
      .then(a => getContent(a))
      .then(s => s.split("-"))
      .then(arr => arr.slice(0, -1))
      .then(arr => arr.map(s => s.trim()))

    // XXX constructor
    const metadata = {
      sport: "football",
      tournament: tournament,
      matchName: players.join(", "),
      date: "date",
      time: "time",
    }
    const odds = oddsConstructor({ type, oddValues, roles, url })
    const match = {
      site: "williamhill",
      metadata,
      odds
    }

    matches.push(match)
  }))
  return matches
}


export { scrapeMatch }
