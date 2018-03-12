import { Page, ElementHandle, JSHandle } from 'puppeteer'
import * as puppeteer from 'puppeteer'
import { config, selectors } from "./config/betfair"
import { Match, Metadata, Odd, } from "./interfaces"


const getContent = async (element: ElementHandle) => {
  try {
    return await (await element.getProperty("textContent")).jsonValue()
  } catch (e) { console.error("getContent: ", e) }
}

const getHref = async (element: ElementHandle) => {
  try {
    await (await element.getProperty("href")).jsonValue()
  } catch (e) { console.error(e) }
}


const resolveIf = async (bool: any) => {
  if (bool) { return bool }
  else {
    setTimeout(async () => { return bool }, 500)
  }
}

const findElement = async (page: Page, content: string, selector: string, ) => {
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  for (let element of elements) {
    let inner = await getContent(element)
    console.log(inner.trim())
    if (inner.trim() === content) { return element }
  }
}

const getChildren_ = async (page, element: JSHandle, selector) => {
  const values: JSHandle = await page.evaluateHandle(
    (element, selector) => element.querySelectorAll(selector), element, selector);
  return (values)
}

const getChildren = async (page, element, selector) => {
  const listHandle = await page.evaluateHandle((el, selector) => el.querySelectorAll(selector), element, selector);
  const properties = await listHandle.getProperties();
  const children: JSHandle[] = [];
  for (const property of properties.values()) {
    const child = property.asElement();
    if (child)
      children.push(child);
  }
  return children;
}


const getAttribute = async (page, element: JSHandle, attribute): Promise<JSHandle> => {
  const value = await page.evaluateHandle((element, attribute) => element.attribute, element, attribute);
  return value
}


const findParentElement = async (page: Page, content: string, child, parent) => {
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


async function scrape(page: Page) {

  // await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

  /*
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

  // go to football
  await page.goto("https://www.betfair.it/sport/football");

  // go to italia
  const button = await page.waitForSelector("div#zone-main a.ui-nav.browse-all-arrow > span")
  await button.click()
  await page.waitFor(2 * 1000);
  let italia = await findElement(page, "Italia", "div#zone-main li > a > span.label", )
  await resolveIf(italia).then((a) => a.click())

  // go to serie A
  await page.waitFor(2 * 1000);
  let serieA = await findElement(page, "Italia - Serie A", "div#zone-main li > span > a.ui-nav")
  await resolveIf(serieA).then((a) => a.click())

  // get the links of matcches
  await page.waitFor(2 * 1000);
  const giorno = "sabato, 17 marzo"
  const domaniTable = await findParentElement(page, giorno, "div > span.section-header-label", "div#zone-main li ")
  const links: JSHandle[] = await getChildren(page, domaniTable, "ul > li > div > div.avb-col.avb-col-markets > a.ui-nav.markets-number-arrow.ui-top.event-link");
  const hrefs: string[] = await Promise.all(links.map(link => link.getProperty("href").then(href => href.jsonValue())))
  console.log(hrefs)
}

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage();

  await scrape(page)
  // await browser.close()
})()
