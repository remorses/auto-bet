
import * as R from "ramda"
import { rawToPure, pureToRaw } from "@aliases/index"
import * as Debug from "debug";
const debug = Debug("scraper:eurobet:getMatch");

const LINK = ""
const SITE = "eurobet"
const SPORT = "soccer"

export const removeTrash = arr => !arr ? Boolean(arr) : (arr[0] && arr.length)

// from oddGroupList
const getOdds = (type, betDescription, oddGroupList) => {
  return oddGroupList.map(({ oddGroupDescription, oddList }) => {

    if (oddGroupDescription === betDescription) {
      // debug(rawToPure("oddType", betDescription, SITE), "dovrebbe essere", type)
      if (type === rawToPure("oddType", betDescription, SITE)) {
      // debug("trovato '" + type + "'")
        return oddList.map(obj => getOdd(type, obj))
      } // else debug(`no ${type} in data`)
    } else {
      const rawType = betDescription + "_" + oddGroupDescription
      if (type === rawToPure("oddType", rawType, SITE)) {
        return oddList.map(obj => getOdd(type, obj))
      }
    }
  }).filter(removeTrash)
}

// from oddList
const getOdd = (type, { oddDescription, oddValue }) => {
  const getRole = rawToPure("role", oddDescription, SITE)
  const getValue = oddValue * Math.pow(10, 1 - 3)
  return {
    type: type,
    role: getRole,
    player: null,
    value: getValue,
    link: LINK
  }
}

// from eventInfo
const getMetadata = (type, { teamAway, teamHome, meetingDescription }) => {
  const matchName = teamAway.description + ", " + teamHome.description
  return {
    sport: SPORT,
    tournament: rawToPure("tournament", meetingDescription, SITE),
    matchName,
    date: "",
    time: "",
  }
}

// from betGroupList
export const getMatch = (type, data) => {
  const betGroupList: any = R.path(["result", "betGroupList"], data)
  const eventInfo: any = R.path(["result", "eventInfo"], data)
  const metadata = getMetadata(type, eventInfo)
  const odds = betGroupList
    .map(({ betDescription, oddGroupList }) =>
      getOdds(type, betDescription, oddGroupList))
    .filter(removeTrash)

  return {
    site: SITE,
    metadata: metadata,
    odds: R.flatten(odds)
  }
}
