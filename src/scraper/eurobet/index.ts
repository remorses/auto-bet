
import * as R from "ramda"
import { rawToPure, pureToRaw } from "@aliases/index"
import * as Debug from "debug";
const debug = Debug("scraper:eurobet");

const LINK = ""
const SITE = "eurobet"
const SPORT = "soccer"

const removeTrash = arr => !arr ? Boolean(arr) : (arr[0] && arr.length)

// from oddGroupList
const getOdds = (type, betDescription, oddGroupList) => {
  return oddGroupList.map(({ oddGroupDescription, oddList }) => {

    if (oddGroupDescription === betDescription) {
      if (type === rawToPure("oddType", betDescription, "eurobet")) {
        return oddList.map(obj => getOdd(type, obj))
      }
    } else {
      const rawType = betDescription + "_" + oddGroupDescription
      if (type === rawToPure("oddType", rawType, "eurobet")) {
        return oddList.map(obj => getOdd(type, obj))
      }
    }
  }).filter(removeTrash)
}

// from oddList
const getOdd = (type, { oddDescription, oddValue }) => {
  const getRole = rawToPure("role", oddDescription, "eurobet")
  const getValue = oddValue * Math.pow(10, 1 - 3)
  return {
    type: type,
    role: getRole,
    player: null,
    value: getValue,
    link: LINK
  }
}

// from eventInfo
const getMetadata = (type, { teamAway, teamHome, meetingDescription }) => {
  const matchName = teamAway.description + ", " + teamHome.description
  return {
    sport: SPORT,
    tournament: rawToPure("tournament", meetingDescription, "eurobet"),
    matchName,
    date: "",
    time: "",
  }
}

// from betGroupList
const getMatch = (type, data) => {
  const betGroupList: any = R.path(["result", "betGroupList"], data)
  const eventInfo: any = R.path(["result", "eventInfo"], data)
  const metadata = getMetadata(type, eventInfo)
  const odds = betGroupList
    .map(({ betDescription, oddGroupList }) =>
      getOdds(type, betDescription, oddGroupList))
    .filter(removeTrash)

  return {
    site: SITE,
    metadata: metadata,
    odds: R.flatten(odds)
  }
}

const input = {
  "code": 1,
  "description": "ok",
  "result": {
    "betGroupList": [{
      "betId": 5046,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 1-5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 1-5",
        "oddList": [{
          "betCode": 16900,
          "oddValue": 245,
          "oddDescription": "1 + 1-5",
          "resultCode": 1,
          "boxTitle": "1 + 1-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16900,
          "oddValue": 430,
          "oddDescription": "X + 1-5",
          "resultCode": 2,
          "boxTitle": "X + 1-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16900,
          "oddValue": 305,
          "oddDescription": "2 + 1-5",
          "resultCode": 3,
          "boxTitle": "2 + 1-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16900,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5065,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 2-5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 2-5",
        "oddList": [{
          "betCode": 16899,
          "oddValue": 340,
          "oddDescription": "1 + 2-5",
          "resultCode": 1,
          "boxTitle": "1 + 2-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16899,
          "oddValue": 430,
          "oddDescription": "X + 2-5",
          "resultCode": 2,
          "boxTitle": "X + 2-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16899,
          "oddValue": 420,
          "oddDescription": "2 + 2-5",
          "resultCode": 3,
          "boxTitle": "2 + 2-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16899,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5052,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 3-4",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 3-4",
        "oddList": [{
          "betCode": 16906,
          "oddValue": 550,
          "oddDescription": "1 + 3-4",
          "resultCode": 1,
          "boxTitle": "1 + 3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16906,
          "oddValue": 1200,
          "oddDescription": "X + 3-4",
          "resultCode": 2,
          "boxTitle": "X + 3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16906,
          "oddValue": 650,
          "oddDescription": "2 + 3-4",
          "resultCode": 3,
          "boxTitle": "2 + 3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16906,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5050,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 2-4",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 2-4",
        "oddList": [{
          "betCode": 16904,
          "oddValue": 390,
          "oddDescription": "1 + 2-4",
          "resultCode": 1,
          "boxTitle": "1 + 2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16904,
          "oddValue": 430,
          "oddDescription": "X + 2-4",
          "resultCode": 2,
          "boxTitle": "X + 2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16904,
          "oddValue": 480,
          "oddDescription": "2 + 2-4",
          "resultCode": 3,
          "boxTitle": "2 + 2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16904,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5049,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 3-5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 3-5",
        "oddList": [{
          "betCode": 16903,
          "oddValue": 450,
          "oddDescription": "1 + 3-5",
          "resultCode": 1,
          "boxTitle": "1 + 3-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16903,
          "oddValue": 1200,
          "oddDescription": "X + 3-5",
          "resultCode": 2,
          "boxTitle": "X + 3-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16903,
          "oddValue": 550,
          "oddDescription": "2 + 3-5",
          "resultCode": 3,
          "boxTitle": "2 + 3-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16903,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5047,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 1-4",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 1-4",
        "oddList": [{
          "betCode": 16901,
          "oddValue": 270,
          "oddDescription": "1 + 1-4",
          "resultCode": 1,
          "boxTitle": "1 + 1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16901,
          "oddValue": 430,
          "oddDescription": "X + 1-4",
          "resultCode": 2,
          "boxTitle": "X + 1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16901,
          "oddValue": 340,
          "oddDescription": "2 + 1-4",
          "resultCode": 3,
          "boxTitle": "2 + 1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16901,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5045,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 1-3",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 1-3",
        "oddList": [{
          "betCode": 16898,
          "oddValue": 310,
          "oddDescription": "1 + 1-3",
          "resultCode": 1,
          "boxTitle": "1 + 1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16898,
          "oddValue": 550,
          "oddDescription": "X + 1-3",
          "resultCode": 2,
          "boxTitle": "X + 1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16898,
          "oddValue": 385,
          "oddDescription": "2 + 1-3",
          "resultCode": 3,
          "boxTitle": "2 + 1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16898,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5048,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 1-2",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 1-2",
        "oddList": [{
          "betCode": 16902,
          "oddValue": 500,
          "oddDescription": "1 + 1-2",
          "resultCode": 1,
          "boxTitle": "1 + 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16902,
          "oddValue": 550,
          "oddDescription": "X + 1-2",
          "resultCode": 2,
          "boxTitle": "X + 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16902,
          "oddValue": 625,
          "oddDescription": "2 + 1-2",
          "resultCode": 3,
          "boxTitle": "2 + 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16902,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 5051,
      "layoutType": 4,
      "betDescription": "1X2 + Multigoal 2-3",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + Multigoal 2-3",
        "oddList": [{
          "betCode": 16905,
          "oddValue": 480,
          "oddDescription": "1 + 2-3",
          "resultCode": 1,
          "boxTitle": "1 + 2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16905,
          "oddValue": 550,
          "oddDescription": "X + 2-3",
          "resultCode": 2,
          "boxTitle": "X + 2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16905,
          "oddValue": 600,
          "oddDescription": "2 + 2-3",
          "resultCode": 3,
          "boxTitle": "2 + 2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16905,
          "oddValue": 101,
          "oddDescription": "Altro",
          "resultCode": 4,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 24,
      "layoutType": 1,
      "betDescription": "1X2",
      "oddGroupList": [{
        "oddGroupDescription": "1X2",
        "oddList": [{
          "betCode": 3,
          "oddValue": 245,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 3,
          "oddValue": 310,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 3,
          "oddValue": 310,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 119,
      "layoutType": 1,
      "betDescription": "U/O 2.5",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 2.5",
        "oddList": [{
          "betCode": 10,
          "oddValue": 170,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 10,
          "oddValue": 202,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1550,
      "layoutType": 1,
      "betDescription": "GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "GG/NG",
        "oddList": [{
          "betCode": 18,
          "oddValue": 175,
          "oddDescription": "Goal",
          "resultCode": 1,
          "boxTitle": "Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 18,
          "oddValue": 195,
          "oddDescription": "Nogoal",
          "resultCode": 2,
          "boxTitle": "Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 74,
      "layoutType": 5,
      "betDescription": "parziale/finale",
      "oddGroupList": [{
        "oddGroupDescription": "parziale/finale",
        "oddList": [{
          "betCode": 4,
          "oddValue": 395,
          "oddDescription": "1-1",
          "resultCode": 1,
          "boxTitle": "1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 1400,
          "oddDescription": "1-X",
          "resultCode": 2,
          "boxTitle": "1-X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 3400,
          "oddDescription": "1-2",
          "resultCode": 3,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 600,
          "oddDescription": "X-1",
          "resultCode": 4,
          "boxTitle": "X-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 460,
          "oddDescription": "X-X",
          "resultCode": 5,
          "boxTitle": "X-X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 725,
          "oddDescription": "X-2",
          "resultCode": 6,
          "boxTitle": "X-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 3000,
          "oddDescription": "2-1",
          "resultCode": 7,
          "boxTitle": "2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 1400,
          "oddDescription": "2-X",
          "resultCode": 8,
          "boxTitle": "2-X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4,
          "oddValue": 500,
          "oddDescription": "2-2",
          "resultCode": 9,
          "boxTitle": "2-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 97,
      "layoutType": 4,
      "betDescription": "somma goal",
      "oddGroupList": [{
        "oddGroupDescription": "somma goal",
        "oddList": [{
          "betCode": 5,
          "oddValue": 875,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 5,
          "oddValue": 460,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 5,
          "oddValue": 340,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 5,
          "oddValue": 430,
          "oddDescription": "3",
          "resultCode": 4,
          "boxTitle": "3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 5,
          "oddValue": 600,
          "oddDescription": "4",
          "resultCode": 5,
          "boxTitle": "4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 5,
          "oddValue": 700,
          "oddDescription": ">4",
          "resultCode": 6,
          "boxTitle": ">4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 51,
      "layoutType": 5,
      "betDescription": "ris esatto",
      "oddGroupList": [{
        "oddGroupDescription": "ris esatto",
        "oddList": [{
          "betCode": 7,
          "oddValue": 725,
          "oddDescription": "1-0",
          "resultCode": 1,
          "boxTitle": "1-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 1100,
          "oddDescription": "2-0",
          "resultCode": 2,
          "boxTitle": "2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 900,
          "oddDescription": "2-1",
          "resultCode": 3,
          "boxTitle": "2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 2900,
          "oddDescription": "3-0",
          "resultCode": 4,
          "boxTitle": "3-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 1900,
          "oddDescription": "3-1",
          "resultCode": 5,
          "boxTitle": "3-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 3000,
          "oddDescription": "3-2",
          "resultCode": 6,
          "boxTitle": "3-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 6600,
          "oddDescription": "4-0",
          "resultCode": 7,
          "boxTitle": "4-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 5700,
          "oddDescription": "4-1",
          "resultCode": 8,
          "boxTitle": "4-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 8600,
          "oddDescription": "4-2",
          "resultCode": 9,
          "boxTitle": "4-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 15900,
          "oddDescription": "4-3",
          "resultCode": 10,
          "boxTitle": "4-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 900,
          "oddDescription": "0-1",
          "resultCode": 11,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 1500,
          "oddDescription": "0-2",
          "resultCode": 12,
          "boxTitle": "0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 1100,
          "oddDescription": "1-2",
          "resultCode": 13,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 3800,
          "oddDescription": "0-3",
          "resultCode": 14,
          "boxTitle": "0-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 2400,
          "oddDescription": "1-3",
          "resultCode": 15,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 3500,
          "oddDescription": "2-3",
          "resultCode": 16,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 8900,
          "oddDescription": "0-4",
          "resultCode": 17,
          "boxTitle": "0-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 7300,
          "oddDescription": "1-4",
          "resultCode": 18,
          "boxTitle": "1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 10200,
          "oddDescription": "2-4",
          "resultCode": 19,
          "boxTitle": "2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 17300,
          "oddDescription": "3-4",
          "resultCode": 20,
          "boxTitle": "3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 875,
          "oddDescription": "0-0",
          "resultCode": 21,
          "boxTitle": "0-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 550,
          "oddDescription": "1-1",
          "resultCode": 22,
          "boxTitle": "1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 1200,
          "oddDescription": "2-2",
          "resultCode": 23,
          "boxTitle": "2-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 6100,
          "oddDescription": "3-3",
          "resultCode": 24,
          "boxTitle": "3-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 24800,
          "oddDescription": "4-4",
          "resultCode": 25,
          "boxTitle": "4-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7,
          "oddValue": 3900,
          "oddDescription": "Altro",
          "resultCode": 26,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 53,
      "layoutType": 3,
      "betDescription": "1X2 handicap",
      "oddGroupList": [{
        "oddGroupDescription": "0:2",
        "oddList": [{
          "betCode": 8,
          "oddValue": 1200,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 725,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 112,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "2:0",
        "oddList": [{
          "betCode": 8,
          "oddValue": 107,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [-200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 900,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [-200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 1600,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [-200, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "0:1",
        "oddList": [{
          "betCode": 8,
          "oddValue": 500,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 410,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 154,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "1:0",
        "oddList": [{
          "betCode": 8,
          "oddValue": 137,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 490,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 8,
          "oddValue": 650,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }]
    }, {
      "betId": 363,
      "layoutType": 1,
      "betDescription": "1X2 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 1° tempo",
        "oddList": [{
          "betCode": 14,
          "oddValue": 305,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14,
          "oddValue": 210,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14,
          "oddValue": 355,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1556,
      "layoutType": 1,
      "betDescription": "dc in",
      "oddGroupList": [{
        "oddGroupDescription": "dc in",
        "oddList": [{
          "betCode": 15,
          "oddValue": 137,
          "oddDescription": "1X",
          "resultCode": 1,
          "boxTitle": "1X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15,
          "oddValue": 310,
          "oddDescription": "2",
          "resultCode": 2,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1564,
      "layoutType": 1,
      "betDescription": "dc out",
      "oddGroupList": [{
        "oddGroupDescription": "dc out",
        "oddList": [{
          "betCode": 16,
          "oddValue": 245,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16,
          "oddValue": 154,
          "oddDescription": "X2",
          "resultCode": 2,
          "boxTitle": "X2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1572,
      "layoutType": 1,
      "betDescription": "dc in/out",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out",
        "oddList": [{
          "betCode": 17,
          "oddValue": 310,
          "oddDescription": "X",
          "resultCode": 1,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17,
          "oddValue": 137,
          "oddDescription": "12",
          "resultCode": 2,
          "boxTitle": "12",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 79,
      "layoutType": 1,
      "betDescription": "pari/dispari",
      "oddGroupList": [{
        "oddGroupDescription": "pari/dispari",
        "oddList": [{
          "betCode": 19,
          "oddValue": 180,
          "oddDescription": "Pari",
          "resultCode": 1,
          "boxTitle": "Pari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 19,
          "oddValue": 200,
          "oddDescription": "Dispari",
          "resultCode": 2,
          "boxTitle": "Dispari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 124,
      "layoutType": 1,
      "betDescription": "U/O 3.5",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 3.5",
        "oddList": [{
          "betCode": 22,
          "oddValue": 125,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 22,
          "oddValue": 350,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 377,
      "layoutType": 1,
      "betDescription": "1X2 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 2° tempo",
        "oddList": [{
          "betCode": 127,
          "oddValue": 270,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 127,
          "oddValue": 240,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 127,
          "oddValue": 315,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 450,
      "layoutType": 1,
      "betDescription": "rigore?",
      "oddGroupList": [{
        "oddGroupDescription": "rigore?",
        "oddList": [{
          "betCode": 129,
          "oddValue": 290,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 129,
          "oddValue": 132,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 391,
      "layoutType": 1,
      "betDescription": "tempo con piu' goal casa",
      "oddGroupList": [{
        "oddGroupDescription": "tempo con piu' goal casa",
        "oddList": [{
          "betCode": 133,
          "oddValue": 360,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 133,
          "oddValue": 235,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 133,
          "oddValue": 260,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 414,
      "layoutType": 1,
      "betDescription": "tempo con piu' goal ospite",
      "oddGroupList": [{
        "oddGroupDescription": "tempo con piu' goal ospite",
        "oddList": [{
          "betCode": 134,
          "oddValue": 375,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 134,
          "oddValue": 220,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 134,
          "oddValue": 270,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 449,
      "layoutType": 4,
      "betDescription": "minuto 1° goal",
      "oddGroupList": [{
        "oddGroupDescription": "minuto 1° goal",
        "oddList": [{
          "betCode": 135,
          "oddValue": 300,
          "oddDescription": "0 - 15",
          "resultCode": 1,
          "boxTitle": "0 - 15",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 365,
          "oddDescription": "16 - 30",
          "resultCode": 2,
          "boxTitle": "16 - 30",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 460,
          "oddDescription": "31 - Fine Primo Tempo",
          "resultCode": 3,
          "boxTitle": "31 - Fine Primo Tempo",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 725,
          "oddDescription": "46 - 60",
          "resultCode": 4,
          "boxTitle": "46 - 60",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 1025,
          "oddDescription": "61 - 75",
          "resultCode": 5,
          "boxTitle": "61 - 75",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 1300,
          "oddDescription": "76 - Fine Partita",
          "resultCode": 6,
          "boxTitle": "76 - Fine Partita",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 135,
          "oddValue": 875,
          "oddDescription": "Nessun Goal",
          "resultCode": 7,
          "boxTitle": "Nessun Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 369,
      "layoutType": 1,
      "betDescription": "U/O 1.5 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 1.5 1° tempo",
        "oddList": [{
          "betCode": 136,
          "oddValue": 133,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 136,
          "oddValue": 295,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 381,
      "layoutType": 1,
      "betDescription": "U/O 1.5 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 1.5 2° tempo",
        "oddList": [{
          "betCode": 137,
          "oddValue": 158,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 137,
          "oddValue": 218,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 113,
      "layoutType": 1,
      "betDescription": "U/O 1.5",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 1.5",
        "oddList": [{
          "betCode": 138,
          "oddValue": 315,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 138,
          "oddValue": 129,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 368,
      "layoutType": 1,
      "betDescription": "U/O 0.5 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 0.5 1° tempo",
        "oddList": [{
          "betCode": 163,
          "oddValue": 270,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 163,
          "oddValue": 138,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 380,
      "layoutType": 1,
      "betDescription": "U/O 0.5 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 0.5 2° tempo",
        "oddList": [{
          "betCode": 164,
          "oddValue": 370,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 164,
          "oddValue": 122,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 392,
      "layoutType": 1,
      "betDescription": "segna goal casa",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal casa",
        "oddList": [{
          "betCode": 165,
          "oddValue": 125,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 165,
          "oddValue": 345,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 415,
      "layoutType": 1,
      "betDescription": "segna goal ospite",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal ospite",
        "oddList": [{
          "betCode": 166,
          "oddValue": 134,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 166,
          "oddValue": 290,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 129,
      "layoutType": 1,
      "betDescription": "U/O 4.5",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 4.5",
        "oddList": [{
          "betCode": 180,
          "oddValue": 106,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 180,
          "oddValue": 700,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 108,
      "layoutType": 1,
      "betDescription": "U/O 0.5",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 0.5",
        "oddList": [{
          "betCode": 208,
          "oddValue": 875,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 208,
          "oddValue": 103,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 370,
      "layoutType": 1,
      "betDescription": "U/O 2.5 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 2.5 1° tempo",
        "oddList": [{
          "betCode": 216,
          "oddValue": 104,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 216,
          "oddValue": 775,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 382,
      "layoutType": 1,
      "betDescription": "U/O 2.5 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 2.5 2° tempo",
        "oddList": [{
          "betCode": 217,
          "oddValue": 113,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 217,
          "oddValue": 485,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 446,
      "layoutType": 1,
      "betDescription": "1° goal",
      "oddGroupList": [{
        "oddGroupDescription": "1° goal",
        "oddList": [{
          "betCode": 331,
          "oddValue": 190,
          "oddDescription": "Team 1",
          "resultCode": 1,
          "boxTitle": "Team 1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 331,
          "oddValue": 875,
          "oddDescription": "Nessuno",
          "resultCode": 2,
          "boxTitle": "Nessuno",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 331,
          "oddValue": 215,
          "oddDescription": "Team 2",
          "resultCode": 3,
          "boxTitle": "Team 2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 393,
      "layoutType": 1,
      "betDescription": "vincente a zero casa",
      "oddGroupList": [{
        "oddGroupDescription": "vincente a zero casa",
        "oddList": [{
          "betCode": 420,
          "oddValue": 400,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 420,
          "oddValue": 119,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 416,
      "layoutType": 1,
      "betDescription": "vincente a zero ospite",
      "oddGroupList": [{
        "oddGroupDescription": "vincente a zero ospite",
        "oddList": [{
          "betCode": 421,
          "oddValue": 500,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 421,
          "oddValue": 112,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 373,
      "layoutType": 5,
      "betDescription": "ris esatto 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "ris esatto 1° tempo",
        "oddList": [{
          "betCode": 422,
          "oddValue": 270,
          "oddDescription": "0-0",
          "resultCode": 1,
          "boxTitle": "0-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 500,
          "oddDescription": "0-1",
          "resultCode": 2,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 1700,
          "oddDescription": "0-2",
          "resultCode": 3,
          "boxTitle": "0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 2700,
          "oddDescription": "1-2",
          "resultCode": 4,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 450,
          "oddDescription": "1-0",
          "resultCode": 5,
          "boxTitle": "1-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 1400,
          "oddDescription": "2-0",
          "resultCode": 6,
          "boxTitle": "2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 2500,
          "oddDescription": "2-1",
          "resultCode": 7,
          "boxTitle": "2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 850,
          "oddDescription": "1-1",
          "resultCode": 8,
          "boxTitle": "1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 5900,
          "oddDescription": "2-2",
          "resultCode": 9,
          "boxTitle": "2-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 422,
          "oddValue": 2100,
          "oddDescription": "Altro",
          "resultCode": 10,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 372,
      "layoutType": 1,
      "betDescription": "GG/NG 1° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "GG/NG 1° tempo",
        "oddList": [{
          "betCode": 423,
          "oddValue": 470,
          "oddDescription": "Goal",
          "resultCode": 1,
          "boxTitle": "Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 423,
          "oddValue": 114,
          "oddDescription": "Nogoal",
          "resultCode": 2,
          "boxTitle": "Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 437,
      "layoutType": 4,
      "betDescription": "1X2 + U/O 2.5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + U/O 2.5",
        "oddList": [{
          "betCode": 424,
          "oddValue": 500,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 424,
          "oddValue": 410,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 424,
          "oddValue": 385,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 424,
          "oddValue": 1000,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 424,
          "oddValue": 650,
          "oddDescription": "2 + Under",
          "resultCode": 5,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 424,
          "oddValue": 500,
          "oddDescription": "2 + Over",
          "resultCode": 6,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 438,
      "layoutType": 4,
      "betDescription": "1X2 + GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + GG/NG",
        "oddList": [{
          "betCode": 425,
          "oddValue": 480,
          "oddDescription": "1 + Goal",
          "resultCode": 1,
          "boxTitle": "1 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 425,
          "oddValue": 400,
          "oddDescription": "1 + Nogoal",
          "resultCode": 2,
          "boxTitle": "1 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 425,
          "oddValue": 390,
          "oddDescription": "X + Goal",
          "resultCode": 3,
          "boxTitle": "X + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 425,
          "oddValue": 850,
          "oddDescription": "X + Nogoal",
          "resultCode": 4,
          "boxTitle": "X + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 425,
          "oddValue": 575,
          "oddDescription": "2 + Goal",
          "resultCode": 5,
          "boxTitle": "2 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 425,
          "oddValue": 500,
          "oddDescription": "2 + Nogoal",
          "resultCode": 6,
          "boxTitle": "2 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 395,
      "layoutType": 1,
      "betDescription": "U/O 0.5 casa",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 0.5 casa",
        "oddList": [{
          "betCode": 533,
          "oddValue": 345,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 533,
          "oddValue": 125,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 418,
      "layoutType": 1,
      "betDescription": "U/O 0.5 ospite",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 0.5 ospite",
        "oddList": [{
          "betCode": 534,
          "oddValue": 290,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 534,
          "oddValue": 134,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 398,
      "layoutType": 1,
      "betDescription": "U/O 1.5 casa",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 1.5 casa",
        "oddList": [{
          "betCode": 537,
          "oddValue": 150,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 537,
          "oddValue": 230,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 421,
      "layoutType": 1,
      "betDescription": "U/O 1.5 ospite",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 1.5 ospite",
        "oddList": [{
          "betCode": 538,
          "oddValue": 138,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 538,
          "oddValue": 265,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 401,
      "layoutType": 1,
      "betDescription": "U/O 2.5 casa",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 2.5 casa",
        "oddList": [{
          "betCode": 541,
          "oddValue": 109,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 541,
          "oddValue": 550,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 424,
      "layoutType": 1,
      "betDescription": "U/O 2.5 ospite",
      "oddGroupList": [{
        "oddGroupDescription": "U/O 2.5 ospite",
        "oddList": [{
          "betCode": 542,
          "oddValue": 105,
          "oddDescription": "Under",
          "resultCode": 1,
          "boxTitle": "Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 542,
          "oddValue": 675,
          "oddDescription": "Over",
          "resultCode": 2,
          "boxTitle": "Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 384,
      "layoutType": 1,
      "betDescription": "GG/NG 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "GG/NG 2° tempo",
        "oddList": [{
          "betCode": 549,
          "oddValue": 330,
          "oddDescription": "Goal",
          "resultCode": 1,
          "boxTitle": "Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 549,
          "oddValue": 125,
          "oddDescription": "Nogoal",
          "resultCode": 2,
          "boxTitle": "Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 374,
      "layoutType": 1,
      "betDescription": "segna goal casa 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal casa 1°tempo",
        "oddList": [{
          "betCode": 550,
          "oddValue": 205,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 550,
          "oddValue": 163,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 375,
      "layoutType": 1,
      "betDescription": "segna goal ospite 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal ospite 1°tempo",
        "oddList": [{
          "betCode": 551,
          "oddValue": 222,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 551,
          "oddValue": 153,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 386,
      "layoutType": 1,
      "betDescription": "segna goal casa 2°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal casa 2°tempo",
        "oddList": [{
          "betCode": 552,
          "oddValue": 173,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 552,
          "oddValue": 190,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 387,
      "layoutType": 1,
      "betDescription": "segna goal ospite 2°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "segna goal ospite 2°tempo",
        "oddList": [{
          "betCode": 553,
          "oddValue": 187,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 553,
          "oddValue": 177,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1667,
      "layoutType": 1,
      "betDescription": "dc in 1t",
      "oddGroupList": [{
        "oddGroupDescription": "dc in 1t",
        "oddList": [{
          "betCode": 554,
          "oddValue": 123,
          "oddDescription": "1X",
          "resultCode": 1,
          "boxTitle": "1X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 554,
          "oddValue": 355,
          "oddDescription": "2",
          "resultCode": 2,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1669,
      "layoutType": 1,
      "betDescription": "dc out 1t",
      "oddGroupList": [{
        "oddGroupDescription": "dc out 1t",
        "oddList": [{
          "betCode": 555,
          "oddValue": 305,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 555,
          "oddValue": 129,
          "oddDescription": "X2",
          "resultCode": 2,
          "boxTitle": "X2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1671,
      "layoutType": 1,
      "betDescription": "dc in/out 1t",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out 1t",
        "oddList": [{
          "betCode": 556,
          "oddValue": 210,
          "oddDescription": "X",
          "resultCode": 1,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 556,
          "oddValue": 160,
          "oddDescription": "12",
          "resultCode": 2,
          "boxTitle": "12",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1674,
      "layoutType": 1,
      "betDescription": "dc in 2t",
      "oddGroupList": [{
        "oddGroupDescription": "dc in 2t",
        "oddList": [{
          "betCode": 557,
          "oddValue": 126,
          "oddDescription": "1X",
          "resultCode": 1,
          "boxTitle": "1X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 557,
          "oddValue": 315,
          "oddDescription": "2",
          "resultCode": 2,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1676,
      "layoutType": 1,
      "betDescription": "dc out 2t",
      "oddGroupList": [{
        "oddGroupDescription": "dc out 2t",
        "oddList": [{
          "betCode": 558,
          "oddValue": 270,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 558,
          "oddValue": 136,
          "oddDescription": "X2",
          "resultCode": 2,
          "boxTitle": "X2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1678,
      "layoutType": 1,
      "betDescription": "dc in/out 2t",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out 2t",
        "oddList": [{
          "betCode": 559,
          "oddValue": 240,
          "oddDescription": "X",
          "resultCode": 1,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 559,
          "oddValue": 145,
          "oddDescription": "12",
          "resultCode": 2,
          "boxTitle": "12",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 458,
      "layoutType": 1,
      "betDescription": "tempo con piu' goal",
      "oddGroupList": [{
        "oddGroupDescription": "tempo con piu' goal",
        "oddList": [{
          "betCode": 560,
          "oddValue": 310,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 560,
          "oddValue": 340,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 560,
          "oddValue": 205,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 443,
      "layoutType": 4,
      "betDescription": "GG/NG 1°t. + GG/NG 2°t.",
      "oddGroupList": [{
        "oddGroupDescription": "GG/NG 1°t. + GG/NG 2°t.",
        "oddList": [{
          "betCode": 561,
          "oddValue": 148,
          "oddDescription": "Nogoal/Nogoal",
          "resultCode": 1,
          "boxTitle": "Nogoal/Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 561,
          "oddValue": 625,
          "oddDescription": "Goal/Nogoal",
          "resultCode": 2,
          "boxTitle": "Goal/Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 561,
          "oddValue": 1500,
          "oddDescription": "Goal/Goal",
          "resultCode": 3,
          "boxTitle": "Goal/Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 561,
          "oddValue": 410,
          "oddDescription": "Nogoal/Goal",
          "resultCode": 4,
          "boxTitle": "Nogoal/Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 385,
      "layoutType": 5,
      "betDescription": "ris esatto 2° tempo",
      "oddGroupList": [{
        "oddGroupDescription": "ris esatto 2° tempo",
        "oddList": [{
          "betCode": 562,
          "oddValue": 370,
          "oddDescription": "0-0",
          "resultCode": 1,
          "boxTitle": "0-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 550,
          "oddDescription": "0-1",
          "resultCode": 2,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 1500,
          "oddDescription": "0-2",
          "resultCode": 3,
          "boxTitle": "0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 1900,
          "oddDescription": "1-2",
          "resultCode": 4,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 480,
          "oddDescription": "1-0",
          "resultCode": 5,
          "boxTitle": "1-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 1200,
          "oddDescription": "2-0",
          "resultCode": 6,
          "boxTitle": "2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 1700,
          "oddDescription": "2-1",
          "resultCode": 7,
          "boxTitle": "2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 700,
          "oddDescription": "1-1",
          "resultCode": 8,
          "boxTitle": "1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 3900,
          "oddDescription": "2-2",
          "resultCode": 9,
          "boxTitle": "2-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 562,
          "oddValue": 1200,
          "oddDescription": "Altro",
          "resultCode": 10,
          "boxTitle": "Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 410,
      "layoutType": 1,
      "betDescription": "pari/dispari casa",
      "oddGroupList": [{
        "oddGroupDescription": "pari/dispari casa",
        "oddList": [{
          "betCode": 563,
          "oddValue": 172,
          "oddDescription": "Pari",
          "resultCode": 1,
          "boxTitle": "Pari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 563,
          "oddValue": 192,
          "oddDescription": "Dispari",
          "resultCode": 2,
          "boxTitle": "Dispari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 433,
      "layoutType": 1,
      "betDescription": "pari/dispari ospite",
      "oddGroupList": [{
        "oddGroupDescription": "pari/dispari ospite",
        "oddList": [{
          "betCode": 564,
          "oddValue": 165,
          "oddDescription": "Pari",
          "resultCode": 1,
          "boxTitle": "Pari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 564,
          "oddValue": 202,
          "oddDescription": "Dispari",
          "resultCode": 2,
          "boxTitle": "Dispari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 366,
      "layoutType": 3,
      "betDescription": "1X2 handicap 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1:0",
        "oddList": [{
          "betCode": 569,
          "oddValue": 123,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 569,
          "oddValue": 430,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 569,
          "oddValue": 1200,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "0:1",
        "oddList": [{
          "betCode": 569,
          "oddValue": 1000,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 569,
          "oddValue": 385,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 569,
          "oddValue": 129,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }]
    }, {
      "betId": 407,
      "layoutType": 4,
      "betDescription": "somma goal casa",
      "oddGroupList": [{
        "oddGroupDescription": "somma goal casa",
        "oddList": [{
          "betCode": 570,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 570,
          "oddValue": 245,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 570,
          "oddValue": 370,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 570,
          "oddValue": 550,
          "oddDescription": ">2",
          "resultCode": 4,
          "boxTitle": ">2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 430,
      "layoutType": 4,
      "betDescription": "somma goal ospite",
      "oddGroupList": [{
        "oddGroupDescription": "somma goal ospite",
        "oddList": [{
          "betCode": 571,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 571,
          "oddValue": 245,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 571,
          "oddValue": 410,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 571,
          "oddValue": 675,
          "oddDescription": ">2",
          "resultCode": 4,
          "boxTitle": ">2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 439,
      "layoutType": 4,
      "betDescription": "1X2 + U/O 1.5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + U/O 1.5",
        "oddList": [{
          "betCode": 572,
          "oddValue": 725,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 572,
          "oddValue": 305,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 572,
          "oddValue": 875,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 572,
          "oddValue": 390,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 572,
          "oddValue": 900,
          "oddDescription": "2 + Under",
          "resultCode": 5,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 572,
          "oddValue": 375,
          "oddDescription": "2 + Over",
          "resultCode": 6,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 440,
      "layoutType": 4,
      "betDescription": "1X2 + U/O 3.5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + U/O 3.5",
        "oddList": [{
          "betCode": 573,
          "oddValue": 300,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 573,
          "oddValue": 775,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 573,
          "oddValue": 370,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 573,
          "oddValue": 1000,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 573,
          "oddValue": 375,
          "oddDescription": "2 + Under",
          "resultCode": 5,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 573,
          "oddValue": 950,
          "oddDescription": "2 + Over",
          "resultCode": 6,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 441,
      "layoutType": 4,
      "betDescription": "1X2 + U/O 4.5",
      "oddGroupList": [{
        "oddGroupDescription": "1X2 + U/O 4.5",
        "oddList": [{
          "betCode": 574,
          "oddValue": 260,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 574,
          "oddValue": 1300,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 574,
          "oddValue": 320,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 574,
          "oddValue": 3000,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 574,
          "oddValue": 330,
          "oddDescription": "2 + Under",
          "resultCode": 5,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 574,
          "oddValue": 1500,
          "oddDescription": "2 + Over",
          "resultCode": 6,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 442,
      "layoutType": 4,
      "betDescription": "GG/NG + U/O 2.5",
      "oddGroupList": [{
        "oddGroupDescription": "GG/NG + U/O 2.5",
        "oddList": [{
          "betCode": 575,
          "oddValue": 550,
          "oddDescription": "Goal + Under",
          "resultCode": 1,
          "boxTitle": "Goal + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 575,
          "oddValue": 1000,
          "oddDescription": "Nogoal + Over",
          "resultCode": 2,
          "boxTitle": "Nogoal + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 575,
          "oddValue": 220,
          "oddDescription": "Nogoal + Under",
          "resultCode": 3,
          "boxTitle": "Nogoal + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 575,
          "oddValue": 230,
          "oddDescription": "Goal + Over",
          "resultCode": 4,
          "boxTitle": "Goal + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 444,
      "layoutType": 4,
      "betDescription": "1x2  1°tempo + u/o 1.5 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1x2  1°tempo + u/o 1.5 1°tempo",
        "oddList": [{
          "betCode": 576,
          "oddValue": 450,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 576,
          "oddValue": 725,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 576,
          "oddValue": 270,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 576,
          "oddValue": 725,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 576,
          "oddValue": 500,
          "oddDescription": "2 + Under",
          "resultCode": 5,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 576,
          "oddValue": 900,
          "oddDescription": "2 + Over",
          "resultCode": 6,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 445,
      "layoutType": 4,
      "betDescription": "1x2  1°tempo + gg/ng  1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1x2  1°tempo + gg/ng  1°tempo",
        "oddList": [{
          "betCode": 577,
          "oddValue": 1600,
          "oddDescription": "1 + Goal",
          "resultCode": 1,
          "boxTitle": "1 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 577,
          "oddValue": 330,
          "oddDescription": "1 + Nogoal",
          "resultCode": 2,
          "boxTitle": "1 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 577,
          "oddValue": 725,
          "oddDescription": "X + Goal",
          "resultCode": 3,
          "boxTitle": "X + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 577,
          "oddValue": 270,
          "oddDescription": "X + Nogoal",
          "resultCode": 4,
          "boxTitle": "X + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 577,
          "oddValue": 1800,
          "oddDescription": "2 + Goal",
          "resultCode": 5,
          "boxTitle": "2 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 577,
          "oddValue": 380,
          "oddDescription": "2 + Nogoal",
          "resultCode": 6,
          "boxTitle": "2 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1695,
      "layoutType": 1,
      "betDescription": "t1 vince almeno un tempo",
      "oddGroupList": [{
        "oddGroupDescription": "t1 vince almeno un tempo",
        "oddList": [{
          "betCode": 670,
          "oddValue": 170,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 670,
          "oddValue": 195,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1700,
      "layoutType": 1,
      "betDescription": "t2 vince almeno un tempo",
      "oddGroupList": [{
        "oddGroupDescription": "t2 vince almeno un tempo",
        "oddList": [{
          "betCode": 671,
          "oddValue": 195,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 671,
          "oddValue": 170,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1697,
      "layoutType": 1,
      "betDescription": "t1 vince entrambi i tempi",
      "oddGroupList": [{
        "oddGroupDescription": "t1 vince entrambi i tempi",
        "oddList": [{
          "betCode": 672,
          "oddValue": 775,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 672,
          "oddValue": 103,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1699,
      "layoutType": 1,
      "betDescription": "t1 segna entrambi i tempi",
      "oddGroupList": [{
        "oddGroupDescription": "t1 segna entrambi i tempi",
        "oddList": [{
          "betCode": 674,
          "oddValue": 375,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 674,
          "oddValue": 119,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1705,
      "layoutType": 1,
      "betDescription": "t2 segna entrambi i tempi",
      "oddGroupList": [{
        "oddGroupDescription": "t2 segna entrambi i tempi",
        "oddList": [{
          "betCode": 675,
          "oddValue": 440,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 675,
          "oddValue": 115,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1615,
      "layoutType": 4,
      "betDescription": "dc in + U/O 1,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in + U/O 1,5",
        "oddList": [{
          "betCode": 676,
          "oddValue": 440,
          "oddDescription": "1X + Under",
          "resultCode": 1,
          "boxTitle": "1X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 676,
          "oddValue": 180,
          "oddDescription": "1X + Over",
          "resultCode": 2,
          "boxTitle": "1X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 676,
          "oddValue": 900,
          "oddDescription": "2 + Under",
          "resultCode": 3,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 676,
          "oddValue": 390,
          "oddDescription": "2 + Over",
          "resultCode": 4,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1619,
      "layoutType": 4,
      "betDescription": "dc in + U/O 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in + U/O 2,5",
        "oddList": [{
          "betCode": 677,
          "oddValue": 220,
          "oddDescription": "1X + Under",
          "resultCode": 1,
          "boxTitle": "1X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 677,
          "oddValue": 310,
          "oddDescription": "1X + Over",
          "resultCode": 2,
          "boxTitle": "1X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 677,
          "oddValue": 625,
          "oddDescription": "2 + Under",
          "resultCode": 3,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 677,
          "oddValue": 500,
          "oddDescription": "2 + Over",
          "resultCode": 4,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1623,
      "layoutType": 4,
      "betDescription": "dc in + U/O 3,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in + U/O 3,5",
        "oddList": [{
          "betCode": 678,
          "oddValue": 175,
          "oddDescription": "1X + Under",
          "resultCode": 1,
          "boxTitle": "1X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 678,
          "oddValue": 490,
          "oddDescription": "1X + Over",
          "resultCode": 2,
          "boxTitle": "1X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 678,
          "oddValue": 380,
          "oddDescription": "2 + Under",
          "resultCode": 3,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 678,
          "oddValue": 1000,
          "oddDescription": "2 + Over",
          "resultCode": 4,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1627,
      "layoutType": 4,
      "betDescription": "dc in + U/O 4,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in + U/O 4,5",
        "oddList": [{
          "betCode": 679,
          "oddValue": 145,
          "oddDescription": "1X + Under",
          "resultCode": 1,
          "boxTitle": "1X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 679,
          "oddValue": 1100,
          "oddDescription": "1X + Over",
          "resultCode": 2,
          "boxTitle": "1X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 679,
          "oddValue": 335,
          "oddDescription": "2 + Under",
          "resultCode": 3,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 679,
          "oddValue": 1600,
          "oddDescription": "2 + Over",
          "resultCode": 4,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1617,
      "layoutType": 4,
      "betDescription": "dc in/out + U/O 1,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out + U/O 1,5",
        "oddList": [{
          "betCode": 680,
          "oddValue": 450,
          "oddDescription": "12 + Under",
          "resultCode": 1,
          "boxTitle": "12 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 680,
          "oddValue": 180,
          "oddDescription": "12 + Over",
          "resultCode": 2,
          "boxTitle": "12 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 680,
          "oddValue": 850,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 680,
          "oddValue": 400,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1621,
      "layoutType": 4,
      "betDescription": "dc in/out + U/O 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out + U/O 2,5",
        "oddList": [{
          "betCode": 681,
          "oddValue": 285,
          "oddDescription": "12 + Under",
          "resultCode": 1,
          "boxTitle": "12 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 681,
          "oddValue": 235,
          "oddDescription": "12 + Over",
          "resultCode": 2,
          "boxTitle": "12 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 681,
          "oddValue": 375,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 681,
          "oddValue": 1000,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1625,
      "layoutType": 4,
      "betDescription": "dc in/out + u/o 3,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out + u/o 3,5",
        "oddList": [{
          "betCode": 682,
          "oddValue": 175,
          "oddDescription": "12 + Under",
          "resultCode": 1,
          "boxTitle": "12 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 682,
          "oddValue": 480,
          "oddDescription": "12 + Over",
          "resultCode": 2,
          "boxTitle": "12 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 682,
          "oddValue": 375,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 682,
          "oddValue": 1000,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1629,
      "layoutType": 4,
      "betDescription": "dc in/out + U/O 4,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out + U/O 4,5",
        "oddList": [{
          "betCode": 683,
          "oddValue": 152,
          "oddDescription": "12 + Under",
          "resultCode": 1,
          "boxTitle": "12 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 683,
          "oddValue": 825,
          "oddDescription": "12 + Over",
          "resultCode": 2,
          "boxTitle": "12 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 683,
          "oddValue": 300,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 683,
          "oddValue": 3300,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1616,
      "layoutType": 4,
      "betDescription": "dc out + U/O 1,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc out + U/O 1,5",
        "oddList": [{
          "betCode": 684,
          "oddValue": 490,
          "oddDescription": "X2 + Under",
          "resultCode": 1,
          "boxTitle": "X2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 684,
          "oddValue": 205,
          "oddDescription": "X2 + Over",
          "resultCode": 2,
          "boxTitle": "X2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 684,
          "oddValue": 725,
          "oddDescription": "1 + Under",
          "resultCode": 3,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 684,
          "oddValue": 305,
          "oddDescription": "1 + Over",
          "resultCode": 4,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1620,
      "layoutType": 4,
      "betDescription": "dc out + U/O 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc out + U/O 2,5",
        "oddList": [{
          "betCode": 685,
          "oddValue": 245,
          "oddDescription": "X2 + Under",
          "resultCode": 1,
          "boxTitle": "X2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 685,
          "oddValue": 355,
          "oddDescription": "X2 + Over",
          "resultCode": 2,
          "boxTitle": "X2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 685,
          "oddValue": 490,
          "oddDescription": "1 + Under",
          "resultCode": 3,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 685,
          "oddValue": 410,
          "oddDescription": "1 + Over",
          "resultCode": 4,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1624,
      "layoutType": 4,
      "betDescription": "dc out + U/O 3,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc out + U/O 3,5",
        "oddList": [{
          "betCode": 686,
          "oddValue": 195,
          "oddDescription": "X2 + Under",
          "resultCode": 1,
          "boxTitle": "X2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 686,
          "oddValue": 550,
          "oddDescription": "X2 + Over",
          "resultCode": 2,
          "boxTitle": "X2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 686,
          "oddValue": 305,
          "oddDescription": "1 + Under",
          "resultCode": 3,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 686,
          "oddValue": 800,
          "oddDescription": "1 + Over",
          "resultCode": 4,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1628,
      "layoutType": 4,
      "betDescription": "dc out + U/O 4,5",
      "oddGroupList": [{
        "oddGroupDescription": "dc out + U/O 4,5",
        "oddList": [{
          "betCode": 687,
          "oddValue": 160,
          "oddDescription": "X2 + Under",
          "resultCode": 1,
          "boxTitle": "X2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 687,
          "oddValue": 1300,
          "oddDescription": "X2 + Over",
          "resultCode": 2,
          "boxTitle": "X2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 687,
          "oddValue": 265,
          "oddDescription": "1 + Under",
          "resultCode": 3,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 687,
          "oddValue": 1300,
          "oddDescription": "1 + Over",
          "resultCode": 4,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1631,
      "layoutType": 4,
      "betDescription": "dc in + GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "dc in + GG/NG",
        "oddList": [{
          "betCode": 688,
          "oddValue": 235,
          "oddDescription": "1X + Goal",
          "resultCode": 1,
          "boxTitle": "1X + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 688,
          "oddValue": 285,
          "oddDescription": "1X + Nogoal",
          "resultCode": 2,
          "boxTitle": "1X + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 688,
          "oddValue": 600,
          "oddDescription": "2 + Goal",
          "resultCode": 3,
          "boxTitle": "2 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 688,
          "oddValue": 500,
          "oddDescription": "2 + Nogoal",
          "resultCode": 4,
          "boxTitle": "2 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1633,
      "layoutType": 4,
      "betDescription": "dc in/out+GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "dc in/out+GG/NG",
        "oddList": [{
          "betCode": 689,
          "oddValue": 285,
          "oddDescription": "12 + Goal",
          "resultCode": 1,
          "boxTitle": "12 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 689,
          "oddValue": 235,
          "oddDescription": "12 + Nogoal",
          "resultCode": 2,
          "boxTitle": "12 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 689,
          "oddValue": 400,
          "oddDescription": "X + Goal",
          "resultCode": 3,
          "boxTitle": "X + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 689,
          "oddValue": 850,
          "oddDescription": "X + Nogoal",
          "resultCode": 4,
          "boxTitle": "X + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1632,
      "layoutType": 4,
      "betDescription": "dc out + gg/ng",
      "oddGroupList": [{
        "oddGroupDescription": "dc out + gg/ng",
        "oddList": [{
          "betCode": 690,
          "oddValue": 250,
          "oddDescription": "X2 + Goal",
          "resultCode": 1,
          "boxTitle": "X2 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 690,
          "oddValue": 340,
          "oddDescription": "X2 + Nogoal",
          "resultCode": 2,
          "boxTitle": "X2 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 690,
          "oddValue": 500,
          "oddDescription": "1 + Goal",
          "resultCode": 3,
          "boxTitle": "1 + Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 690,
          "oddValue": 400,
          "oddDescription": "1 + Nogoal",
          "resultCode": 4,
          "boxTitle": "1 + Nogoal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1377,
      "layoutType": 1,
      "betDescription": "tempo del 1° goal",
      "oddGroupList": [{
        "oddGroupDescription": "tempo del 1° goal",
        "oddList": [{
          "betCode": 698,
          "oddValue": 140,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 698,
          "oddValue": 1000,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 698,
          "oddValue": 350,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1680,
      "layoutType": 4,
      "betDescription": "margine vittoria 4",
      "oddGroupList": [{
        "oddGroupDescription": "margine vittoria 4",
        "oddList": [{
          "betCode": 709,
          "oddValue": 310,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 709,
          "oddValue": 230,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 709,
          "oddValue": 430,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 709,
          "oddValue": 775,
          "oddDescription": "> 2",
          "resultCode": 4,
          "boxTitle": "> 2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1681,
      "layoutType": 5,
      "betDescription": "margine vittoria 10",
      "oddGroupList": [{
        "oddGroupDescription": "margine vittoria 10",
        "oddList": [{
          "betCode": 710,
          "oddValue": 410,
          "oddDescription": "Team 1 Con 1 Goal Di Scarto",
          "resultCode": 1,
          "boxTitle": "Team 1 Con 1 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 490,
          "oddDescription": "Team 2 Con 1 Goal Di Scarto",
          "resultCode": 2,
          "boxTitle": "Team 2 Con 1 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 725,
          "oddDescription": "Team1 Con 2 Goal Di Scarto",
          "resultCode": 3,
          "boxTitle": "Team1 Con 2 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 900,
          "oddDescription": "Team 2 Con 2 Goal Di Scarto",
          "resultCode": 4,
          "boxTitle": "Team 2 Con 2 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 1700,
          "oddDescription": "Team 1 Con 3 Goal Di Scarto",
          "resultCode": 5,
          "boxTitle": "Team 1 Con 3 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 2100,
          "oddDescription": "Team 2 Con 3 Goal Di Scarto",
          "resultCode": 6,
          "boxTitle": "Team 2 Con 3 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 3300,
          "oddDescription": "Team 1 Con >3 Goal Di Scarto",
          "resultCode": 7,
          "boxTitle": "Team 1 Con >3 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 4200,
          "oddDescription": "Team 2 Con >3 Goal Di Scarto",
          "resultCode": 8,
          "boxTitle": "Team 2 Con >3 Goal Di Scarto",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 390,
          "oddDescription": "Pareggio Con Goal",
          "resultCode": 9,
          "boxTitle": "Pareggio Con Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 710,
          "oddValue": 875,
          "oddDescription": "Nessun Goal",
          "resultCode": 10,
          "boxTitle": "Nessun Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4405,
      "layoutType": 3,
      "betDescription": "1X2 handicap 2°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "1:0",
        "oddList": [{
          "betCode": 4009,
          "oddValue": 126,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 430,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 1000,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [-100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "0:1",
        "oddList": [{
          "betCode": 4009,
          "oddValue": 800,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 385,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 136,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [100, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }, {
        "oddGroupDescription": "0:2",
        "oddList": [{
          "betCode": 4009,
          "oddValue": 2400,
          "oddDescription": "1",
          "resultCode": 1,
          "boxTitle": "1",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 1000,
          "oddDescription": "X",
          "resultCode": 2,
          "boxTitle": "X",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }, {
          "betCode": 4009,
          "oddValue": 105,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [200, 0, 0, 0, 0, 0],
          "addInfo": true
        }]
      }]
    }, {
      "betId": 1508,
      "layoutType": 5,
      "betDescription": "ris esatto a gruppi",
      "oddGroupList": [{
        "oddGroupDescription": "ris esatto a gruppi",
        "oddList": [{
          "betCode": 4256,
          "oddValue": 420,
          "oddDescription": "1:0,2:0 O 3:0",
          "resultCode": 1,
          "boxTitle": "1:0,2:0 O 3:0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 550,
          "oddDescription": "0:1,0:2 O 0:3",
          "resultCode": 2,
          "boxTitle": "0:1,0:2 O 0:3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 4300,
          "oddDescription": "4:0,5:0 O 6:0",
          "resultCode": 3,
          "boxTitle": "4:0,5:0 O 6:0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 5300,
          "oddDescription": "0:4,0:5 O 0:6",
          "resultCode": 4,
          "boxTitle": "0:4,0:5 O 0:6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 650,
          "oddDescription": "2:1,3:1 O 4:1",
          "resultCode": 5,
          "boxTitle": "2:1,3:1 O 4:1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 775,
          "oddDescription": "1:2,1:3 O 1:4",
          "resultCode": 6,
          "boxTitle": "1:2,1:3 O 1:4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 2100,
          "oddDescription": "3:2,4:2,4:3 O 5:1",
          "resultCode": 7,
          "boxTitle": "3:2,4:2,4:3 O 5:1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 2400,
          "oddDescription": "2:3,2:4,3:4 O 1:5",
          "resultCode": 8,
          "boxTitle": "2:3,2:4,3:4 O 1:5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 7000,
          "oddDescription": "1-Altro",
          "resultCode": 9,
          "boxTitle": "1-Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 7800,
          "oddDescription": "2-Altro",
          "resultCode": 10,
          "boxTitle": "2-Altro",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 4256,
          "oddValue": 310,
          "oddDescription": "X",
          "resultCode": 11,
          "boxTitle": "X",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1603,
      "layoutType": 4,
      "betDescription": "multigoal 1 (1-2)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 1 (1-2)",
        "oddList": [{
          "betCode": 6308,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6308,
          "oddValue": 205,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6308,
          "oddValue": 265,
          "oddDescription": "3-4",
          "resultCode": 3,
          "boxTitle": "3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6308,
          "oddValue": 900,
          "oddDescription": "5-6",
          "resultCode": 4,
          "boxTitle": "5-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6308,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 5,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1604,
      "layoutType": 4,
      "betDescription": "multigoal 2 (1-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 2 (1-3)",
        "oddList": [{
          "betCode": 6309,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6309,
          "oddValue": 143,
          "oddDescription": "1-3",
          "resultCode": 2,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6309,
          "oddValue": 440,
          "oddDescription": "4-5",
          "resultCode": 3,
          "boxTitle": "4-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6309,
          "oddValue": 2500,
          "oddDescription": "6",
          "resultCode": 4,
          "boxTitle": "6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6309,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 5,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1608,
      "layoutType": 4,
      "betDescription": "multigoal 3 (2-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 3 (2-3)",
        "oddList": [{
          "betCode": 6310,
          "oddValue": 315,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6310,
          "oddValue": 200,
          "oddDescription": "2-3",
          "resultCode": 2,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6310,
          "oddValue": 385,
          "oddDescription": "4-6",
          "resultCode": 3,
          "boxTitle": "4-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6310,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1605,
      "layoutType": 4,
      "betDescription": "multigoal 4 (1-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 4 (1-4)",
        "oddList": [{
          "betCode": 6311,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6311,
          "oddValue": 117,
          "oddDescription": "1-4",
          "resultCode": 2,
          "boxTitle": "1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6311,
          "oddValue": 900,
          "oddDescription": "5-6",
          "resultCode": 3,
          "boxTitle": "5-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6311,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1609,
      "layoutType": 4,
      "betDescription": "multigoal 5 (2-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 5 (2-4)",
        "oddList": [{
          "betCode": 6312,
          "oddValue": 315,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6312,
          "oddValue": 152,
          "oddDescription": "2-4",
          "resultCode": 2,
          "boxTitle": "2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6312,
          "oddValue": 900,
          "oddDescription": "5-6",
          "resultCode": 3,
          "boxTitle": "5-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6312,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1606,
      "layoutType": 4,
      "betDescription": "multigoal 6 (1-5)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 6 (1-5)",
        "oddList": [{
          "betCode": 6313,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6313,
          "oddValue": 109,
          "oddDescription": "1-5",
          "resultCode": 2,
          "boxTitle": "1-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6313,
          "oddValue": 2300,
          "oddDescription": "6",
          "resultCode": 3,
          "boxTitle": "6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6313,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1610,
      "layoutType": 4,
      "betDescription": "multigoal 7 (2-5)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 7 (2-5)",
        "oddList": [{
          "betCode": 6314,
          "oddValue": 315,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6314,
          "oddValue": 139,
          "oddDescription": "2-5",
          "resultCode": 2,
          "boxTitle": "2-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6314,
          "oddValue": 2300,
          "oddDescription": "6",
          "resultCode": 3,
          "boxTitle": "6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6314,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1612,
      "layoutType": 4,
      "betDescription": "multigoal 8 (3-5)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 8 (3-5)",
        "oddList": [{
          "betCode": 6315,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6315,
          "oddValue": 205,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6315,
          "oddValue": 225,
          "oddDescription": "3-5",
          "resultCode": 3,
          "boxTitle": "3-5",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6315,
          "oddValue": 2500,
          "oddDescription": "6",
          "resultCode": 4,
          "boxTitle": "6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6315,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 5,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1607,
      "layoutType": 1,
      "betDescription": "multigoal 9 (1-6)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 9 (1-6)",
        "oddList": [{
          "betCode": 6316,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6316,
          "oddValue": 105,
          "oddDescription": "1-6",
          "resultCode": 2,
          "boxTitle": "1-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6316,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 3,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1611,
      "layoutType": 1,
      "betDescription": "multigoal 10 (2-6)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 10 (2-6)",
        "oddList": [{
          "betCode": 6317,
          "oddValue": 315,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6317,
          "oddValue": 132,
          "oddDescription": "2-6",
          "resultCode": 2,
          "boxTitle": "2-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6317,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 3,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1613,
      "layoutType": 4,
      "betDescription": "multigoal 11 (3-6)",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 11 (3-6)",
        "oddList": [{
          "betCode": 6318,
          "oddValue": 850,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6318,
          "oddValue": 205,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6318,
          "oddValue": 210,
          "oddDescription": "3-6",
          "resultCode": 3,
          "boxTitle": "3-6",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 6318,
          "oddValue": 2500,
          "oddDescription": "7 E Piu",
          "resultCode": 4,
          "boxTitle": "7 E Piu",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1641,
      "layoutType": 4,
      "betDescription": "1t (dc in + u/o 1,5)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc in + u/o 1,5)",
        "oddList": [{
          "betCode": 7262,
          "oddValue": 170,
          "oddDescription": "1X + Under",
          "resultCode": 1,
          "boxTitle": "1X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7262,
          "oddValue": 410,
          "oddDescription": "1X + Over",
          "resultCode": 2,
          "boxTitle": "1X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7262,
          "oddValue": 500,
          "oddDescription": "2 + Under",
          "resultCode": 3,
          "boxTitle": "2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7262,
          "oddValue": 900,
          "oddDescription": "2 + Over",
          "resultCode": 4,
          "boxTitle": "2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1645,
      "layoutType": 4,
      "betDescription": "1t (dc in + gg/ng)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc in + gg/ng)",
        "oddList": [{
          "betCode": 7263,
          "oddValue": 575,
          "oddDescription": "1X + Gol",
          "resultCode": 1,
          "boxTitle": "1X + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7263,
          "oddValue": 152,
          "oddDescription": "1X + Nogol",
          "resultCode": 2,
          "boxTitle": "1X + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7263,
          "oddValue": 1900,
          "oddDescription": "2 + Gol",
          "resultCode": 3,
          "boxTitle": "2 + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7263,
          "oddValue": 385,
          "oddDescription": "2 + Nogol",
          "resultCode": 4,
          "boxTitle": "2 + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1642,
      "layoutType": 4,
      "betDescription": "1t (dc out + u/o 1,5)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc out + u/o 1,5)",
        "oddList": [{
          "betCode": 7264,
          "oddValue": 450,
          "oddDescription": "1 + Under",
          "resultCode": 1,
          "boxTitle": "1 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7264,
          "oddValue": 725,
          "oddDescription": "1 + Over",
          "resultCode": 2,
          "boxTitle": "1 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7264,
          "oddValue": 180,
          "oddDescription": "X2 + Under",
          "resultCode": 3,
          "boxTitle": "X2 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7264,
          "oddValue": 450,
          "oddDescription": "X2 + Over",
          "resultCode": 4,
          "boxTitle": "X2 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1646,
      "layoutType": 4,
      "betDescription": "1t (dc out + gg/ng)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc out + gg/ng)",
        "oddList": [{
          "betCode": 7265,
          "oddValue": 1700,
          "oddDescription": "1 + Gol",
          "resultCode": 1,
          "boxTitle": "1 + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7265,
          "oddValue": 335,
          "oddDescription": "1 + Nogol",
          "resultCode": 2,
          "boxTitle": "1 + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7265,
          "oddValue": 600,
          "oddDescription": "X2 + Gol",
          "resultCode": 3,
          "boxTitle": "X2 + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7265,
          "oddValue": 160,
          "oddDescription": "X2 + Nogol",
          "resultCode": 4,
          "boxTitle": "X2 + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1643,
      "layoutType": 4,
      "betDescription": "1t (dc in/out + u/o 1,5)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc in/out + u/o 1,5)",
        "oddList": [{
          "betCode": 7266,
          "oddValue": 245,
          "oddDescription": "12 + Under",
          "resultCode": 1,
          "boxTitle": "12 + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7266,
          "oddValue": 450,
          "oddDescription": "12 + Over",
          "resultCode": 2,
          "boxTitle": "12 + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7266,
          "oddValue": 270,
          "oddDescription": "X + Under",
          "resultCode": 3,
          "boxTitle": "X + Under",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7266,
          "oddValue": 750,
          "oddDescription": "X + Over",
          "resultCode": 4,
          "boxTitle": "X + Over",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1647,
      "layoutType": 4,
      "betDescription": "1t (dc in/out+gg/ng)",
      "oddGroupList": [{
        "oddGroupDescription": "1t (dc in/out+gg/ng)",
        "oddList": [{
          "betCode": 7278,
          "oddValue": 1100,
          "oddDescription": "12 + Gol",
          "resultCode": 1,
          "boxTitle": "12 + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7278,
          "oddValue": 185,
          "oddDescription": "12 + Nogol",
          "resultCode": 2,
          "boxTitle": "12 + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7278,
          "oddValue": 750,
          "oddDescription": "X + Gol",
          "resultCode": 3,
          "boxTitle": "X + Gol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7278,
          "oddValue": 270,
          "oddDescription": "X + Nogol",
          "resultCode": 4,
          "boxTitle": "X + Nogol",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1714,
      "layoutType": 1,
      "betDescription": "1 o over 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "1 o over 2,5",
        "oddList": [{
          "betCode": 7322,
          "oddValue": 148,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7322,
          "oddValue": 245,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1718,
      "layoutType": 1,
      "betDescription": "x o over 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "x o over 2,5",
        "oddList": [{
          "betCode": 7323,
          "oddValue": 135,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7323,
          "oddValue": 285,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1722,
      "layoutType": 1,
      "betDescription": "2 o over 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "2 o over 2,5",
        "oddList": [{
          "betCode": 7324,
          "oddValue": 158,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7324,
          "oddValue": 220,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1713,
      "layoutType": 1,
      "betDescription": "1 o under 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "1 o under 2,5",
        "oddList": [{
          "betCode": 7325,
          "oddValue": 124,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7325,
          "oddValue": 355,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1717,
      "layoutType": 1,
      "betDescription": "x o under 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "x o under 2,5",
        "oddList": [{
          "betCode": 7326,
          "oddValue": 150,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7326,
          "oddValue": 235,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1721,
      "layoutType": 1,
      "betDescription": "2 o under 2,5",
      "oddGroupList": [{
        "oddGroupDescription": "2 o under 2,5",
        "oddList": [{
          "betCode": 7327,
          "oddValue": 131,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7327,
          "oddValue": 310,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1715,
      "layoutType": 1,
      "betDescription": "1 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "1 o gg",
        "oddList": [{
          "betCode": 7328,
          "oddValue": 126,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7328,
          "oddValue": 340,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1719,
      "layoutType": 1,
      "betDescription": "x o gg",
      "oddGroupList": [{
        "oddGroupDescription": "x o gg",
        "oddList": [{
          "betCode": 7329,
          "oddValue": 150,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7329,
          "oddValue": 235,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1723,
      "layoutType": 1,
      "betDescription": "2 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "2 o gg",
        "oddList": [{
          "betCode": 7330,
          "oddValue": 135,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7330,
          "oddValue": 285,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1716,
      "layoutType": 1,
      "betDescription": "1 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "1 o ng",
        "oddList": [{
          "betCode": 7331,
          "oddValue": 145,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7331,
          "oddValue": 250,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1720,
      "layoutType": 1,
      "betDescription": "x o ng",
      "oddGroupList": [{
        "oddGroupDescription": "x o ng",
        "oddList": [{
          "betCode": 7332,
          "oddValue": 135,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7332,
          "oddValue": 285,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1724,
      "layoutType": 1,
      "betDescription": "2 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "2 o ng",
        "oddList": [{
          "betCode": 7333,
          "oddValue": 152,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7333,
          "oddValue": 235,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1727,
      "layoutType": 1,
      "betDescription": "over 2,5 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "over 2,5 o gg",
        "oddList": [{
          "betCode": 7340,
          "oddValue": 156,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7340,
          "oddValue": 220,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1728,
      "layoutType": 1,
      "betDescription": "over 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "over 2,5 o ng",
        "oddList": [{
          "betCode": 7341,
          "oddValue": 110,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7341,
          "oddValue": 550,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1726,
      "layoutType": 1,
      "betDescription": "under 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "under 2,5 o ng",
        "oddList": [{
          "betCode": 7343,
          "oddValue": 152,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7343,
          "oddValue": 230,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1509,
      "layoutType": 4,
      "betDescription": "ris. esatto parziale/finale",
      "oddGroupList": [{
        "oddGroupDescription": "ris. esatto parziale/finale",
        "oddList": [{
          "betCode": 7448,
          "oddValue": 850,
          "oddDescription": "0-0 / 0-0",
          "resultCode": 1,
          "boxTitle": "0-0 / 0-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1200,
          "oddDescription": "0-0 / 1-0",
          "resultCode": 2,
          "boxTitle": "0-0 / 1-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1400,
          "oddDescription": "0-0 / 0-1",
          "resultCode": 3,
          "boxTitle": "0-0 / 0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2900,
          "oddDescription": "0-0 / 2-0",
          "resultCode": 4,
          "boxTitle": "0-0 / 2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1800,
          "oddDescription": "0-0 / 1-1",
          "resultCode": 5,
          "boxTitle": "0-0 / 1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3600,
          "oddDescription": "0-0 / 0-2",
          "resultCode": 6,
          "boxTitle": "0-0 / 0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 8000,
          "oddDescription": "0-0 / 3-0",
          "resultCode": 7,
          "boxTitle": "0-0 / 3-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 4100,
          "oddDescription": "0-0 / 2-1",
          "resultCode": 8,
          "boxTitle": "0-0 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 4500,
          "oddDescription": "0-0 / 1-2",
          "resultCode": 9,
          "boxTitle": "0-0 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 9700,
          "oddDescription": "0-0 / 0-3",
          "resultCode": 10,
          "boxTitle": "0-0 / 0-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3500,
          "oddDescription": "0-0 / 4+",
          "resultCode": 11,
          "boxTitle": "0-0 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1600,
          "oddDescription": "1-0 / 1-0",
          "resultCode": 12,
          "boxTitle": "1-0 / 1-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2000,
          "oddDescription": "1-0 / 2-0",
          "resultCode": 13,
          "boxTitle": "1-0 / 2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2200,
          "oddDescription": "1-0 / 1-1",
          "resultCode": 14,
          "boxTitle": "1-0 / 1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 4600,
          "oddDescription": "1-0 / 3-0",
          "resultCode": 15,
          "boxTitle": "1-0 / 3-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2900,
          "oddDescription": "1-0 / 2-1",
          "resultCode": 16,
          "boxTitle": "1-0 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 5400,
          "oddDescription": "1-0 / 1-2",
          "resultCode": 17,
          "boxTitle": "1-0 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2100,
          "oddDescription": "1-0 / 4+",
          "resultCode": 18,
          "boxTitle": "1-0 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1700,
          "oddDescription": "0-1 / 0-1",
          "resultCode": 19,
          "boxTitle": "0-1 / 0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2200,
          "oddDescription": "0-1 / 1-1",
          "resultCode": 20,
          "boxTitle": "0-1 / 1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2500,
          "oddDescription": "0-1 / 0-2",
          "resultCode": 21,
          "boxTitle": "0-1 / 0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 5000,
          "oddDescription": "0-1 / 2-1",
          "resultCode": 22,
          "boxTitle": "0-1 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3200,
          "oddDescription": "0-1 / 1-2",
          "resultCode": 23,
          "boxTitle": "0-1 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 5900,
          "oddDescription": "0-1 / 0-3",
          "resultCode": 24,
          "boxTitle": "0-1 / 0-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2400,
          "oddDescription": "0-1 / 4+",
          "resultCode": 25,
          "boxTitle": "0-1 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2800,
          "oddDescription": "1-1 / 1-1",
          "resultCode": 26,
          "boxTitle": "1-1 / 1-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3600,
          "oddDescription": "1-1 / 2-1",
          "resultCode": 27,
          "boxTitle": "1-1 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3900,
          "oddDescription": "1-1 / 1-2",
          "resultCode": 28,
          "boxTitle": "1-1 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1800,
          "oddDescription": "1-1 / 4+",
          "resultCode": 29,
          "boxTitle": "1-1 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 4500,
          "oddDescription": "2-0 / 2-0",
          "resultCode": 30,
          "boxTitle": "2-0 / 2-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 5500,
          "oddDescription": "2-0 / 3-0",
          "resultCode": 31,
          "boxTitle": "2-0 / 3-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 6000,
          "oddDescription": "2-0 / 2-1",
          "resultCode": 32,
          "boxTitle": "2-0 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 2900,
          "oddDescription": "2-0 / 4+",
          "resultCode": 33,
          "boxTitle": "2-0 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 5300,
          "oddDescription": "0-2 / 0-2",
          "resultCode": 34,
          "boxTitle": "0-2 / 0-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 6500,
          "oddDescription": "0-2 / 1-2",
          "resultCode": 35,
          "boxTitle": "0-2 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 7000,
          "oddDescription": "0-2 / 0-3",
          "resultCode": 36,
          "boxTitle": "0-2 / 0-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3600,
          "oddDescription": "0-2 / 4+",
          "resultCode": 37,
          "boxTitle": "0-2 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 7100,
          "oddDescription": "2-1 / 2-1",
          "resultCode": 38,
          "boxTitle": "2-1 / 2-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3100,
          "oddDescription": "2-1 / 4+",
          "resultCode": 39,
          "boxTitle": "2-1 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 7600,
          "oddDescription": "1-2 / 1-2",
          "resultCode": 40,
          "boxTitle": "1-2 / 1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 3400,
          "oddDescription": "1-2 / 4+",
          "resultCode": 41,
          "boxTitle": "1-2 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 11600,
          "oddDescription": "3-0 / 3-0",
          "resultCode": 42,
          "boxTitle": "3-0 / 3-0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 6400,
          "oddDescription": "3-0 / 4+",
          "resultCode": 43,
          "boxTitle": "3-0 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 13100,
          "oddDescription": "0-3 / 0-3",
          "resultCode": 44,
          "boxTitle": "0-3 / 0-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 8000,
          "oddDescription": "0-3 / 4+",
          "resultCode": 45,
          "boxTitle": "0-3 / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7448,
          "oddValue": 1900,
          "oddDescription": "4+ / 4+",
          "resultCode": 46,
          "boxTitle": "4+ / 4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4380,
      "layoutType": 1,
      "betDescription": "O 1,5 1T + O 1,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "O 1,5 1T + O 1,5 2T",
        "oddList": [{
          "betCode": 7465,
          "oddValue": 675,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7465,
          "oddValue": 108,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4382,
      "layoutType": 1,
      "betDescription": "U 1,5 1T + U 1,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "U 1,5 1T + U 1,5 2T",
        "oddList": [{
          "betCode": 7466,
          "oddValue": 225,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 7466,
          "oddValue": 158,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1730,
      "layoutType": 4,
      "betDescription": "tricombo 1X2 U/O 2,5 GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "tricombo 1X2 U/O 2,5 GG/NG",
        "oddList": [{
          "betCode": 9416,
          "oddValue": 480,
          "oddDescription": "1+Ov2,5+Gg",
          "resultCode": 1,
          "boxTitle": "1+Ov2,5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 1700,
          "oddDescription": "1+Ov2,5+Ng",
          "resultCode": 2,
          "boxTitle": "1+Ov2,5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 500,
          "oddDescription": "1+Un2,5+Ng",
          "resultCode": 3,
          "boxTitle": "1+Un2,5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 575,
          "oddDescription": "2+Ov2,5+Gg",
          "resultCode": 4,
          "boxTitle": "2+Ov2,5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 2200,
          "oddDescription": "2+Ov2,5+Ng",
          "resultCode": 5,
          "boxTitle": "2+Ov2,5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 625,
          "oddDescription": "2+Un2,5+Ng",
          "resultCode": 6,
          "boxTitle": "2+Un2,5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 1100,
          "oddDescription": "X+Ov2,5+Gg",
          "resultCode": 7,
          "boxTitle": "X+Ov2,5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 550,
          "oddDescription": "X+Un2,5+Gg",
          "resultCode": 8,
          "boxTitle": "X+Un2,5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9416,
          "oddValue": 850,
          "oddDescription": "X+Un2,5+Ng",
          "resultCode": 9,
          "boxTitle": "X+Un2,5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1663,
      "layoutType": 4,
      "betDescription": "multigol 1tempo (1-2)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol 1tempo (1-2)",
        "oddList": [{
          "betCode": 9419,
          "oddValue": 270,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9419,
          "oddValue": 165,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9419,
          "oddValue": 1100,
          "oddDescription": "3",
          "resultCode": 3,
          "boxTitle": "3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9419,
          "oddValue": 1900,
          "oddDescription": "4+",
          "resultCode": 4,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1664,
      "layoutType": 1,
      "betDescription": "multigol 1tempo (1-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol 1tempo (1-3)",
        "oddList": [{
          "betCode": 9420,
          "oddValue": 270,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9420,
          "oddValue": 146,
          "oddDescription": "1-3",
          "resultCode": 2,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9420,
          "oddValue": 1900,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1665,
      "layoutType": 1,
      "betDescription": "multigol 1tempo (2-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol 1tempo (2-3)",
        "oddList": [{
          "betCode": 9421,
          "oddValue": 133,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9421,
          "oddValue": 330,
          "oddDescription": "2-3",
          "resultCode": 2,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9421,
          "oddValue": 1900,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1649,
      "layoutType": 4,
      "betDescription": "multigol casa (1-2)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (1-2)",
        "oddList": [{
          "betCode": 9422,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9422,
          "oddValue": 156,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9422,
          "oddValue": 850,
          "oddDescription": "3",
          "resultCode": 3,
          "boxTitle": "3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9422,
          "oddValue": 1300,
          "oddDescription": "4+",
          "resultCode": 4,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1650,
      "layoutType": 1,
      "betDescription": "multigol casa (1-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (1-3)",
        "oddList": [{
          "betCode": 9423,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9423,
          "oddValue": 133,
          "oddDescription": "1-3",
          "resultCode": 2,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9423,
          "oddValue": 1300,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1652,
      "layoutType": 1,
      "betDescription": "multigol casa (2-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (2-3)",
        "oddList": [{
          "betCode": 9424,
          "oddValue": 150,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9424,
          "oddValue": 265,
          "oddDescription": "2-3",
          "resultCode": 2,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9424,
          "oddValue": 1300,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1656,
      "layoutType": 4,
      "betDescription": "multigol ospite (1-2)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (1-2)",
        "oddList": [{
          "betCode": 9425,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9425,
          "oddValue": 160,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9425,
          "oddValue": 1000,
          "oddDescription": "3",
          "resultCode": 3,
          "boxTitle": "3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9425,
          "oddValue": 1600,
          "oddDescription": "4+",
          "resultCode": 4,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1657,
      "layoutType": 1,
      "betDescription": "multigol ospite (1-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (1-3)",
        "oddList": [{
          "betCode": 9426,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9426,
          "oddValue": 141,
          "oddDescription": "1-3",
          "resultCode": 2,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9426,
          "oddValue": 1600,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1659,
      "layoutType": 1,
      "betDescription": "multigol ospite (2-3)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (2-3)",
        "oddList": [{
          "betCode": 9427,
          "oddValue": 139,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9427,
          "oddValue": 305,
          "oddDescription": "2-3",
          "resultCode": 2,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9427,
          "oddValue": 1600,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1729,
      "layoutType": 4,
      "betDescription": "tricombo 1X2 U/O 1,5 GG/NG",
      "oddGroupList": [{
        "oddGroupDescription": "tricombo 1X2 U/O 1,5 GG/NG",
        "oddList": [{
          "betCode": 9429,
          "oddValue": 725,
          "oddDescription": "1+Under 1.5+Ng",
          "resultCode": 1,
          "boxTitle": "1+Under 1.5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 850,
          "oddDescription": "X+ Under 1.5+Ng",
          "resultCode": 2,
          "boxTitle": "X+ Under 1.5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 900,
          "oddDescription": "2+Under 1.5+Ng",
          "resultCode": 3,
          "boxTitle": "2+Under 1.5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 480,
          "oddDescription": "1+Over 1.5+Gg",
          "resultCode": 4,
          "boxTitle": "1+Over 1.5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 400,
          "oddDescription": "X+ Over 1.5+Gg",
          "resultCode": 5,
          "boxTitle": "X+ Over 1.5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 575,
          "oddDescription": "2+ Over 1.5+Gg",
          "resultCode": 6,
          "boxTitle": "2+ Over 1.5+Gg",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 725,
          "oddDescription": "1+Over 1.5+Ng",
          "resultCode": 7,
          "boxTitle": "1+Over 1.5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9429,
          "oddValue": 950,
          "oddDescription": "2+Over 1.5+Ng",
          "resultCode": 8,
          "boxTitle": "2+Over 1.5+Ng",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4464,
      "layoutType": 4,
      "betDescription": "multi gol 2-3 2t",
      "oddGroupList": [{
        "oddGroupDescription": "multi gol 2-3 2t",
        "oddList": [{
          "betCode": 9458,
          "oddValue": 158,
          "oddDescription": "0-1",
          "resultCode": 1,
          "boxTitle": "0-1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9458,
          "oddValue": 255,
          "oddDescription": "2-3",
          "resultCode": 2,
          "boxTitle": "2-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 9458,
          "oddValue": 1200,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1795,
      "layoutType": 5,
      "betDescription": "minuto 1° goal",
      "oddGroupList": [{
        "oddGroupDescription": "minuto 1° goal",
        "oddList": [{
          "betCode": 13792,
          "oddValue": 400,
          "oddDescription": "0-10",
          "resultCode": 1,
          "boxTitle": "0-10",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 425,
          "oddDescription": "11-20",
          "resultCode": 2,
          "boxTitle": "11-20",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 525,
          "oddDescription": "21-30",
          "resultCode": 3,
          "boxTitle": "21-30",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 625,
          "oddDescription": "31-40",
          "resultCode": 4,
          "boxTitle": "31-40",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 725,
          "oddDescription": "41-50",
          "resultCode": 5,
          "boxTitle": "41-50",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 975,
          "oddDescription": "51-60",
          "resultCode": 6,
          "boxTitle": "51-60",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 1275,
          "oddDescription": "61-70",
          "resultCode": 7,
          "boxTitle": "61-70",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 1725,
          "oddDescription": "71-80",
          "resultCode": 8,
          "boxTitle": "71-80",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 1675,
          "oddDescription": "81- Finale",
          "resultCode": 9,
          "boxTitle": "81- Finale",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 13792,
          "oddValue": 875,
          "oddDescription": "Nessuno",
          "resultCode": 10,
          "boxTitle": "Nessuno",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4399,
      "layoutType": 1,
      "betDescription": "O 0,5 1T + O 0,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "O 0,5 1T + O 0,5 2T",
        "oddList": [{
          "betCode": 14817,
          "oddValue": 185,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14817,
          "oddValue": 185,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1651,
      "layoutType": 1,
      "betDescription": "multigol casa (1-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (1-4)",
        "oddList": [{
          "betCode": 14843,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14843,
          "oddValue": 127,
          "oddDescription": "1-4",
          "resultCode": 2,
          "boxTitle": "1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14843,
          "oddValue": 2300,
          "oddDescription": "5+",
          "resultCode": 3,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1653,
      "layoutType": 4,
      "betDescription": "multigol casa (2-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (2-4)",
        "oddList": [{
          "betCode": 14844,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14844,
          "oddValue": 255,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14844,
          "oddValue": 245,
          "oddDescription": "2-4",
          "resultCode": 3,
          "boxTitle": "2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14844,
          "oddValue": 2300,
          "oddDescription": "5+",
          "resultCode": 4,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1654,
      "layoutType": 4,
      "betDescription": "multigol casa (3-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol casa (3-4)",
        "oddList": [{
          "betCode": 14845,
          "oddValue": 345,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14845,
          "oddValue": 156,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14845,
          "oddValue": 650,
          "oddDescription": "3-4",
          "resultCode": 3,
          "boxTitle": "3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14845,
          "oddValue": 2300,
          "oddDescription": "5+",
          "resultCode": 4,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1658,
      "layoutType": 1,
      "betDescription": "multigol ospite (1-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (1-4)",
        "oddList": [{
          "betCode": 14846,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14846,
          "oddValue": 136,
          "oddDescription": "1-4",
          "resultCode": 2,
          "boxTitle": "1-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14846,
          "oddValue": 2500,
          "oddDescription": "5+",
          "resultCode": 3,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1660,
      "layoutType": 4,
      "betDescription": "multigol ospite (2-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (2-4)",
        "oddList": [{
          "betCode": 14847,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14847,
          "oddValue": 255,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14847,
          "oddValue": 285,
          "oddDescription": "2-4",
          "resultCode": 3,
          "boxTitle": "2-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14847,
          "oddValue": 2500,
          "oddDescription": "5+",
          "resultCode": 4,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1661,
      "layoutType": 4,
      "betDescription": "multigol ospite (3-4)",
      "oddGroupList": [{
        "oddGroupDescription": "multigol ospite (3-4)",
        "oddList": [{
          "betCode": 14848,
          "oddValue": 290,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14848,
          "oddValue": 160,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14848,
          "oddValue": 800,
          "oddDescription": "3-4",
          "resultCode": 3,
          "boxTitle": "3-4",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 14848,
          "oddValue": 2500,
          "oddDescription": "5+",
          "resultCode": 4,
          "boxTitle": "5+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1843,
      "layoutType": 1,
      "betDescription": "1 o under 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "1 o under 2,5 o ng",
        "oddList": [{
          "betCode": 15024,
          "oddValue": 118,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15024,
          "oddValue": 400,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1787,
      "layoutType": 1,
      "betDescription": "1 o over 2,5 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "1 o over 2,5 o gg",
        "oddList": [{
          "betCode": 15025,
          "oddValue": 119,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15025,
          "oddValue": 380,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 2000,
      "layoutType": 1,
      "betDescription": "1 o over 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "1 o over 2,5 o ng",
        "oddList": [{
          "betCode": 15026,
          "oddValue": 108,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15026,
          "oddValue": 575,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1914,
      "layoutType": 1,
      "betDescription": "x o under 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "x o under 2,5 o ng",
        "oddList": [{
          "betCode": 15043,
          "oddValue": 134,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15043,
          "oddValue": 285,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1950,
      "layoutType": 1,
      "betDescription": "x o over 2,5 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "x o over 2,5 o gg",
        "oddList": [{
          "betCode": 15044,
          "oddValue": 134,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15044,
          "oddValue": 285,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 2011,
      "layoutType": 1,
      "betDescription": "2 o under 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "2 o under 2,5 o ng",
        "oddList": [{
          "betCode": 15046,
          "oddValue": 122,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15046,
          "oddValue": 355,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1946,
      "layoutType": 1,
      "betDescription": "2 o over 2,5 o gg",
      "oddGroupList": [{
        "oddGroupDescription": "2 o over 2,5 o gg",
        "oddList": [{
          "betCode": 15047,
          "oddValue": 126,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15047,
          "oddValue": 330,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 1800,
      "layoutType": 1,
      "betDescription": "2 o over 2,5 o ng",
      "oddGroupList": [{
        "oddGroupDescription": "2 o over 2,5 o ng",
        "oddList": [{
          "betCode": 15048,
          "oddValue": 108,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15048,
          "oddValue": 575,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4376,
      "layoutType": 4,
      "betDescription": "multigoal 2t",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 2t",
        "oddList": [{
          "betCode": 15401,
          "oddValue": 370,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15401,
          "oddValue": 133,
          "oddDescription": "1-3",
          "resultCode": 2,
          "boxTitle": "1-3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15401,
          "oddValue": 1200,
          "oddDescription": "4+",
          "resultCode": 3,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4379,
      "layoutType": 4,
      "betDescription": "multigoal 2t",
      "oddGroupList": [{
        "oddGroupDescription": "multigoal 2t",
        "oddList": [{
          "betCode": 15402,
          "oddValue": 370,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15402,
          "oddValue": 158,
          "oddDescription": "1-2",
          "resultCode": 2,
          "boxTitle": "1-2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15402,
          "oddValue": 750,
          "oddDescription": "3",
          "resultCode": 3,
          "boxTitle": "3",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 15402,
          "oddValue": 1200,
          "oddDescription": "4+",
          "resultCode": 4,
          "boxTitle": "4+",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4745,
      "layoutType": 1,
      "betDescription": "U 2,5 1T + U 2,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "U 2,5 1T + U 2,5 2T",
        "oddList": [{
          "betCode": 16308,
          "oddValue": 126,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 16308,
          "oddValue": 360,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4436,
      "layoutType": 4,
      "betDescription": "chi segna 1t",
      "oddGroupList": [{
        "oddGroupDescription": "chi segna 1t",
        "oddList": [{
          "betCode": 17466,
          "oddValue": 335,
          "oddDescription": "Soltanto Team 1",
          "resultCode": 1,
          "boxTitle": "Soltanto Team 1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17466,
          "oddValue": 385,
          "oddDescription": "Soltanto Team 2",
          "resultCode": 2,
          "boxTitle": "Soltanto Team 2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17466,
          "oddValue": 460,
          "oddDescription": "Entrambe Le Squadre",
          "resultCode": 3,
          "boxTitle": "Entrambe Le Squadre",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17466,
          "oddValue": 270,
          "oddDescription": "Nessun Goal",
          "resultCode": 4,
          "boxTitle": "Nessun Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4437,
      "layoutType": 4,
      "betDescription": "chi segna 2t",
      "oddGroupList": [{
        "oddGroupDescription": "chi segna 2t",
        "oddList": [{
          "betCode": 17467,
          "oddValue": 325,
          "oddDescription": "Soltanto Team 1",
          "resultCode": 1,
          "boxTitle": "Soltanto Team 1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17467,
          "oddValue": 380,
          "oddDescription": "Soltanto Team 2",
          "resultCode": 2,
          "boxTitle": "Soltanto Team 2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17467,
          "oddValue": 330,
          "oddDescription": "Entrambe Le Squadre",
          "resultCode": 3,
          "boxTitle": "Entrambe Le Squadre",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17467,
          "oddValue": 370,
          "oddDescription": "Nessun Goal",
          "resultCode": 4,
          "boxTitle": "Nessun Goal",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4438,
      "layoutType": 1,
      "betDescription": "U 0,5 1T + O 1,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "U 0,5 1T + O 1,5 2T",
        "oddList": [{
          "betCode": 17468,
          "oddValue": 625,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17468,
          "oddValue": 110,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4439,
      "layoutType": 1,
      "betDescription": "U 1,5 1T + O 1,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "U 1,5 1T + O 1,5 2T",
        "oddList": [{
          "betCode": 17469,
          "oddValue": 310,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17469,
          "oddValue": 133,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4440,
      "layoutType": 1,
      "betDescription": "O 0,5 1T + U 1,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "O 0,5 1T + U 1,5 2T",
        "oddList": [{
          "betCode": 17470,
          "oddValue": 235,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17470,
          "oddValue": 152,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4441,
      "layoutType": 1,
      "betDescription": "O 0,5 1T + U 2,5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "O 0,5 1T + U 2,5 2T",
        "oddList": [{
          "betCode": 17471,
          "oddValue": 170,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 17471,
          "oddValue": 205,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 4765,
      "layoutType": 1,
      "betDescription": "O 1,5 1T + U 1.5 2T",
      "oddGroupList": [{
        "oddGroupDescription": "O 1,5 1T + U 1.5 2T",
        "oddList": [{
          "betCode": 18073,
          "oddValue": 500,
          "oddDescription": "Si",
          "resultCode": 1,
          "boxTitle": "Si",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 18073,
          "oddValue": 114,
          "oddDescription": "No",
          "resultCode": 2,
          "boxTitle": "No",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 376,
      "layoutType": 4,
      "betDescription": "somma goal 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "somma goal 1°tempo",
        "oddList": [{
          "betCode": 567,
          "oddValue": 270,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 567,
          "oddValue": 245,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 567,
          "oddValue": 430,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 567,
          "oddValue": 775,
          "oddDescription": ">2",
          "resultCode": 4,
          "boxTitle": ">2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 390,
      "layoutType": 4,
      "betDescription": "somma goal 2°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "somma goal 2°tempo",
        "oddList": [{
          "betCode": 568,
          "oddValue": 370,
          "oddDescription": "0",
          "resultCode": 1,
          "boxTitle": "0",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 568,
          "oddValue": 260,
          "oddDescription": "1",
          "resultCode": 2,
          "boxTitle": "1",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 568,
          "oddValue": 360,
          "oddDescription": "2",
          "resultCode": 3,
          "boxTitle": "2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 568,
          "oddValue": 485,
          "oddDescription": ">2",
          "resultCode": 4,
          "boxTitle": ">2",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 888,
      "layoutType": 1,
      "betDescription": "pari/dispari 1°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "pari/dispari 1°tempo",
        "oddList": [{
          "betCode": 565,
          "oddValue": 163,
          "oddDescription": "Pari",
          "resultCode": 1,
          "boxTitle": "Pari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 565,
          "oddValue": 205,
          "oddDescription": "Dispari",
          "resultCode": 2,
          "boxTitle": "Dispari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }, {
      "betId": 388,
      "layoutType": 1,
      "betDescription": "pari/dispari 2°tempo",
      "oddGroupList": [{
        "oddGroupDescription": "pari/dispari 2°tempo",
        "oddList": [{
          "betCode": 566,
          "oddValue": 172,
          "oddDescription": "Pari",
          "resultCode": 1,
          "boxTitle": "Pari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }, {
          "betCode": 566,
          "oddValue": 192,
          "oddDescription": "Dispari",
          "resultCode": 2,
          "boxTitle": "Dispari",
          "additionalInfo": [0, 0, 0, 0, 0, 0],
          "addInfo": false
        }]
      }]
    }],
    "scoreboardInfo": {
      "providerScoreBoardId": 9,
      "scoreBoardId": 2200711
    },
    "eventInfo": {
      "disciplineCode": 1,
      "meetingCode": 21,
      "programCode": 28151,
      "eventCode": 780,
      "disciplineDescription": "Calcio",
      "meetingDescription": "Serie A",
      "eventDescription": "Cagliari - Udinese",
      "countryDescription": "Italia",
      "eventData": 1523710800000,
      "aliasUrl": "cagliari-udinese-201804141500",
      "rapid": false,
      "promo": false,
      "streaming": false,
      "programBetradar": true,
      "scoreboard": true,
      "live": false,
      "betsNumber": 184,
      "programBetradarInfo": {
        "matchId": 12090208
      },
      "scoreboardInfo": {
        "providerScoreBoardId": 9,
        "scoreBoardId": 2200711
      },
      "legaturaAAMS": 0,
      "scoreType": 0,
      "teamHome": {
        "description": "Cagliari"
      },
      "teamAway": {
        "description": "Udinese"
      }
    },
    "groupData": {
      "groupList": [{
        "groupId": 1,
        "title": "più giocate",
        "aliasUrl": "piu-giocate"
      }, {
        "groupId": 3,
        "title": "u/o",
        "aliasUrl": "u-o"
      }, {
        "groupId": 10,
        "title": "combo",
        "aliasUrl": "combo"
      }, {
        "groupId": 6,
        "title": "1° tempo",
        "aliasUrl": "1-tempo"
      }, {
        "groupId": 7,
        "title": "2° tempo",
        "aliasUrl": "2-tempo"
      }, {
        "groupId": 80,
        "title": "U/O 1T+2T",
        "aliasUrl": "u-o-1t-2t"
      }, {
        "groupId": 8,
        "title": "casa",
        "aliasUrl": "casa"
      }, {
        "groupId": 9,
        "title": "ospite",
        "aliasUrl": "ospite"
      }, {
        "groupId": 14,
        "title": "multigol",
        "aliasUrl": "multigol"
      }, {
        "groupId": 71,
        "title": "ChanceMix",
        "aliasUrl": "ChanceMix"
      }, {
        "groupId": 11,
        "title": "speciali partita",
        "aliasUrl": "speciali-partita"
      }, {
        "groupId": -1,
        "title": "TUTTE",
        "aliasUrl": "tutte"
      }]
    },
    "breadCrumbInfo": {
      "navigationPathData": [{
        "code": "1",
        "aliasUrl": "calcio",
        "description": "Calcio",
        "iconCode": "1",
        "itemType": "DISCIPLINE"
      }, {
        "code": "9999",
        "aliasUrl": "italia",
        "description": "Italia",
        "iconCode": "IT",
        "itemType": "COUNTRY"
      }, {
        "code": "21",
        "aliasUrl": "it-serie-a",
        "description": "Serie A",
        "iconCode": "IT",
        "itemType": "MEETING"
      }, {
        "code": "780",
        "aliasUrl": "cagliari-udinese-201804141500",
        "description": "Cagliari - Udinese",
        "iconCode": "IT",
        "itemType": "EVENT"
      }],
      "fullUrl": "/calcio/it-serie-a/cagliari-udinese-201804141500"
    }
  }
}

const result = getMatch("1X2 handicap_0:2", input)

debug(result)
