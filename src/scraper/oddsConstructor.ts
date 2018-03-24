// crea una match partendo da:
// un array di odds,
//
import { Match, Metadata, Odd, } from "@src/interfaces"
import { rawToPure } from "@scraper/aliases"


const float = (val) => typeof val === "string" ? parseFloat(val.trim()) : val


function oddsConstructor({ players, type, oddValues, roles, url }: { players?: string[] | null[], type, oddValues, roles?: string[], url }) {
  let odds: Odd[] = []
  if (!players) players = [null, null, null,]

  // 2 odds
  if (oddValues.length === 2) {
    if (!roles) roles = ["1", "2"]
    const odd1 = {
      type: rawToPure("oddType", type),
      role: roles[0],
      player: players[0],
      value: float(oddValues[0]),
      link: url

    }
    const odd2 = {
      type: rawToPure("oddType", type),
      role: roles[1],
      player: players[1],
      value: float(oddValues[1]),
      link: url
    }

    odds.push(odd1, odd2)
  }

  // 3 odds
  if (oddValues.length === 3) {
    if (!roles) roles = ["1", "x", "2"]
    const odd1 = {
      type: rawToPure("oddType", type),
      role: roles[0],
      player: players[0],
      value: float(oddValues[0]),
      link: url

    }
    const oddx = {
      type: rawToPure("oddType", type),
      role: roles[1],
      player: "none",
      value: float(oddValues[1]),
      link: url
    }
    const odd2 = {
      type: rawToPure("oddType", type),
      role: roles[2],
      player: players[1],
      value: float(oddValues[2]),
      link: url
    }

    odds.push(odd1, oddx, odd2)
  }



  return odds

}


export { oddsConstructor }
