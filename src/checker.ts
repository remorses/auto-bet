import { Match, GroupMatch, Bet, Odd, Metadata, Surebet } from "./interfaces"
import { cartesianProduct } from "js-combinatorics"
import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
//import { checkerQueue } frome "./test-queues"

// control if string are about equal
// XXX String[] => booleaan
// CHECKER
const compareStrings = (...strings: string[]): boolean => {
  return strings.every((current: string, i: number) => {
    let next = strings[i + 1]
    return next ? current.includes(next) || next.includes(current) : true
  })
}


// group odds with the same role
// Odd[] => Odd[]
// CHECKER
const filterByRole = (role: string, ...odds: Odd[]): Odd[] => {
  return odds.filter(odd => compareStrings(odd.role, role))
}


// divide every bet by roles
// XXX Bet[] => Bet[][]
// CHECKER
const groupBetsByRole = (roles: string[], ...bets: Bet[]): Array<Bet[]> => {
  let ordered: Array<Bet[]> = []
  for (let role of roles) {
    ordered.push(bets.filter((bet) => compareStrings(bet.odd.role, role)))
  }
  return ordered
}

// divide match by group of bets with same roles
//  QuaueMatch => Bet[][]
// CHECKER
const groupMatchByRole = (roles: string[], match: GroupMatch): Array<Bet[]> => {
  let ordered: Array<Bet[]> = []
  for (let role of roles) {
    ordered.push(match.bets.filter((bet) => bet.odd.role === role))
  }
  return ordered
}

// divide match by group of bets with same roles
// XXX QuaueMatch => Bet[][]
// CHECKER
const groupMatchByType = (types: string[], match: GroupMatch): Array<Bet[]> => {
  let ordered: Array<Bet[]> = []
  for (let type of types) {
    ordered.push(match.bets.filter((bet) => bet.odd.type === type))
  }
  return ordered
}



// run an algorithm over a matrix of bets with ordered roles, in this case a matrix of twoMaps
// run algo fpr all combinations of 2 different arrays
// CHECKER
interface twoAlgo {
  (a: any, b: any): void
}
const twoMaps = (A: any[], B: any[], algorithm: twoAlgo) =>
  A.map(a => B.map(b => algorithm(a, b)))




// get some arrays and reurn all possible combinetions between these, in an array
// XXX Array<Bet[]> => Array<Bet[]>
const allCombinations = (...arrs: Array<any[]>): Array<any> => {
  if (arrs[0][0]) {
    let combinations = cartesianProduct(...arrs).toArray()
    //console.log("combinations", combinations) // TODO remove
    return combinations ? combinations : []
  } else { return [] }
}


// get the percentage of profit for opposite odds
// XXX Odd[] => number
// CHECKER
const getOddsProfit = (...odds: Odd[]): number => {
  let values: number[] = []
  odds.map(odd => values.push(1 / odd.value))
  return 1 - values.reduce((a, b) => a + b)
}
const getProfit = (...bets: Bet[]): number => {
  let odds: Odd[] = []
  bets.map(bet => odds.push(betToOdd(bet)))
  // console.log(getOddsProfit(...odds)) // TODO remove
  return getOddsProfit(...odds)
}


// convert bets to odds
//  Bet[] => Odd[]
const betsToOdds = (...bets: Bet[]): Odd[] => (bets as any).map(bet => bet = bet.odd)

// convert bet to odd
// XXX Bet => Odd
const betToOdd = (bet: Bet): Odd => (<any>bet) = bet.odd


// logic to check if a queueMatch is Surebet
// XXX GroupMatch => Surebet[] || null
// main logic to find surebets from every GroupMatch
const surebetsFromMatch = (types = ["outcome"], roles = ["home", "away"], minProfit = 0.03, match: GroupMatch): Surebet[] => {
  let surebets: Surebet[] = []
  let sameTypeBets = groupMatchByType(types, match)
  for (let betGroup of sameTypeBets) {
    let sameRoleBets: Array<Bet[]> = groupBetsByRole(roles, ...betGroup) // bets grouped by roles
    // console.log(sameRoleBets) // TODO remove
    let combinations: Array<Bet[]> = allCombinations(...sameRoleBets) // possible odds to bet
    for (let combination of combinations) {
      let profit = getProfit(...combination)
      // console.log(profit) // TODO remove
      if (profit > minProfit) {
        let surebet: Surebet = {
          profit: profit,
          bets: combination
        }
        surebets.push(surebet)
      } else { continue }
    }
  }
  return surebets || []
}


// Main logic, from checkerQueue take all possible surebets and stores to placerQueue
// XXX GroupMatch[] => surebet[]

// main logic
const adapter = new FileSync('db.json')
const db = low(adapter)


// import { checkerQueue } from "./test-queues"
const grouperQueue = db.get("grouperQueue").value()

const types = ["outcome"]
const roles = ["home, away"]
const minProfit = 0.03

let placerQueue: Surebet[] = []
for (let match of grouperQueue) {
  let surebets: Surebet[] = surebetsFromMatch(types, roles, minProfit, match)
  if (surebets.length !== 0) placerQueue.push(...surebets)
}

console.log(placerQueue)
db.get("placerQueue")
  .push(placerQueue)
  .write()
