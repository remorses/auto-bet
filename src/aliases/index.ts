
// system to convert the nomenclature of sites to pure
import { aliases } from "./aliases"

type Category = "oddType" | "role" | "tournament" | "dayNumber" | "dayWord" | "monthWord";
type Site = "williamhill" | "betfair" | "eurobet";


const rawToPure = (category: Category, raw: string, site?: Site, ): string => {
  if (!site) {
    for (let [key, obj] of Object.entries(aliases[category])) {
      for (let alias of Object.values(obj)) {
        if (alias === raw.trim()) return key
      }
    }
  } else {
    for (let [key, obj] of Object.entries(aliases[category])) {
      if (obj[site] === raw.trim()) return key
    }
  } return raw
}

const pureToRaw = (category: Category, pure: string, site: Site, ): string => {
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
