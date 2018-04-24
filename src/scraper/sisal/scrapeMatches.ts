
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
import { oddsConstructor } from "@scraper/oddsConstructor"
import { getMatch } from "./getMatch"
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
  findElementFromElement
} from "@scraper/helpers"

import * as Debug from "debug";
const debug = Debug("scraper:sisal:scrapeActions");


export async function scrapeMatches({ page, site, days, tournaments, types }: { page: Page, site, days: string[] | "*", tournaments: string[], types }): Promise<Match[]> {
  let actions: string[] = []
  let matches: Match[] = []
  try {  // go to football
    for (let tournament of tournaments) {

      await page.goto(site);
      // await page.waitForNavigation({ waitUntil: "networkidle0" })
      await waitForLoad(page)

      // go to state


      await page.$("div#p_p_id_AlberaturaAntepost_WAR_scommesseportlet_ div.items > div > div > div:nth-child(1) > a")
        .then(resolveIf)
        .then(a => a.click())

      // await waitForLoad(page)
      // "div > li:nth-child(4) > a > h4"
      const stateTable = await findElement({
        page,
        content: tournament,
        selector: "div.event > a "
      }).then(resolveIf)
        .then((a) => a.click())

      await page.waitForNavigation({ waitUntil: "networkidle0" })
      // get the links of matches
      await waitForLoad(page)
      // await page.waitFor(5000)

      if (days === "*") {
        const values = await page.evaluate(
          () => [...document.querySelectorAll("div.event > div.detail > p.name > a[onclick]") as any]
            .map(element => element.getAttribute('onclick'))
        )
        actions.push(...values)
      }

      for (let action of actions) {

        await page.evaluate(action)

        const data = await waitData(page)

        const values: Match[] = types.map(
          type => getMatch(type, data)
        )

        await page.$("div#dettaglioAvvenimento div.chiudicampionato.btn-back > a")
          .then(resolveIf)
          .then(a => a.click())

        await waitForLoad(page)
        debug(values)

        matches.push(...values)
      }



    }
  } catch (e) { debug(Error(e)) }
  finally {
    debug(actions)
    return matches
  }
}


function waitData(page: Page): Promise<any> {
  return new Promise((resolve => {
    page.on('response', async res => {
      const req = res.request()
      if (req.method() === "GET"
        && req.resourceType() === "xhr"
      ) {
        const payload: Object = await res.json()
        if (payload.hasOwnProperty("scommesseClassicheList")) resolve(payload)
      }
    })
  }))
}
