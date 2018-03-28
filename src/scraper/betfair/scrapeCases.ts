import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { oddsConstructor } from "@scraper/oddsConstructor"
import { rawToPure, pureToRaw } from "@aliases/index"
import { Match, Metadata, Odd, } from "@src/interfaces"
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
  abortMediaRequests,
  findParentElementFromElement
} from "@scraper/helpers"


import * as Debug from "debug";
const debug = Debug("scraper:betfair:scrapeCases");

// il checker compara tutte le match che hanno role diverso, quindi basta inserire un role univoco senza pensare al significato, può essere il giocatore oppure
// la variante di scommessa (under oppure over) senza preoccuparsi troppo.
// per gli handicap corner invece bisogna stare attenti,
// devo raggruppare le scommesse in gruppi diversi da quelli sul sito, i gruppi sono: +2 & -1, +3 & -2, +5  & -4,
// quindi dovrò inserire una decina di diverse oddType per ogni caso possibile e nel momento di odds constructor, lasciare una parte di bet nulla se non c'è la
// scommessa corrispondente sul sito.

export const singleLine = async ({ page, matchTable, type, url }): Promise<Match> => {
  // get the players in an array of three
  const roles: string[] = await getChildContent({
    page,
    parent: matchTable,
    selector: " span.runner-name"
  }).then(logger("players, before parse")).catch(logger("error")) // TODO niente, array vuoto

  // get the players in an array of three
  const players = [
    await page.$("td.home-runner").then(getContent),
    await page.$("td.away-runner").then(getContent)]

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

  // XXX Match constructor
  const metadata = {
    sport: "football",
    tournament: tournament,
    matchName: players.join(", "),
    date: "date",
    time: "time",
  }
  const odds = oddsConstructor({
    players,
    type,
    oddValues,
    url,
    roles
  })
  const match = {
    site: "betfair",
    metadata,
    odds
  }
  return match
}

// TODO:
/*
quando ci sono 2 squadre opposte con lo stesso handicap queste saranno aggiunte nell
*/
export const handicapCorners = async ({ page, matchTable, type, url }): Promise<Match[]> => {

  // get the players in an array of three
  const players = [
    await page.$("td.home-runner").then(getContent),
    await page.$("td.away-runner").then(getContent)]

  // tournament
  const tournament: string = await page.$("div#zone-leftcolumn div:nth-child(1) > div > div > div > a > span")
    .then(a => a ? getContent(a) : "Error")

  let matches: Match[] = []

  // prendo la variante di scommessa
  const oddVariants = JSON.parse(type.split("_")[1])   // esempio "handicapCorner_['+3','-2']"  => ['+3','-2']
  for (let [index, oddVariant] of oddVariants.entries()) {

    /*  // get the odds, in an array
      let rightRow = await findParentElementFromElement({
        page,
        content: oddVariant,
        grandParent: matchTable,
        parent: " li",
        child: "span.ui-runner-handicap"
      })*/
    let rightRow
    let role
    if (index === 0) rightRow = await matchTable.$(" li:nth-child(1) "); role = "home_" + oddVariant
    if (index === 1) rightRow = await matchTable.$(" li:nth-child(3) "); role = "away_" + oddVariant
    debug("rightRow", !!rightRow) // TODO solo esistenza

    let oddValue = await rightRow.$("span.ui-runner-price")
      .then(getContent)
      .then(a => a.trim())
      .then(parseFloat)
      .catch(debug)
    /*
        let role = await rightRow.$(" span.runner-name")
          .then(getContent)
          .then(a => a.trim())
          .then(rol => rol + oddVariant) // Es. Bologna +2  // così non può accadere che raggruppo squadre opposte ma con lo stesso handicap
          .catch(debug)*/

    // XXX Match constructor
    const metadata = {
      sport: "football",
      tournament: tournament,
      matchName: players.join(", "),
      date: "date",
      time: "time",
    }
    const odds = oddsConstructor({ players, roles: [role], type, oddValues: [oddValue], url })
    const match = {
      site: "betfair",
      metadata,
      odds
    }
    matches.push(match)

  }

  return matches

}


export const multipleLines = async ({ page, matchTable, type, url }) => {
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
}
