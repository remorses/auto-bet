
import { launch, Page, ElementHandle, JSHandle, Browser, Request, Response } from 'puppeteer'
import { Match, Metadata, Odd, } from "@src/interfaces"
import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as YAML from 'json2yaml'
import * as Parallel from "async-parallel"
import * as Debug from "debug";
const debug = Debug("scraper:index");
import { handicaps } from "@aliases/aliases"
const adapter = new FileSync('./src/db.json');


/*const adapter = new FileSync('./src/output.yaml', {
  defaultValue: "",
  serialize: (array) => YAML.stringify(array),
  deserialize: (string) => YAML.parse(string)
})*/

const options = {
  width: 400,
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
  const eurobet = await import("@eurobet/index")
  const sisal = await import("@sisal/index")


  let scraperQueue: Match[] = await Promise.all(
    [/*await eurobet.run({
      browser,
      options,
      days: "*",
      state: "Italia",
      tournaments: ["Serie A"],
      types: ["rigore_yesNo", "ris esatto"]
    }),
    await williamhill.run({
      browser,
      options,
      days: "*",
      state: "Italia",
      tournaments: ["Serie A"],
      types: ["underOver_2.5", "underOver_1.5", "rigore_yesNo", "goal_yesNo", 'handicapCorners_["-4","+5"]']
    }),
    await betfair.run({
      browser,
      options,
      days: "*",
      state: "Italia",
      tournaments: ["Italia - Serie A"],
      types: ["rigore_yesNo", ...handicaps]
    }),*/
    await sisal.run({
      browser,
      options,
      days: "*",
      tournaments: ["ITA Serie A"],
      types: ["rigore_yesNo","goal_yesNo" ]
    }),
    ]
  ).then(arr => arr.reduce((a, b) => a.concat(b)))



  debug(scraperQueue)
  // Set some defaults (required if your JSON file is empty)
  const db = low(adapter);


  db.defaults({
    "scraperQueue": [],
    "grouperQueue": [],
    "checkerQueue": []
  })
    .write()

  /*
    // testing purpose


      db.defaults({ outputs: [] })
        .write()

    db.get('outputs')
      .push(...scraperQueue)
      .write()
      */

  if (scraperQueue.length > 0) {
    db.get("scraperQueue")
      .push(...scraperQueue)
      .write()
  }

  //await browser.close()
}


export { run }
