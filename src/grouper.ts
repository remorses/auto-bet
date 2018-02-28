import * as fs from "fs"
import * as low from "lowdb"
// take Matches from different sites ang group the same matches
import { Match, GroupMatch, Bet, Odd, Metadata, Surebet } from "./interfaces"
import * as FileSync from 'lowdb/adapters/FileSync'


// control if string are about equal
// XXX String[] => booleaan
// CHECKER
const equalStrings = (...strings: string[]): boolean => {
  return strings.every((current: string, i: number) => {
    let next = strings[i + 1]
    return next ? current.includes(next) || next.includes(current) : true
  })
}

// compare  if  metadata are the same between different sites
// XXX Metadata[] => boolean
// GROUPER
const equalMetadatas = (...metas: Metadata[]): boolean => {
  let tournaments: string[] = []
  let matchNames: string[] = []
  let dates: string[] = []
  let times: string[] = []
  metas.map(meta => {
    tournaments.push(meta.tournament)
    matchNames.push(meta.matchName)
    dates.push(meta.date)
    times.push(meta.time)
  })
  return equalStrings(...tournaments)
    && equalStrings(...matchNames)
    && equalStrings(...dates)
}

// control if the given matches have the same metadata
// XXX Match[] => boolean
// GROUPER
const equalMatches = (...matches: Match[]): boolean => {
  let metadatas: Metadata[] = []
  matches.map(match => metadatas.push(match.metadata))
  return equalMetadatas(...metadatas)
}


// from Match to array of single individual Bets
// XXX Match => Bet[]
// GROUPER
const takeBets = (match: Match): Bet[] => {
  let odds: Odd[] = []
  let bets: Bet[] = []
  match.odds.map(odd => odds.push(odd))
  odds.map(odd => bets.push(
    {
      site: match.site,
      metadata: match.metadata,
      odd: odd,
    }
  ))
  return bets
}


// take same matches and group under a groupMatch
// from same Matches to GroupMatch
// XXX Match[] => GroupMatch
// GROUPER
const makeQueueMatch = (...matches: Match[]): GroupMatch => {
  let metadata = matches[0].metadata
  let bets: Bet[] = []
  matches.map(match => bets.push(...takeBets(match)))
  return {
    metadata,
    bets
  }
}






// group by site, from a queue of general matches, Array<Match>
// XXX Match[] => Array<Match[]>
const groupBySite = (sites: string[], ...matches: Match[]): Array<Match[]> => {
  let matchesBySite: Array<Match[]> = []
  for (let site of sites) {
    let sameSiteMatches: Match[] = matches.filter(match => equalStrings(match.site, site))
    if (sameSiteMatches.length !== 0) matchesBySite.push(sameSiteMatches)
  }
  return matchesBySite
}

/*
const betfairQueue: Match[] = [
  {
    site: "betfair",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  },
  {
    site: "betfair",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  }, {
    site: "betfair",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  }]
const unibetQueue: Match[] = [
  {
    site: "unibet",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  },
  {
    site: "unibet",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  }, {
    site: "betfair",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odds: [{
      type: "outcome",
      role: "home",
      player: "player name A",
      value: 2.54
    }, {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 1.4
    }]
  }]
const queue: Match[] = [...betfairQueue, ...unibetQueue]
db.get("scraperQueue")
  .push(...queue)
  .write()
*/

// main logic
const adapter = new FileSync('db.json')
const db = low(adapter)


// group all the matches on the database by same metadata, it take a mainsite as
// an argument to take the reference matches to compare the others
const groupSameMatches = (mainSite, matches: Match[]): Match[] => {
  let sameMatches: Match[] = []
  for (let matchA of matches) {
    let sameMatch: Match = db.get("scraperQueue")
      .filter(matchB => matchB.site !== mainSite)
      .find((matchB) => equalMetadatas(matchB.metadata, matchA.metadata))
      .value()
    if (sameMatch) sameMatches.push(sameMatch)
  }
  return sameMatches
}

// logic to bake the grouperQueue
// XXX scraperQueue: Match[] => grouperQueue: GroupMatch[]
const sites = ["betfair", "unibet"]

const scraperQueue = db.get("scraperQueue").value()

let grouperQueue: GroupMatch[] = []

for (let site of sites) {
  const sameMatches: Match[] = groupSameMatches(site, scraperQueue)
  const groupMatch: GroupMatch = makeQueueMatch(...sameMatches)
  if (groupMatch) grouperQueue.push(groupMatch)
}

db.get("grouperQueue")
  .push(grouperQueue)
  .write()


// per raggruppare matches dei siti diversi in singole GroupMatch, aggiunte alla Queue
// XXX siteQueue => Queue
// Array<Match[]> => Array<GroupMatch>
