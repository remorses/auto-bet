import { GroupMatch } from "./interfaces"


const groupMatch: GroupMatch = {
  metadata: {
    tournament: "tournament name",
    matchName: "match name",
    date: "date",
    time: "time",
  },
  bets: [{
    site: "betair",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odd: {
      type: "outcome",
      role: "away",
      player: "player name B",
      value: 2.4
    }
  }, {
    site: "unibet",
    metadata: {
      tournament: "tournament name",
      matchName: "match name",
      date: "date",
      time: "time",
    },
    odd: {
      type: "outcome",
      role: "home",
      player: "player name B",
      value: 3.6
    }
  }]
}


export let checkerQueue: GroupMatch[] = [groupMatch]
