
import * as fs from "fs"

const betfairQueue = [{
  site: "betfair",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  type: "outcome",
  home: {
    team: "homeTeam",
    odd: 3
  },
  away: {
    team: "awayTeam",
    odd: 4
  }
}, {
  site: "betfair",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  home: {
    type: "outcome",
    team: "homeTeam",
    odd: 3
  },
  away: {
    type: "outcome",
    team: "awayTeam",
    odd: 4
  }
}, {
  site: "betfair",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  home: {
    team: "homeTeam",
    odd: 3
  },
  away: {
    team: "awayTeam",
    odd: 4
  }
},]



const unibetQueue = [{
  site: "unibet",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  home: {
    team: "homeTeam",
    odd: 3
  },
  away: {
    team: "awayTeam",
    odd: 4
  }
}, {
  site: "unibet",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  home: {
    team: "homeTeam",
    odd: 3
  },
  away: {
    team: "awayTeam",
    odd: 4
  }
}, {
  site: "unibet",
  tournament: "tournament",
  date: "date",
  time: "time",
  isLive: true,
  home: {
    team: "homeTeam",
    odd: 3
  },
  away: {
    team: "awayTeam",
    odd: 4
  }
},]


const queue = [{
  tournament: "tournament name",
  matchName: "match name",
  date: "date",
  time: "time",
  bets: [
    {
      type: "outcome",
      home: {
        player: "player A",
        role: "home",
        odds: [
          {
            site: "betfair",
            value: 1
          }, {
            site: "williamhill",
            value: 1
          }, {
            site: "unibet",
            value: 1
          }
        ]
      },
      away: {
        player: "player B",
        role: "away",
        odds: [
          {
            site: "betfair",
            value: 1
          }, {
            site: "williamhill",
            value: 1
          }, {
            site: "unibet",
            value: 1
          }
        ]
      }

    },
  ]
}]

const equals = (a: string, b: string, c?: string): boolean => a.trim().includes(b.trim()) || b.trim().includes(a.trim()) || c.trim().includes(a.trim())

let A = betfairQueue
let B = unibetQueue
queue

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
