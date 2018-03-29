import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { oddsConstructor } from "@scraper/oddsConstructor"
import { rawToPure, pureToRaw } from "@aliases/index"
import { Match, Metadata, Odd, } from "@src/interfaces"
import * as moment from "moment"
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
  findParentElementFromElement
} from "@scraper/helpers"


import * as Debug from "debug";
const debug = Debug("scraper:betfair:scrapeCases");


export const singleLine = async ({ page, matchTable, type, url, doRoles = false }: { page, matchTable, type, url, doRoles?: boolean }): Promise<Match> => {


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
    selector: "table > tbody > tr > td > div > div.eventselection"
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
  let odds
  if (!doRoles) {
    odds = oddsConstructor({
      players,
      type,
      oddValues,
      url,
    })
  } else {
    odds = oddsConstructor({
      players,
      type,
      oddValues,
      url,
      roles
    })
  }
  const match = {
    site: "williamhill",
    metadata,
    odds
  }
  return match
}
