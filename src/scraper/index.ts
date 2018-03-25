
import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
import * as YAML from "yamljs"

import * as Debug from "debug";
const debug = Debug("scraper");

const adapter = new FileSync('./src/db.json');
const db = low(adapter);
/*const adapter = new FileSync('./src/db.yaml', {
  defaultValue: [],
  serialize: (array) => YAML.stringify(array),
  deserialize: (string) => YAML.parse(string)
})*/

const options = {
  width: 1000,
  height: 1000
};

// XXX main logic
const run = async () => {
  debug("start")


  const browser = await launch({
    headless: false,
    args: [
      `--window-size=${options.width},${options.height}`
    ],
  });



  const williamhill = await import("@williamhill/index")
  const betfair = await import("@betfair/index")


  let scraperQueue: Match[] = await Promise.all(
    [
      betfair.run(browser, options),
      williamhill.run(browser, options),
    ]
  ).then(arr => arr.reduce((a, b) => a.concat(b)))



  console.log(JSON.stringify(scraperQueue))

  if (scraperQueue.length > 0) {
    db.get("scraperQueue")
      .push(...scraperQueue)
      .write()
  }

  await browser.close()
}


export { run }
