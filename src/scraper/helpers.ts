import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
// import { when, observable, action, reaction } from "mobx"
import * as Debug from "debug";
const debug = Debug("scraper:helpers");

// invece di waitFor
export const waitForLoad = (page: Page) => new Promise((resolve) => {
  page.on('request', (req) => {
    setTimeout(() => resolve("timeOut"), 600)
  })
  setTimeout(() => resolve("timeOut"), 2500)
})

/*
// mobx
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
  reaction(() => updates.value, (value) => debug(value))
}*/

// get child content
export const getChildContent = async ({ page, parent, selector }) => {
  let results: string[] = []
  const elements: ElementHandle[] = await parent.$$(selector)
  if (elements.length < 1) throw new Error(`can't proceed getChildContent for ${selector}, no elements`)
  for (let element of elements) {
    let inner: string = await getContent(element)
    // debug(inner)
    results.push(inner)
  }
  return results
}


export const findParentElement = async ({ page, content, child, parent }: { page: Page, content: string, child: string, parent: string }) => {
  let result
  // await page.waitForSelector(parent + " " + child)
  const elements: ElementHandle[] = await page.$$(parent)
  if (elements.length < 1) throw new Error(`can't proceed findParentElement for ${content}, no elements`)
  for (let element of elements) {
    let childElement = await element.$(child) // null TODO
    if (!childElement) continue
    let inner = await getContent(childElement)
    // debug("find parent: ", inner, )
    if (inner.trim() === content) { result = element; break } else { continue }
  }
  return result
}


export const findParentElementFromElement = async ({ page, grandParent, content, child, parent }: { page: Page, grandParent: ElementHandle, content: string, child: string, parent: string }) => {
  let result
  // debug(parent + child)
  const elements: ElementHandle[] = await grandParent.$$(parent)
  if (elements.length < 1) throw new Error(`can't proceed findParentElementFromElement for ${content}, no elements`)
  for (let element of elements) {
    let childElement = await element.$(child) // null TODO
    if (!childElement) continue
    let inner = await getContent(childElement)
    // debug("find parent: ", inner, )
    if (inner.trim() === content) { result = element; break } else { continue }
  }
  return result
}


// XXX returns children of an <element> with a <selector>
export const getChildren = async ({ page, element, selector }: { page: Page, element: JSHandle, selector: string }): Promise<ElementHandle[]> => {
  let children: ElementHandle[] = [];
  if (!element) throw new Error(`can't proceed getChildren for ${selector}, no element`)
  const listHandle = await page.evaluateHandle((element, selector) => element.querySelectorAll(selector), element, selector);
  if (!listHandle) throw new Error(`can't proceed getChildren for ${selector}, no children`)
  const properties = await listHandle.getProperties();
  for (const property of properties.values()) {
    const child = property.asElement();
    if (child) {
      children.push(child);
      // debug(await getContent(child), " ,get children")
    }
  }
  return children;
}


export const findElement = async ({ page, content, selector }: { page: Page, content: string, selector: string }) => {
  await page.waitForSelector(selector)
  const elements: ElementHandle[] = await page.$$(selector)
  if (elements.length < 1) throw new Error(`can't proceed findElement for ${content}, no elements`)
  for (let element of elements) {
    let inner = await getContent(element)
    //  debug(inner.trim())
    if (inner.trim() === content) {
    // debug(inner, ", findElement");
    return element }
  }
}


export const getContent = async (element: ElementHandle): Promise<string> => {
  const inner = await  element.getProperty("innerHTML")
  if (!inner) throw new Error(`can't proceed getContent, no inner`)
  return (await inner.jsonValue()).trim()
}


export const parseChildren = (arr: ElementHandle[]) => {
  return Promise.all(arr.map(el => getContent(el)))
}


export const getHref = async (element: ElementHandle): Promise<string> => {
  const href = await element.getProperty("href")
  if (!href) throw new Error(`can't proceed getContent, no href`)
  return await href.jsonValue()
}


export const logger = (text) => (a) => {
   debug(text, ": ", a);
  return a
}


// XXX
export const resolveIf = async (bool: any) => {
  if (bool) { return bool }
  else {
    setTimeout(async () => { return bool }, 800)
  }
}


export const getAttribute = async (page: Page, element: ElementHandle, attribute): Promise<JSHandle> => {
  const value = await page.evaluateHandle((element, attribute) => element.attribute, element, attribute);
  return value
}


export const abortMediaRequests = async (page) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === "media" || req.resourceType() === "image")
      req.abort();
    else
      req.continue();
  });
}
