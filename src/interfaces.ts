// data about the match, should be about the same among all sites

interface Metadata {
  sport: string,
  tournament: string,
  matchName: string,
  date: string,
  time: string,
}

interface Odd {
  type: string,
  role: string,
  player: string | null,
  value: number,
  link: string
}

interface Bet {
  site: string,
  metadata: Metadata,
  odd: Odd
}
interface Match {
  site: string,
  metadata: Metadata,
  odds: Odd[]
}

interface GroupMatch {
  metadata: Metadata,
  bets: Bet[]
}

interface Surebet {
  profit: number,
  bets: Bet[]
}
export { Match, GroupMatch, Bet, Odd, Metadata, Surebet }
