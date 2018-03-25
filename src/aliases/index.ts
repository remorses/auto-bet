
// system to convert the nomenclature of sites to pure
import { aliases } from "./aliases"

type Category = "oddType" | "role" | "tournament" | "dayNumber" | "dayWord" | "month";
type Site = "williamhill" | "betfair";


const rawToPure = (category: Category, raw: string): string => {
  for (let [key, obj] of Object.entries(aliases[category])) {
    for (let alias of Object.values(obj)) {
      if (alias == raw.trim()) return key
    }
  }
  return raw
}

const pureToRaw = (category: Category, site: Site, pure: string): string => {
  for (let [key, obj] of Object.entries(aliases[category])) {
    // console.log("obj ", obj)
    if (key === pure) return obj[site]
  }
  return pure
}


export { rawToPure, pureToRaw }



// XXX
/*

role:   raw => pure,   (pure, site) => raw

date:   raw => pure,   (pure, site) => raw

*/
