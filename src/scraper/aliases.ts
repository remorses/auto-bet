
// system to convert the nomenclature of sites to pure



const aliases = {
  "oddType": {
    "underOver_2.5":
      {
        betfair: "Più/Meno",
        williamhill: "Over/Under 2.5 Goal"
      },
    "rimborso pareggio":
      {
        betfair: "Rimborso in Caso di Pareggio"
      },
  },
  "tournament": {

  }
}

type Category = "oddType" | "tournament";

const rawToPure = (category: Category, raw: string): string => {
  for (let [key, obj] of Object.entries(aliases[category])) {
    console.log("obj ", obj)
    for (let alias of Object.values(obj)) {
      console.log("alias ", alias)
      if (alias == raw.trim()) return key
    }
  }
  return raw
}


export { rawToPure }
