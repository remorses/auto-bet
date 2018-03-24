
// system to convert the nomenclature of sites to pure



const aliases = {
  oddType: {
    "underOver_2.5": [{ betfair: "Più/Meno", williamhill: "Over/Under 2.5 Goal" }],
    "rimborso pareggio": [{ betfair: "Rimborso in Caso di Pareggio" }]
  },
  tournament: {}
}

type Category = "oddType" | "tournament";

const rawToPure = (category: Category, raw: string): string => {
  for (let [group, arr] of Object.entries(aliases[category])) {
    for (let value of Object.values(group)) {
      if (value === raw.trim()) return value
    }
  }
  return raw
}


export { rawToPure }
