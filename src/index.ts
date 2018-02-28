// all system logic
// run scrapers in intervals
// run queue grouper after
// place bets that are in queue with
// placeBet(money, siteUrl, betObject)

// also manage the state of different sites:
// money
// open bets
// closed bets
// restrictions

// according to the state of site i can decide if
// deposit(money, site, mehod)
// draw(money, site, method)



// divide the categorization logic in, objects, schemas:

// betObject: single bet and odd of a match,
// contains also the data to find the bet on the site
// used in the final stage to place the already found surebet

// matchObject of a site: a match with all the information of that match of a specific site
// contains the odds of all sides and is used to calculate the surebets among diferent strictFunctionTypes

// sameMatchesObject: a match with all the odds from different sites

const metadata = {
  tournament: "tournament name",
  matchName: "match name",
  date: "date",
  time: "time",
}

const odd = {
  type: "outcome",
  side: "home",
  player: "player name",
  value: 2.54,
}

const bet = {
  site: "betfair",
  metadata,
  odd
}

const match = {
  site: "betfair",
  metadata,
  odds: [odd, odd, odd]
}

const betsGroup = {
  metadata,
  bets: [bet, bet, bet]
}
