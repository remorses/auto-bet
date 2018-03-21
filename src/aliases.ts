


const oddTypes = {
  "underOver_2.5": [{ betfair: "Più/Meno" }],
  "rimborso pareggio": [{ betfair: "Rimborso in Caso di Pareggio" }]
}


const tournaments = {

}




const rawToPure = (raw: string): string => {
  for (let [group, arr] of Object.entries(oddTypes)) {
    for (let value of Object.values(group)) {
      if (value === raw) return value
    }
  }
  return raw
}



export {  rawToPure }
