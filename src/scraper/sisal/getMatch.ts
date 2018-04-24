
import * as R from "ramda"
import { rawToPure, pureToRaw } from "@aliases/index"
import * as Debug from "debug";
const debug = Debug("scraper:eurobet");

const LINK = ""
const SITE = "sisal"
const SPORT = "soccer"

const removeTrash = arr => !arr ? Boolean(arr) : (arr[0] && arr.length)

// from infoAggList[]
const getOdds = (type, descrizioneScommessa, infoAggList) => {
  return infoAggList.map(({ descrizione, esitoList }) => {
    if (type === rawToPure("oddType", descrizione, SITE)) {
      return esitoList.map(obj => getOdd(type, obj))
    }
  })
    .filter(removeTrash)
}

// from esitoList[]
const getOdd = (type, { descrizione, quota }) => {
  const getRole = rawToPure("role", descrizione, SITE)
  const getValue = quota * Math.pow(10, 1 - 3)
  return {
    type: type,
    role: getRole,
    player: null,
    value: getValue,
    link: LINK
  }
}

// from data
const getMetadata = (type, {
  descrizioneAvvenimento,
  descrizioneManifestazione,
  dataAvvenimento,
}) => {
  return {
    sport: SPORT,
    tournament: rawToPure("tournament", descrizioneManifestazione, SITE),
    matchName: descrizioneAvvenimento,
    date: dataAvvenimento,
    time: "",
  }
}

// from data
export const getMatch = (type, data) => {
  const scommesseClassicheList: any = R.path(["scommesseClassicheList"], data)
  const metadata = getMetadata(type, data)
  const odds = scommesseClassicheList
    .map(({ descrizioneScommessa, infoAggList }) =>
      getOdds(type, descrizioneScommessa, infoAggList))
    .filter(removeTrash)

  return {
    site: SITE,
    metadata: metadata,
    odds: R.flatten(odds)
  }
}
