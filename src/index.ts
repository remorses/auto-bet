

import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
const adapter = new FileSync('./db.json')
const db = low(adapter);

(async () => {
  const scraper = await import("@scraper/index")
  const grouper = await import("@grouper/index")
  const checker = await import("@checker/index")
  const placer = await import("@placer/index")


  // init all database data
  db.set("scraperQueue", [])
    .set("grouperQueue", [])
    .set("checkerQueue", [])
    .write()


  await scraper.run()
  await grouper.run()
  await checker.run()
  // await placer.run()

})()
