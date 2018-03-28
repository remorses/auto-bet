import { Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { when, observable, action, reaction } from "mobx"
import * as Parallel from "async-parallel"



// invece di waitFor
const waitForLoad = (page: Page) => new Promise((resolve) => {
  page.on('request', (req) => {
    setTimeout(() => resolve("timeOut"), 500)
  })
  setTimeout(() => resolve("timeOut"), 2500)
})




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
  reaction(() => updates.value, (value) => console.log(value))
}






// get child content
const getChildContent = async ({ page, parent, selector }) => {
  let results: string[] = []
  const elements: ElementHandle[] = await parent.$$(selector)
  if (elements.length < 1) throw new Error("can't proceed, no elements")
  for (let element of elements) {
    let inner: string = await getContent(element)
    console.log(inner)
    results.push(inner)
  }
  return results
}






const findParentElement = async ({ page, content, child, parent }: { page: Page, content: string, child: string, parent: string }) => {
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



export const findParentElementFromElement = async ({ page, grandParent, content, child, parent }: { page: Page,grandParent: ElementHandle,  content: string, child: string, parent: string }) => {
  let result
  try {
    // console.log(parent + child)
    const elements: ElementHandle[] = await grandParent.$$(parent)
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


// XXX returns children of an <element> with a <selector>
const getChildren = async ({ page, element, selector }: { page: Page, element: JSHandle, selector: string }): Promise<ElementHandle[]> => {
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





const findElement = async ({ page, content, selector }: { page: Page, content: string, selector: string }) => {
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




const getContent = async (element: ElementHandle): Promise<string> => {
  if (!element) throw new Error("getContent: no element where get the content")
  return (await (await element.getProperty("innerHTML")).jsonValue()).trim()
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




const getAttribute = async (page: Page, element: ElementHandle, attribute): Promise<JSHandle> => {
  const value = await page.evaluateHandle((element, attribute) => element.attribute, element, attribute);
  return value
}


const abortMediaRequests = async (page) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === "media" || req.resourceType() === "image")
      req.abort();
    else
      req.continue();
  });
}


export {
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
  abortMediaRequests
}
