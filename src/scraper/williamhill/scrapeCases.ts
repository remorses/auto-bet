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
  findParentElementFromElement,
  findElementFromElement
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
  }).then(parseChildren).then(a => a.map(t => parseFloat(t.trim())))


  // get the odd roles (handicap value, under or over...)
  const roles: string[] = await getChildren({
    page,
    element: <any>matchTable,
    selector: "table > tbody > tr > td > div > div.eventselection"
  }).then(parseChildren)
    .then(a => a.map(role => rawToPure("role", role, "williamhill")))


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

export const handicapCorners = async ({ page, matchTable, type, url }: { page, matchTable, type, url }): Promise<Match> => {


  const oddVariants: any[] = JSON.parse(type.split("_")[1])  // esempio "handicapCorner_['+3','-2']"  => ['+3','-2']

  // tournament name
  const tournament: string = await page.$("ul#breadcrumb li:nth-child(4) > a")
    .then(resolveIf)
    .then(getContent)

  const players = await page.$("div#contentHead > h2")
    .then(resolveIf)
    .then(a => getContent(a))
    .then(s => s.split("-"))
    .then(arr => arr.slice(0, -1))
    .then(arr => arr.map(s => s.trim()))

  // get the odds, in an array
  const oddValues: number[] = []
  const roles: string[] = []

  for (let [index, oddVariant] of oddVariants.entries()) {
    const content = players[index] + " " + oddVariant
    const rightRow = await findParentElementFromElement({
      page,
      grandParent: matchTable,
      parent: "table > tbody > tr > td > div",
      content,
      child: " div.eventselection"
    })
    const oddValue = await rightRow.$("div.eventprice")
      .then(getContent)
      .then(parseFloat)
      .catch(debug)

    if (!oddValue) continue
    const role = index === 0 ? "home_" + oddVariant : "away_" + oddVariant
    oddValues.push(oddValue)
    roles.push(role)
  }

  // XXX constructor
  const metadata = {
    sport: "football",
    tournament: tournament,
    matchName: players.join(", "),
    date: "date",
    time: "time",
  }
  let odds = oddsConstructor({
    players,
    type,
    roles,
    oddValues,
    url,
  })
  const match = {
    site: "williamhill",
    metadata,
    odds
  }
  return match
}
