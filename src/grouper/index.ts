import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
import { Match, GroupMatch, Bet, Odd, Metadata, Surebet } from "@src/interfaces"


/*
// control if the given matches have the same metadata
//  Match[] => boolean
// GROUPER
const equalMatches = (...matches: Match[]): boolean => {
  let metadatas: Metadata[] = []
  matches.map(match => metadatas.push(match.metadata))
  return equalMetadatas(...metadatas)
}

// group by site, from a queue of general matches, Array<Match>
//  Match[] => Array<Match[]>
const groupBySite = (sites: string[], ...matches: Match[]): Array<Match[]> => {
  let matchesBySite: Array<Match[]> = []
  for (let site of sites) {
    let sameSiteMatches: Match[] = matches.filter(match => equalStrings(match.site, site))
    if (sameSiteMatches.length !== 0) matchesBySite.push(sameSiteMatches)
  }
  return matchesBySite
}

*/

// main logic XXX XXX XXX
const adapter = new FileSync('./src/db.json')
const db = low(adapter)


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
const makeGroupMatch = (...matches: Match[]): GroupMatch => {
  let metadata = matches[0].metadata
  let bets: Bet[] = []
  matches.map(match => bets.push(...takeBets(match)))
  return {
    metadata,
    bets
  }
}

// group all the matches on the database by same metadata, it take a mainsite as
// an argument to take the reference matches to compare the others
// XXX Match[] => Array<Match>
const groupSameMatches = (mainSite): Match[][] => {
  let mainMatches: Match[] = db.get("scraperQueue")
    .filter(matchB => matchB.site === mainSite)
    .value()
  let groupMatches: Match[][] = []
  for (let matchA of mainMatches) {
    console.log(matchA.site)
    let sameGroups: Match[] = db.get("scraperQueue")
      .filter(matchB => matchB.site !== mainSite)
      .filter((matchB) => equalMetadatas(matchB.metadata, matchA.metadata))
      .value()

    if (sameGroups.length > 0) groupMatches.push([matchA, ...sameGroups])
  }
  return groupMatches
}

const run = () => {// logic to bake the grouperQueue
  // XXX  Match[] => Array<Match[]> =>  GroupMatch[]
  const sites = ["betfair", "unibet"]
  const scraperQueue = db.get("scraperQueue").value()
  let grouperQueue: GroupMatch[] = []
  for (let site of sites) {
    const sameMatches: Match[][] = groupSameMatches(site)
    console.log(sameMatches)
    for (let matches of sameMatches) {
      const groupMatch: GroupMatch = makeGroupMatch(...matches)
      if (groupMatch) grouperQueue.push(groupMatch)
    }
  }

  // write on database
  if (grouperQueue.length > 0) {
    db.get("grouperQueue")
      .push(...grouperQueue)
      .write()
  }
  
}

export { run }
