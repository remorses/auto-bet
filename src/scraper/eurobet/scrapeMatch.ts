
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
import {
  findParentElement,
  waitForLoad,
  findElement,
  resolveIf
} from "@scraper/helpers"
import { getMatch, removeTrash } from "./getMatch"

import * as Debug from "debug";
const debug = Debug("scraper:eurobet:scrapeMatch");

function waitData(page: Page): Promise<any> {
  return new Promise((resolve => {
    page.on('response', async res => {
      const req = res.request()
      // debug(req)
      if (req.method() === "GET"
        && req.resourceType() === "xhr"
      ) {
        const payload: Object = await res.json()
        if (payload.hasOwnProperty("result")) resolve(payload)
      }
    })
  }))
}

async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }): Promise<Match[]> {

  const page = await browser.newPage();
  await page.goto(url);
  await waitForLoad(page)


  // await page.waitForSelector("div.filtri-sport > div > ul > li:nth-child(12) > a")
  await findElement({
    page,
    content: "TUTTE",
    selector: "div.filtri-sport > div > ul > li > a"
  }).then(resolveIf)
    .then(a => a.click())

  const data = await waitData(page)
  // debug(data)
  // await waitForLoad(page)



  const matches = await Promise.all(
    types.map(
      async type => getMatch(type, data)
    ))

  await page.close()
  // debug(matches)
  return matches //.filter(removeTrash)
}


export { scrapeMatch }
