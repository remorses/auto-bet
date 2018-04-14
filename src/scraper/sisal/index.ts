
import * as R from "ramda"
import { rawToPure, pureToRaw } from "@aliases/index"
import * as Debug from "debug";
const debug = Debug("scraper:eurobet");

const LINK = ""
const SITE = "sisal"
const SPORT = "soccer"

const removeTrash = arr => !arr ? Boolean(arr) : (arr[0] && arr.length)

// from infoAggList[]
const getOdds = (type, descrizioneScommessa, infoAggList) => {
  return infoAggList.map(({ descrizione, esitoList }) => {
    if (type === rawToPure("oddType", descrizione, SITE)) {
      return esitoList.map(obj => getOdd(type, obj))
    }
  })
    .filter(removeTrash)
}

// from esitoList[]
const getOdd = (type, { descrizione, quota }) => {
  const getRole = rawToPure("role", descrizione, SITE)
  const getValue = quota * Math.pow(10, 1 - 3)
  return {
    type: type,
    role: getRole,
    player: null,
    value: getValue,
    link: LINK
  }
}

// from data
const getMetadata = (type, {
  descrizioneAvvenimento,
  descrizioneManifestazione,
  dataAvvenimento,
}) => {
  return {
    sport: SPORT,
    tournament: rawToPure("tournament", descrizioneManifestazione, SITE),
    matchName: descrizioneAvvenimento,
    date: dataAvvenimento,
    time: "",
  }
}

// from data
export const getMatch = (type, data) => {
  const scommesseClassicheList: any = R.path(["scommesseClassicheList"], data)
  const metadata = getMetadata(type, data)
  const odds = scommesseClassicheList
    .map(({ descrizioneScommessa, infoAggList }) =>
      getOdds(type, descrizioneScommessa, infoAggList))
    .filter(removeTrash)

  return {
    site: SITE,
    metadata: metadata,
    odds: R.flatten(odds)
  }
}



const input = { "scommesseClassicheList": [{ "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 601, "codiceClasseEsito": 3, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 30, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "ESITO FINALE 1X2", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 0, "tipologiaVisualizzazione": 0, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:55:43 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 0, "descrizione": "ESITO FINALE 1X2", "esitoList": [{ "codiceEsito": 1, "descrizione": "1", "legaturaMin": 1, "legaturaMax": 30, "quota": 108, "stato": 1, "formattedQuota": "1.08", "aggregato": false, "codiceScommessaAAMS": 3, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "X", "legaturaMin": 1, "legaturaMax": 30, "quota": 900, "stato": 1, "formattedQuota": "9.00", "aggregato": false, "codiceScommessaAAMS": 3, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "2", "legaturaMin": 1, "legaturaMax": 30, "quota": 2900, "stato": 1, "formattedQuota": "29.00", "aggregato": false, "codiceScommessaAAMS": 3, "codiceEsitoAAMS": 3 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:55:43 PM", "offertaLive": true }], "numeroEsiti": 3, "numeroScommesseAvvenimento": 16, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": { "codicePalinsesto": null, "codiceAvvenimento": null, "idBetradar": 11830296, "statusCode": 7, "statusDescription": "2° tempo", "scoreList": [{ "type": "Current", "team1": 2, "team2": 0 }, { "type": "Period1", "team1": 1, "team2": 0 }], "cardList": [{ "time": 42, "type": "Yellow", "playerTeam": 1, "player": { "playerId": 149593, "playerName": null } }, { "time": 44, "type": "Yellow", "playerTeam": 1, "player": { "playerId": 161717, "playerName": null } }, { "time": 64, "type": "Yellow", "playerTeam": 2, "player": { "playerId": 27583, "playerName": null } }, { "time": 64, "type": "Yellow", "playerTeam": 1, "player": { "playerId": 20756, "playerName": null } }] }, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 1441, "codiceClasseEsito": 999, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 31, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "DOPPIA CHANCE", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 0, "tipologiaVisualizzazione": 0, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 0, "descrizione": "DOPPIA CHANCE", "esitoList": [{ "codiceEsito": 1, "descrizione": "1X", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": true, "codiceScommessaAAMS": 15, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "X2", "legaturaMin": 1, "legaturaMax": 30, "quota": 686, "stato": 1, "formattedQuota": "6.86", "aggregato": true, "codiceScommessaAAMS": 16, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "12", "legaturaMin": 1, "legaturaMax": 30, "quota": 104, "stato": 1, "formattedQuota": "1.04", "aggregato": true, "codiceScommessaAAMS": 17, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "offertaLive": true }], "numeroEsiti": 3, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": true, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 603, "codiceClasseEsito": 18, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 32, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "GOAL/NOGOAL", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 0, "tipologiaVisualizzazione": 0, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:16 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 0, "descrizione": "GOAL/NOGOAL", "esitoList": [{ "codiceEsito": 1, "descrizione": "GOAL", "legaturaMin": 1, "legaturaMax": 30, "quota": 198, "stato": 1, "formattedQuota": "1.98", "aggregato": false, "codiceScommessaAAMS": 18, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "NOGOAL", "legaturaMin": 1, "legaturaMax": 30, "quota": 174, "stato": 1, "formattedQuota": "1.74", "aggregato": false, "codiceScommessaAAMS": 18, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:16 PM", "offertaLive": true }], "numeroEsiti": 2, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 4045, "codiceClasseEsito": 8333, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 33, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "SEGNA GOAL 3", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 22, "tipologiaVisualizzazione": 0, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 3, "descrizione": "SEGNA GOAL 3", "esitoList": [{ "codiceEsito": 1, "descrizione": "TEAM 1", "legaturaMin": 1, "legaturaMax": 30, "quota": 500, "stato": 1, "formattedQuota": "5.00", "aggregato": false, "codiceScommessaAAMS": 8333, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "NESSUNO", "legaturaMin": 1, "legaturaMax": 30, "quota": 230, "stato": 1, "formattedQuota": "2.30", "aggregato": false, "codiceScommessaAAMS": 8333, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "TEAM 2", "legaturaMin": 1, "legaturaMax": 30, "quota": 225, "stato": 1, "formattedQuota": "2.25", "aggregato": false, "codiceScommessaAAMS": 8333, "codiceEsitoAAMS": 3 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }], "numeroEsiti": 3, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 5546, "codiceClasseEsito": 7989, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 2, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 34, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "UNDER/OVER", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 4, "tipologiaVisualizzazione": 1, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 250, "descrizione": "U/O 2.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 230, "stato": 1, "formattedQuota": "2.30", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 155, "stato": 1, "formattedQuota": "1.55", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }, { "id": 350, "descrizione": "U/O 3.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 121, "stato": 1, "formattedQuota": "1.21", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 390, "stato": 1, "formattedQuota": "3.90", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "offertaLive": true }, { "id": 450, "descrizione": "U/O 4.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 102, "stato": 1, "formattedQuota": "1.02", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 1000, "stato": 1, "formattedQuota": "10.00", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }, { "id": 550, "descrizione": "U/O 5.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7989, "codiceEsitoAAMS": 2 }], "stato": 2, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "offertaLive": true }], "numeroEsiti": 2, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 607, "codiceClasseEsito": 8, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 39, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "ESITO FINALE 1X2 HANDICAP", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 1, "tipologiaVisualizzazione": 1, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": -100, "descrizione": "1X2 HANDICAP (-1)", "esitoList": [{ "codiceEsito": 1, "descrizione": "1", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "X", "legaturaMin": 1, "legaturaMax": 30, "quota": 1300, "stato": 1, "formattedQuota": "13.00", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "2", "legaturaMin": 1, "legaturaMax": 30, "quota": 2300, "stato": 1, "formattedQuota": "23.00", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 3 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:54:54 PM", "offertaLive": true }, { "id": 100, "descrizione": "1X2 HANDICAP (1)", "esitoList": [{ "codiceEsito": 1, "descrizione": "1", "legaturaMin": 1, "legaturaMax": 30, "quota": 150, "stato": 1, "formattedQuota": "1.50", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "X", "legaturaMin": 1, "legaturaMax": 30, "quota": 300, "stato": 1, "formattedQuota": "3.00", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "2", "legaturaMin": 1, "legaturaMax": 30, "quota": 800, "stato": 1, "formattedQuota": "8.00", "aggregato": false, "codiceScommessaAAMS": 8, "codiceEsitoAAMS": 3 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:16 PM", "offertaLive": true }], "numeroEsiti": 3, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 631, "codiceClasseEsito": 7, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 40, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "RISULTATO ESATTO 26 ESITI", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 0, "tipologiaVisualizzazione": 0, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 0, "descrizione": "RISULTATO ESATTO 26 ESITI", "esitoList": [{ "codiceEsito": 1, "descrizione": "1-0", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "2-0", "legaturaMin": 1, "legaturaMax": 30, "quota": 230, "stato": 1, "formattedQuota": "2.30", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "2-1", "legaturaMin": 1, "legaturaMax": 30, "quota": 325, "stato": 1, "formattedQuota": "3.25", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 3 }, { "codiceEsito": 4, "descrizione": "3-0", "legaturaMin": 1, "legaturaMax": 30, "quota": 700, "stato": 1, "formattedQuota": "7.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 4 }, { "codiceEsito": 5, "descrizione": "3-1", "legaturaMin": 1, "legaturaMax": 30, "quota": 1100, "stato": 1, "formattedQuota": "11.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 5 }, { "codiceEsito": 6, "descrizione": "3-2", "legaturaMin": 1, "legaturaMax": 30, "quota": 2900, "stato": 1, "formattedQuota": "29.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 6 }, { "codiceEsito": 7, "descrizione": "4-0", "legaturaMin": 1, "legaturaMax": 30, "quota": 3400, "stato": 1, "formattedQuota": "34.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 7 }, { "codiceEsito": 8, "descrizione": "4-1", "legaturaMin": 1, "legaturaMax": 30, "quota": 5100, "stato": 1, "formattedQuota": "51.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 8 }, { "codiceEsito": 9, "descrizione": "4-2", "legaturaMin": 1, "legaturaMax": 30, "quota": 10100, "stato": 1, "formattedQuota": "101.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 9 }, { "codiceEsito": 10, "descrizione": "4-3", "legaturaMin": 1, "legaturaMax": 30, "quota": 40100, "stato": 1, "formattedQuota": "401.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 10 }, { "codiceEsito": 11, "descrizione": "0-1", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 11 }, { "codiceEsito": 12, "descrizione": "0-2", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 12 }, { "codiceEsito": 13, "descrizione": "1-2", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 13 }, { "codiceEsito": 14, "descrizione": "0-3", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 14 }, { "codiceEsito": 15, "descrizione": "1-3", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 15 }, { "codiceEsito": 16, "descrizione": "2-3", "legaturaMin": 1, "legaturaMax": 30, "quota": 4100, "stato": 1, "formattedQuota": "41.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 16 }, { "codiceEsito": 17, "descrizione": "0-4", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 17 }, { "codiceEsito": 18, "descrizione": "1-4", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 18 }, { "codiceEsito": 19, "descrizione": "2-4", "legaturaMin": 1, "legaturaMax": 30, "quota": 12600, "stato": 1, "formattedQuota": "126.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 19 }, { "codiceEsito": 20, "descrizione": "3-4", "legaturaMin": 1, "legaturaMax": 30, "quota": 40100, "stato": 1, "formattedQuota": "401.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 20 }, { "codiceEsito": 21, "descrizione": "0-0", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 21 }, { "codiceEsito": 22, "descrizione": "1-1", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 22 }, { "codiceEsito": 23, "descrizione": "2-2", "legaturaMin": 1, "legaturaMax": 30, "quota": 1000, "stato": 1, "formattedQuota": "10.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 23 }, { "codiceEsito": 24, "descrizione": "3-3", "legaturaMin": 1, "legaturaMax": 30, "quota": 10100, "stato": 1, "formattedQuota": "101.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 24 }, { "codiceEsito": 25, "descrizione": "4-4", "legaturaMin": 1, "legaturaMax": 30, "quota": 100100, "stato": 1, "formattedQuota": "1001.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 25 }, { "codiceEsito": 26, "descrizione": "ALTRO", "legaturaMin": 1, "legaturaMax": 30, "quota": 10100, "stato": 1, "formattedQuota": "101.00", "aggregato": false, "codiceScommessaAAMS": 7, "codiceEsitoAAMS": 26 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "offertaLive": true }], "numeroEsiti": 26, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 12287, "codiceClasseEsito": 1749, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 4035, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "CASA: U/O", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 4, "tipologiaVisualizzazione": 1, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 250, "descrizione": "CASA: U/O 2.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 125, "stato": 1, "formattedQuota": "1.25", "aggregato": false, "codiceScommessaAAMS": 1749, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 370, "stato": 1, "formattedQuota": "3.70", "aggregato": false, "codiceScommessaAAMS": 1749, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:30 PM", "offertaLive": true }, { "id": 350, "descrizione": "CASA: U/O 3.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 101, "stato": 1, "formattedQuota": "1.01", "aggregato": false, "codiceScommessaAAMS": 1749, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 1250, "stato": 1, "formattedQuota": "12.50", "aggregato": false, "codiceScommessaAAMS": 1749, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:51:11 PM", "offertaLive": true }], "numeroEsiti": 2, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 12288, "codiceClasseEsito": 1750, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 5035, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "OSPITE: U/O", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 4, "tipologiaVisualizzazione": 1, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 50, "descrizione": "OSPITE: U/O 0.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 176, "stato": 1, "formattedQuota": "1.76", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 199, "stato": 1, "formattedQuota": "1.99", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }, { "id": 150, "descrizione": "OSPITE: U/O 1.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 110, "stato": 1, "formattedQuota": "1.10", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 620, "stato": 1, "formattedQuota": "6.20", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }, { "id": 250, "descrizione": "OSPITE: U/O 2.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "UNDER", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "OVER", "legaturaMin": 1, "legaturaMax": 30, "quota": 2500, "stato": 1, "formattedQuota": "25.00", "aggregato": false, "codiceScommessaAAMS": 1750, "codiceEsitoAAMS": 2 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "offertaLive": true }], "numeroEsiti": 2, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }, { "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceScommessa": 5549, "codiceClasseEsito": 12192, "codiceDisciplina": 1, "codiceManifestazione": 86, "stato": 1, "live": true, "listaEsitiDinamica": false, "scommessaSpeciale": false, "modalitaVisualizzazione": 3, "posizione": 6030, "liveDelay": 6, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneScommessa": "COMBO: 1X2 + U/O", "descrizioneManifestazione": "ENG Premier League", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "dataScommessa": "Apr 14, 2018 1:30:00 PM", "tipoInfoAggiuntiva": 4, "tipologiaVisualizzazione": 2, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaManifestazioneSmall": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "codicePalinsestoDiRiferimento": null, "codiceAvvenimentoDiRiferimento": null, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "streaming": false, "idBetradar": 11830296, "legaturaAAMS": 1, "blackListMin": 0, "blackListMax": 0, "infoAggList": [{ "id": 250, "descrizione": "1X2 + U/O 2.5", "esitoList": [{ "codiceEsito": 1, "descrizione": "1 + U", "legaturaMin": 1, "legaturaMax": 30, "quota": 210, "stato": 1, "formattedQuota": "2.10", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 1 }, { "codiceEsito": 2, "descrizione": "X + U", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 2 }, { "codiceEsito": 3, "descrizione": "2 + U", "legaturaMin": 1, "legaturaMax": 30, "quota": 100, "stato": 0, "formattedQuota": "-", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 3 }, { "codiceEsito": 4, "descrizione": "1 + O", "legaturaMin": 1, "legaturaMax": 30, "quota": 180, "stato": 1, "formattedQuota": "1.80", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 4 }, { "codiceEsito": 5, "descrizione": "X + O", "legaturaMin": 1, "legaturaMax": 30, "quota": 900, "stato": 1, "formattedQuota": "9.00", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 5 }, { "codiceEsito": 6, "descrizione": "2 + O", "legaturaMin": 1, "legaturaMax": 30, "quota": 2900, "stato": 1, "formattedQuota": "29.00", "aggregato": false, "codiceScommessaAAMS": 12192, "codiceEsitoAAMS": 6 }], "stato": 1, "dataUltimaModifica": "Apr 14, 2018 2:56:14 PM", "offertaLive": true }], "numeroEsiti": 6, "numeroScommesseAvvenimento": null, "legaturaMin": 1, "legaturaMax": 30, "multipla": 0, "aggregata": false, "livescore": null, "preAlertPromozionaliRedaxAvvenimento": null, "postAlertPromozionaliRedaxAvvenimento": null, "preAlertPromozionaliRedaxModelloScommessa": null, "postAlertPromozionaliRedaxModelloScommessa": null }], "scommesseSpecialiList": [], "codicePalinsesto": 28151, "codiceAvvenimento": 49, "codiceDisciplina": 1, "codiceManifestazione": 86, "descrizioneAvvenimento": "Southampton - Chelsea", "descrizioneManifestazione": "ENG Premier League", "posizioneManifestazioneRedax": 109, "urlIconaDisciplina": "https://cdn-static.sisal.it/documents/10903/450920/Ic__0021_soccer.png", "urlIconaManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England.jpg", "urlIconaSmallManifestazione": "https://cdn-static.sisal.it/documents/10903/450918/England_m.jpg", "dataAvvenimento": "Apr 14, 2018 1:30:00 PM", "dataUltimaModifica": "Apr 14, 2018 2:56:46 PM", "formattedDataAvvenimento": "14/04/2018 ore 13.30", "numeroScommesse": 17, "complementare": 0, "stato": 1, "preAlertPromozionaliRedax": null, "postAlertPromozionaliRedax": null, "streamingBetradar": false, "streamingImg": false, "idBetradar": 11830296, "idProviderLive": 22, "idAvvProviderLive": 4621097, "idAvvImg": null, "isStreaming": false }

const result = getMatch("1X2 HANDICAP (-1)", input)

debug(result)
