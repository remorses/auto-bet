const puppeteer = require('puppeteer');
const fs = require('fs');
const {config, selectors} = require("./config/betfair")

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  //await page.setCookie(...cookies);
  await page.goto(config.loginUrl, {waitUntil: 'networkidle2'});

  /*
  // sign in
  await page.waitForSelector(selectors.usernameField);
  await page.click(selectors.usernameField)
  await page.keyboard.type(config.username)
  await page.waitForSelector(selectors.passwordField);
  await page.click(selectors.passwordField)
  await page.keyboard.type(config.password)
  await page.waitForSelector(selectors.submitLogin);
  await page.click(selectors.submitLogin);
*/

  // go to tennis
  await page.goto(config.tennisUrl, {waitUntil: 'networkidle2'});

  // scrape
  const data = await page.evaluate(() => {


    const data = []

    let rows = Array.from(document.querySelectorAll('div#zone-main li > ul > li'))

    for (let row of rows) {

      let isLive = false;
      let date = new Date().getDate()
      let time = getText(row.querySelector('div > div.details-event > div > a > span.et-anim-container > span.ui-no-score > span'))
      if (time && time.includes('Domani')) {
        date = new Date().getDate() + 1;
        time = time.replace('Domani', '').trim();
      }
      if (!time || time.includes('Live')) {
        isLive = true;
        time = "now"
      }

      let homeTeam = getText(row.querySelector('div > div.details-event > div > a > span.home-team-name'))

      let awayTeam = getText(row.querySelector('div > div.details-event > div > a > span.away-team-name'))

      let homeOdd = getNumber(row.querySelector('div > div.details-market.market-0-runners > div.runner-list.ui-market.market-avb.ui-market-open > ul > li.selection.sel-0 > a > span'))

      let awayOdd = getNumber(row.querySelector('div > div.details-market.market-0-runners > div.runner-list.ui-market.market-avb.ui-market-open > ul > li.selection.sel-1 > a > span'))

      let matchObj = {
        site: "betfair",
        tournaent: null,
        date: date,
        time: time,
        isLive: isLive,
        home: {
          team: homeTeam,
          odd: homeOdd
        },
        away: {
          team: awayTeam,
          odd: awayOdd
        }
      }
      data.push(matchObj)

    }

    return data

  })

  fs.writeFile('./data.json', JSON.stringify(data), 'utf8', (err) => {
    if (err)
      throw err;
    }
  );

}

run();
