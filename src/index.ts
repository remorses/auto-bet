import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'


const adapter = new FileSync('./src/db.json');
const db = low(adapter);



// XXX main logic
(async () => {
  // await import("@williamhill/index")
   await import("@grouper/index")
})()
