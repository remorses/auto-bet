const matches = [{
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
            value: 33
          }, {
            site: "unibet",
            value: 12
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
            value: 5
          }
        ]
      }

    },
  ]
}]










const matces = [{
  tournament: "tournament name",
  matchName: "match name",
  date: "date",
  time: "time",
  bets: [
    {
      type: "outcome",
      sides: [
        {
          player: "player A",
          role: "home",
          odds: [
            {
              site: "betfair",
              value: 1
            }, {
              site: "williamhill",
              value: 33
            }, {
              site: "unibet",
              value: 12
            }
          ]
        },
        {
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
              value: 5
            }
          ]
        }
      ]
    },
  ]
}]

let surebets: any[] = []

for (let match of matches) {
  const tournament = match.tournament
  const matchName = match.matchName
  const date = match.date
  const time = match.time

  for (let bet of match.bets) {
    const type = bet.type
    const homePlayer = bet.home.player
    const awayPlayer = bet.away.player

    const homeOdds = bet.home.odds
    const awayOdds = bet.away.odds


    awayOdds.map(away => {
      homeOdds.map(home => {
        let oddA = (1 / home.value)
        let oddB = (1 / away.value)
        if ((oddA + oddB) < 0.97) {
          console.log("surebet!")
          const homeSurebet = {
            tournament,
            matchName,
            date,
            time,
            type,
            player: homePlayer,
            role: "home",
            odd: home.value,
            site: home.site
          }
          const awaySurebet = {
            tournament,
            matchName,
            date,
            time,
            type,
            player: homePlayer,
            role: "away",
            odd: away.value,
            site: away.site
          }
          surebets.push([homeSurebet, awaySurebet])
        }
      })
    })

  }
}
console.log(JSON.stringify(surebets))
