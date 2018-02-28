// data about the match, should be about the same among all sites
interface Metadata {
  tournament: string,
  matchName: string,
  date: string,
  time: string,
}
// the all data that is needed to compute a surebet given a GroupMatch
interface Odd {
  type: string,
  role: string,
  player: string,
  value: number,
  selector: string
  // aggiungere link per la scommessa
}
// a match with only a single odd, used to placeBet in the final stage and managed
// from the grouper to find
interface Bet {
  site: string,
  metadata: Metadata,  // aggiungere link per la scommessa
  odd: Odd
}
// match scraped from a single site, contains all possible odds (under-over, outcome...)
interface Match {
  site: string,
  metadata: Metadata,
  odds: Odd[]
}
// a same match with all odds from different sites, odds are contained in a Bet
interface GroupMatch {
  metadata: Metadata,
  bets: Bet[]
}
// usually the bets would be [Bet, Bet] but with soccer you can have more than 2
// ( usually surebet is a couple of 2 bets from 2 different sites )
interface Surebet {
  profit: number,
  bets: Bet[]
}
export { Match, GroupMatch, Bet, Odd, Metadata, Surebet }
