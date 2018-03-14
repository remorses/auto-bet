import { Page, ElementHandle, JSHandle } from 'puppeteer'
import * as puppeteer from 'puppeteer'
import { config, selectors } from "./config/betfair"
import { Match, Metadata, Odd, } from "./interfaces"
import * as Parallel from "async-parallel"

const getContent = async (element: ElementHandle): Promise<string> => {
  return await (await element.getProperty("textContent")).jsonValue()
}

const getHref = async (element: ElementHandle) => {
  try {
    await (await element.getProperty("href")).jsonValue()
  } catch (e) { console.error(e) }
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
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  for (let element of elements) {
    let inner = await getContent(element)
    console.log(inner.trim())
    if (inner.trim() === content) { return element }
  }
}

// XXX returns children of an <element> with a <selector>
interface getChildrenArgs {
  page: Page,
  element: JSHandle,
  selector: string
}
const getChildren = async ({ page, element, selector }: getChildrenArgs) => {
  const listHandle = await page.evaluateHandle((el, selector) => el.querySelectorAll(selector), element, selector);
  const properties = await listHandle.getProperties();
  const children: ElementHandle[] = [];
  for (const property of properties.values()) {
    const child = property.asElement();
    if (child)
      children.push(child);
  }
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
  try {
    await page.waitForSelector(parent + " " + child)
    console.log(parent + child)
    const elements: ElementHandle[] = await page.$$(parent)
    for (let element of elements) {
      let childElement = await element.$(child) // null TODO
      if (!childElement) continue
      let inner = await getContent(childElement)
      console.log(inner)
      if (inner.trim() === content) { return element }
    }
  } catch (e) { console.error("findParentElement: ", e) }
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

async function scrapeUrls(page: Page, giornata: string): Promise<string[]> {
  // go to football
  await page.goto("https://www.betfair.it/sport/football");

  // go to italia
  const button = await page.waitForSelector("div#zone-main a.ui-nav.browse-all-arrow > span")
  await button.click()
  await page.waitFor(2 * 1000);
  let italia = await findElement({
    page,
    content: "Italia",
    selector: "div#zone-main li > a > span.label"
  });

  await resolveIf(italia).then((a) => a.click())

  // go to serie A
  await page.waitFor(2 * 1000);
  let serieA = await findElement({
    page,
    content: "Italia - Serie A",
    selector: "div#zone-main li > span > a.ui-nav"
  });

  await resolveIf(serieA).then((a) => a.click())

  // get the links of matcches
  await page.waitFor(2 * 1000);
  const domaniTable = await findParentElement({
    page,
    content: giornata,
    child: "div > span.section-header-label",
    parent: "div#zone-main li "
  })
  const links: JSHandle[] = await getChildren({
    page,
    element: <any>domaniTable,
    selector: "ul > li > div > div.avb-col.avb-col-markets > a.ui-nav.markets-number-arrow.ui-top.event-link"
  });
  const hrefs: string[] = await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue())))
  console.log(hrefs)

  // XXX
  return hrefs
}



async function scrapeMatch({ page, browser, url }) {

  await browser.newPage();
  await page.goto(url);

  await page.waitForSelector("div#zone-rightcolumn a:nth-child(3)").then(a => a.click())
  const MatchTable = await findParentElement({
    page,
    content: "Handicap calci d'angolo",
    child: "div > div.minimarketview-header > div > div > div > span.title-icon-container > span.title",
    parent: "div#zone-rightcolumn div"
  });

  const parseChildren = (arr: ElementHandle[]) => {
    return Parallel.map(arr, el => getContent(el))
  }

  // get the players in an array of three
  const players: string[] = await getChildren({
    page,
    element: <any>MatchTable,
    selector: "div.minimarketview-content.ui-market.ui-expanded.ui-market-open > ul > li > span.runner-name"
  }).then(parseChildren)

  // get the odds, in an array
  const odds: string[] = await getChildren({
    page,
    element: <any>MatchTable,
    selector: "div.minimarketview-content.ui-market.ui-expanded.ui-market-open > ul > li > a > span"
  }).then(parseChildren)

  // get the odd types ( handicap value)
  const handicapTypes: string[] = await getChildren({
    page,
    element: <any>MatchTable,
    selector: "div.minimarketview-content.ui-market.ui-expanded.ui-market-open > ul > li > span.ui-runner-handicap"
  }).then(parseChildren)

  return

}




// XXX main logic
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage();

  // get the matches urls of a determinated tournament and day
  const urls: string[] = await scrapeUrls(page, "sabato, 17 marzo")

  // prendere le quote delle scommesse e inserirle nel database
  await Parallel.map(urls, url => scrapeMatch({ page, browser, url }))

  // await browser.close()
})()
