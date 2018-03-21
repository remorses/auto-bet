// crea una match partendo da:
// un array di odds,
//
import { Match, Metadata, Odd, } from "./interfaces"
import { getAliasType, rawToPure } from "./aliases"
import * as assert from "assert"

function oddsConstructor({ players, type, oddValues, url }) {
  let odds: Odd[] = []


  // 2 odds
  if (oddValues.length === 2) {
    const odd1 = {
      type: rawToPure(type),
      role: "1",
      player: players[0],
      value: oddValues[0],
      link: url

    }
    const odd2 = {
      type: rawToPure(type),
      role: "2",
      player: players[1],
      value: oddValues[1],
      link: url
    }

    odds.push(odd1, odd2)
  }

  // 3 odds
  if (oddValues.length === 3) {
    const odd1 = {
      type: rawToPure(type),
      role: "1",
      player: players[0],
      value: oddValues[0],
      link: url

    }
    const oddx = {
      type: rawToPure(type),
      role: "x",
      player: "none",
      value: oddValues[1],
      link: url
    }
    const odd2 = {
      type: rawToPure(type),
      role: "2",
      player: players[1],
      value: oddValues[2],
      link: url
    }

    odds.push(odd1, oddx, odd2)
  }



  return odds

}


export { oddsConstructor }
