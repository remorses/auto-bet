import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import * as puppeteer from 'puppeteer'
import { config, selectors } from "./config/betfair"
import { Match, Metadata, Odd, } from "./interfaces"
import * as Parallel from "async-parallel"
import { when, observable, action, reaction } from "mobx"
import { Observable, Subject } from "rxjs"


const getContent = async (element: ElementHandle): Promise<string> => {
  if (!element) throw new Error("no element where get the content")
  return await (await element.getProperty("innerHTML")).jsonValue()
}

const parseChildren = (arr: ElementHandle[]) => {
  return Promise.all(arr.map(el => getContent(el)))
}

const getHref = async (element: ElementHandle) => {
  try {
    await (await element.getProperty("href")).jsonValue()
  } catch (e) { console.error(e) }
}

const logger = (text) => (a) => {
  console.log(text, " : ", a);
  return a
}

// XXX
const resolveIf = async (bool: any) => {
  if (bool) { return bool }
  else {
    setTimeout(async () => { return bool }, 500)
  }
}

// XXX
interface findElementArgs {
  page: Page,
  content: string,
  selector: string
}
const findElement = async ({ page, content, selector }: findElementArgs) => {
  try {
    await page.waitForSelector(selector)
    const elements: ElementHandle[] = await page.$$(selector)
    for (let element of elements) {
      let inner = await getContent(element)
      //  console.log(inner.trim())
      if (inner.trim() === content) { console.log(inner, ", findElement"); return element }
    }
  } catch (e) { console.log(e) }
}

// XXX returns children of an <element> with a <selector>
interface getChildrenArgs {
  page: Page,
  element: JSHandle,
  selector: string
}
const getChildren = async ({ page, element, selector }: getChildrenArgs) => {
  let children: ElementHandle[] = [];
  try {
    if (!element) throw new Error("can't proceed getChildren(), no element")
    const listHandle = await page.evaluateHandle((element, selector) => element.querySelectorAll(selector), element, selector);
    if (!listHandle) throw new Error("can't proceed getChildren(), no children")
    const properties = await listHandle.getProperties();
    for (const property of properties.values()) {
      const child = property.asElement();
      if (child) {
        children.push(child);
        console.log(await getContent(child), " ,get children")
      }
    }
  } catch (e) { console.log(e) }
  return children;
}

const getAttribute = async (page: Page, element: ElementHandle, attribute): Promise<JSHandle> => {
  const value = await page.evaluateHandle((element, attribute) => element.attribute, element, attribute);
  return value
}

// XXX
interface findParentElementArgs {
  page: Page,
  content: string,
  child: string,
  parent: string
}
const findParentElement = async ({ page, content, child, parent }: findParentElementArgs) => {
  let result
  try {
    await page.waitForSelector(parent + " " + child)
    // console.log(parent + child)
    const elements: ElementHandle[] = await page.$$(parent)
    if (elements.length < 1) throw new Error("can't proceed, no elements")
    for (let element of elements) {
      let childElement = await element.$(child) // null TODO
      if (!childElement) continue
      let inner = await getContent(childElement)
      console.log("find parent: ", inner, )
      if (inner.trim() === content) { result = element; break } else { continue }
    }
  } catch (e) { console.error("findParentElement: ", e) }
  return result
}


const getChildContent = async ({ page, parent, selector }) => {
  let results = []
  const elements: ElementHandle[] = await parent.$$(selector)
  if (elements.length < 1) throw new Error("can't proceed, no elements")
  for (let element of elements) {
    let inner: string = await getContent(element)
    console.log(inner)
    results.push(inner)
  }
  return results
}

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
interface scrapeUrlsArgs {
  page: Page, giornata: string, tournament: string
}
async function scrapeUrls({ page, day, state, tournament }): Promise<string[]> {
  // go to football
  await page.goto("https://www.betfair.it/sport/football");

  // go to italia
  const button = await page.waitForSelector("div#zone-main a.ui-nav.browse-all-arrow > span")
  await button.click()
  // await page.waitFor(2 * 1000);
  await waitForLoad(page)
  let italia = await findElement({
    page,
    content: state,
    selector: "div#zone-main li > a > span.label"
  });

  await resolveIf(italia).then((a) => a.click())

  // go to serie A
  // await page.waitFor(2 * 1000);
  await waitForLoad(page)
  let serieA = await findElement({
    page,
    content: tournament,
    selector: "div#zone-main li > span > a.ui-nav"
  });

  await resolveIf(serieA).then((a) => a.click())

  // get the links of matches
  // await page.waitFor(2 * 1000);
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

  // XXX
  return hrefs
}

// XXX solo per la modalità live, ogni volta che arrivano le nuove quote
// eseguo lo scrape. Devo anche separare la funzione scrape da new page, dentro il map().
function whenUpdated(page) {
  let updates = observable({ value: 0 })
  page.on('requestfinished', req => {
    if (req.method() === "GET"
      && req.resourceType() === "xhr"
      && req.headers().accept === "application/json") {
      action(() => updates.value++)()
    }
  })
  reaction(() => updates.value, (value) => console.log(value))
}


// invece di waitFor
const waitForLoad = (page) => new Promise((resolve) => {
  page.on('rquest', (req) => {
    waitForLoad(page)
  })
  page.on('requestfinished', (req) => {
    setTimeout(() => resolve("timeOut"), 800)
  })
})

async function scrapeMatch({ browser, url, type }) {
  const page = await browser.newPage();
  await page.goto(url);


  whenUpdated(page)



  // await page.waitFor(2 * 1000);
  await waitForLoad(page)
  await page.waitForSelector("div#zone-rightcolumn a:nth-child(3)").then(a => a.click())

  // await page.waitFor(2 * 1000);
  await waitForLoad(page)
  const matchTable = await findParentElement({
    page,
    content: type,
    child: " span.title",
    parent: "div#zone-rightcolumn > div > div > div> div> div> div> div> div> div:not(.filters).list-minimarkets > div > div"
  }).catch(logger("error")) // TODO, undefined
  console.log("matchTable", !!matchTable) // TODO solo esistenza


  "div#zone-rightcolumn div:nth-child(35) > div > div.minimarketview-header > div > div > div > span.title-icon-container > span"
  "div#zone-rightcolumn div.minimarketview-content.ui-market.ui-market-open.ui-expanded > ul > li:nth-child(1) > span.runner-name"

  console.log("arrivato dopo matchTable")
  // get the players in an array of three
  // await page.waitFor(2 * 1000);
  await waitForLoad(page)
  const players: string[] = await getChildContent({
    page,
    parent: matchTable,
    selector: " span.runner-name"
  }).then(logger("players, before parse")).catch(logger("error")) // TODO niente, array vuoto



  // get the odds, in an array
  const odds: string[] = await getChildren({
    page,
    element: <any>matchTable,
    selector: "ul > li > a > span.ui-runner-price"
  }).then(parseChildren).then(logger("odds, with getChildren"))

  /*
      // get the odd types ( handicap value)
      const handicapTypes: string[] = await getChildren({
        page,
        element: <any>matchTable,
        selector: "div.minimarketview-content.ui-market.ui-expanded.ui-market-open > ul > li > span.ui-runner-handicap"
      }).then(parseChildren)
    */
  return

}




// XXX main logic
(async () => {
  // Viewport && Window size
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

  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === "media" || req.resourceType() === "image")
      req.abort();
    else
      req.continue();
  });

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls({
    page,
    day: "giovedì, 05 aprile",
    state: "UEFA Europa League",
    tournament: "UEFA Europa League"
  })

  /*
await Promise.all(urls.map(url => scrapeMatch({
  browser,
  url,
  type: "Handicap calci d'angolo"
})))
*/
  await scrapeMatch({
    browser,
    url: urls[0],
    type: "Rigore Si/No"
  })

  // await browser.close()
})()


// cose che servono
// XXX scrapeMatch  = async (url, type) => Match
//
