import * as fs from "fs"
// take Matches from different sites ang group the same matches
import { Match, QueueMatch, Bet, Odd, Metadata } from "./interfaces"



const checker = (...oppositeBets: Bet[], tank: Bet[], minProfit = 0.03): Bet[] => {
  let oppositeOdds = betsToOdds(...oppositeBets)
  let profit: number = getProfitMargin(...oppositeOdds)
  if (profit > minProfit) {
    const odds = []
    tank.push({ profit, odds })

  }
}


// run algorithm on all combinations of a matrix [][],
const forAllCombinations = (matrix: any[][], algo: (...args) => any): void => {
  let combinations = cartesianProduct(...matrix).toArray()
  combinations.map(arr => algo(...arr))
}


//convert odds to bets
const oddsToBets = (...odds: Odd[]): Bet[] => (odds as any).map(odd => odd = {})

// control if string are about equal
const compareStrings = (...strings: string[]): boolean => {
  return strings.every((current: string, i: number) => {
    let next = strings[i + 1]
    return current.includes(next) || next.includes(current)
  })
}

// control if  bets or matches are the same between different sites, given the metadata
const compareMetadatas = (...metas: Metadata[]): boolean => {
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
  return compareStrings(...tournaments)
    && compareStrings(...matchNames)
    && compareStrings(...dates)
}

// control if the given matches have the same metadata
const compareMatches = (...matches: Match[]): boolean => {
  let metadatas: Metadata[] = []
  matches.map(match => metadatas.push(match.metadata))
  return compareMetadatas(...metadatas)
}


// group odds with the same role
const filterByRole = (role: string, ...odds: Odd[]): Odd[] => {
  return odds.filter(odd => compareStrings(odd.role, role))
}


// get the percentage of profit if different odds are played one against the other
const getProfitMargin = (...odds: Odd[]): number => {
  let values: number[] = []
  odds.map(odd => values.push(1 / odd.value))
  return 1 - values.reduce((a, b) => a + b)
}

// divide every bet by roles
const divideByRole = (roles: string[], ...bets: Bet[]): Array<Bet[]> => {
  let ordered: Array<Bet[]> = []
  for (let role of roles) {
    ordered.push(bets.filter((bet) => bet.odd.role === role))
  }
  return ordered
}

// divide every match by group of bets with same roles
const divideByRoleMatch = (roles: string[], ...matches: QueueMatch[]): Array<Bet[]> => {
  for (let match of matches) {
    let ordered: Array<Bet[]> = []
    for (let role of roles) {
      ordered.push(match.bets.filter((bet) => bet.odd.role === role))
    }
  }
}

// run an algorithm over a matrix of bets with ordered roles, in this case a matrix of twoMaps
interface twoAlgo {
  (a: any, b: any): void
}
const twoMaps = (A: any[], B: any[], algorithm: twoAlgo) =>
  A.map(a => B.map(b => algorithm(a, b)))


// get bets by queue matches
const getBets = (...matches: Match[]): Bet[] => {
  let bets
  matches.map(bets.pus)
}

// find the surebets that are in the queue ( already grouped for same metadata )
const getSureBets = (roles: string[], ...matches: QueueMatch[]): SureBet[] => {
  const ordered = divideByRole(roles, ...matches.bets)
  return
}












const A: Match = {
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


}










const equals = (a: string, b: string, c?: string): boolean => a.trim().includes(b.trim()) || b.trim().includes(a.trim()) || c.trim().includes(a.trim())

let queue: any = []




A.map(a => {
  const siteA = a.site
  const homeTournamentA = a.tournament;
  const homeTeamA = a.home.team;
  const awayTeamA = a.home.team;
  const homeOddA = a.home.odd;
  const awayOddA = a.away.odd;

  B.map(b => {
    const siteB = b.site
    const homeTournamentB = b.tournament;
    const homeTeamB = b.home.team;
    const awayTeamB = b.home.team;
    const homeOddB = b.home.odd;
    const awayOddB = b.away.odd;

    if (equals(homeTeamA, homeTeamB) && equals(awayTeamA, awayTeamB)) {
      queue.map(q => {
        q.bets.map(qBet => {
          const homeTeamQ = qBet.home.player
          const awayTeamQ = qBet.away.player
          console.log(homeTeamQ, awayTeamQ)
          if (equals(homeTeamQ, homeTeamA, homeTeamB) && equals(awayTeamQ, awayTeamA, awayTeamB)) {
            qBet.home.odds.filter(qHomeBet => equals(qHomeBet.site, a.site))
              .map(qHomeBet => qHomeBet.value = homeOddA)
            qBet.away.odds.filter(qAwayBet => equals(qAwayBet.site, b.site))
              .map(qAwayBet => qAwayBet.value = homeOddA)
          } else {
            qBet.home.odds.push({ site: a.site, value: homeOddA }, { site: a.site, value: homeOddB })
            qBet.away.odds.push({ site: b.site, value: awayOddA }, { site: b.site, value: awayOddB })
            // also add a condition to puch an entire match if it isn't already on queue
          }
        })
      })
    }
  })
})

fs.writeFile('./data.json', JSON.stringify(queue), 'utf8', (err: any) => {
  if (err)
    throw err;
})









// get bets by queue matches
const getBets = (...matches: Match[]): Bet[] => {
  let bets
  matches.map(bets.pus)
}

// find the surebets that are in the queue ( already grouped for same metadata )
const getSureBets = (roles: string[], ...matches: QueueMatch[]): Surebet[] => {
  const ordered = divideByRole(roles, ...matches.bets)
  return
}


// find same matches between the 2 queues, group in a single QueueMatch
const groupSameMatches = (...queues: Match[]): QueueMatch[] => {

}


const mapper = (A, cb) => A.map(a => cb(a))

mapper(A, mapper(B, mapper(C, final)))
