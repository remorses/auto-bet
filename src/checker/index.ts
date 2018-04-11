import { Match, GroupMatch, Bet, Odd, Metadata, Surebet } from "@src/interfaces"
import { cartesianProduct } from "js-combinatorics"
import * as low from "lowdb"
import * as FileSync from 'lowdb/adapters/FileSync'
import { typesNRoles } from "@aliases/aliases"
import { groupWith, differenceWith, contains } from "ramda"

// main logic
// XXX XXX XXX

// control if string are about equal
// XXX String[] => booleaan
// CHECKER
const compareStrings = (...strings: string[]): boolean => {
  return strings.every((current: string, i: number) => {
    let next = strings[i + 1]
    return next ? current.includes(next) || next.includes(current) : true
  })
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


// convert bet to odd
// XXX Bet => Odd
const betToOdd = (bet: Bet): Odd => (<any>bet) = bet.odd



// get some arrays and reurn all possible combinetions between these, in an array
// XXX Array<Bet[]> => Array<Bet[]>
const allCombinations = (...arrs: Array<any[]>): Array<any> => {
  if (arrs[0][0]) {
    let combinations = cartesianProduct(...arrs).toArray()
    //console.log("combinations", combinations) // TODO remove
    return combinations ? combinations : []
  } else { return [] }
}



// get all the types from a GroupMatch
// XXX GroupMatch => string[]
// CHECKER
const getAllTypes = (match: GroupMatch): string[] => {
  let types: string[] = []
  for (let bet of match.bets) {
    if (bet.odd) {
      let type: string = bet.odd.type
      if (!contains(type, types)) types.push(type)
    }
  }
  return types
}

// get all the roles from a Bet[]
// XXX Bet[] => string[]
// CHECKER
const getAllRoles = (bets: Bet[]): string[] => {
  let roles: string[] = []
  for (let bet of bets) {
    if (!bet.odd) continue
    let role: string = bet.odd.role
    if (!contains(role, roles)) roles.push(role)
  }
  return roles
}

// divide every bet by roles
// XXX Bet[] => Bet[][]
// CHECKER
const groupBetsByRole = (bets: Bet[]): Array<Bet[]> => {
  let roles = getAllRoles(bets)
  let ordered: Array<Bet[]> = []
  for (let role of roles) {
    ordered.push(bets.filter((bet) => bet.odd.role === role))
  }
  return ordered
}


// divide match by group of bets with same roles
// XXX QuaueMatch => Bet[][]
// CHECKER
const groupMatchByType = (match: GroupMatch): Array<Bet[]> => {
  let types = getAllTypes(match)
  let ordered: Array<Bet[]> = []
  for (let type of types) {
    ordered.push(match.bets.filter((bet) => bet.odd.type === type))
  }
  return ordered
}

// function to check if a queueMatch is Surebet
// XXX GroupMatch => Surebet[] || null
// main logic to find surebets from every GroupMatch
const surebetsFromMatch = (minProfit = 0.03, match: GroupMatch): Surebet[] => {
  let surebets: Surebet[] = []
  let sameTypeBets: Array<Bet[]> = groupMatchByType(match)
  console.log("same type", sameTypeBets) // TODO remove
  for (let betGroup of sameTypeBets) {
    let sameRoleGroups: Array<Bet[]> = groupBetsByRole(betGroup) // bets grouped by different roles
    console.log("same role", sameRoleGroups) // TODO remove
    let combinations: Array<Bet[]> = allCombinations(...sameRoleGroups) // possible odds to bet
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


const run = () => {// Main logic, from checkerQueue take all possible surebets and stores to checkerQueue
  // XXX GroupMatch[] => surebet[]
  const adapter = new FileSync('./src/db.json')
  const db = low(adapter)
  const grouperQueue = db.get("grouperQueue").value()


  const minProfit = -0.09

  let checkerQueue: Surebet[] = []
  for (let match of grouperQueue) {
    let surebets: Surebet[] = surebetsFromMatch(minProfit, match)
    if (surebets.length !== 0) checkerQueue.push(...surebets)
  }

  console.log(checkerQueue)
  db.get("checkerQueue")
    .push(...checkerQueue)
    .write()
}

export { run }
