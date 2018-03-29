
import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as YAML from 'json2yaml'

import * as Debug from "debug";
const debug = Debug("scraper:index");

const adapter = new FileSync('./src/output.json');


/*const adapter = new FileSync('./src/output.yaml', {
  defaultValue: "",
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

      williamhill.run({
        browser,
        options,
        days: ["31 Mar"],
        state: "Italia",
        tournaments: ["Serie A"],
        types: ["underOver_2.5"]
      })
    ]
  ).then(arr => arr.reduce((a, b) => a.concat(b)))



  console.log(JSON.stringify(scraperQueue))
  // Set some defaults (required if your JSON file is empty)
  const db = low(adapter);

  db.defaults({ outputs: [] })
    .write()

  // Add a post
  db.get('outputs')
    .push(scraperQueue)
    .write()

  /*if (scraperQueue.length > 0) {
    db.get("scraperQueue")
      .push(...scraperQueue)
      .write()
  }*/

  //await browser.close()
}


export { run }
