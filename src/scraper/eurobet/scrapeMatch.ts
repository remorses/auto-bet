
import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure, pureToRaw } from "@aliases/index"
import {
  findParentElement,
  waitForLoad,
  logger
} from "@scraper/helpers"
import { getMatch, removeTrash } from "./getMatch"

import * as Debug from "debug";
const debug = Debug("scraper:eurobet:scrapeMatch");



async function scrapeMatch({ browser, url, types }: { browser: Browser, url: string, types: string[] }) {

  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector("div.filtri-sport > div > ul > li:nth-child(12) > a").then(a => a.click())

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
