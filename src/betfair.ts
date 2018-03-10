import { Page } from 'puppeteer'
import { config, selectors } from "./config/betfair"
import { Match, Metadata, Odd, } from "./interfaces"


async function scrape(page: Page): Promise<Match[]> {

  await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

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
  await page.goto(config.tennisUrl, { waitUntil: 'networkidle2' });

  // scrape
  const data = await page.evaluate(() => {

    function getText(el) {
      return el
        ? el.textContent.trim()
        : null
    }
    function getNumber(el) {
      let string = el.textContent
      return string
        ? parseFloat(string.trim())
        : null
    }


    const data: Match[] = []

    let rows = Array.from(document.querySelectorAll('div#zone-main li > ul > li'))

    for (let row of rows) {

      let date = new Date().getDate()
      let time = getText(row.querySelector('div > div.details-event > div > a > span.et-anim-container > span.ui-no-score > span'))
      if (time && time.includes('Domani')) {
        date = new Date().getDate() + 1;
        time = time.replace('Domani', '').trim();
      }


      let homeTeam = getText(row.querySelector('div > div.details-event > div > a > span.home-team-name'))

      let awayTeam = getText(row.querySelector('div > div.details-event > div > a > span.away-team-name'))

      let homeOdd = getNumber(row.querySelector('div > div.details-market.market-0-runners > div.runner-list.ui-market.market-avb.ui-market-open > ul > li.selection.sel-0 > a > span'))

      let awayOdd = getNumber(row.querySelector('div > div.details-market.market-0-runners > div.runner-list.ui-market.market-avb.ui-market-open > ul > li.selection.sel-1 > a > span'))

      let match = {
        site: "betfair",
        metadata,
        odds: [odd, odd, odd]
      }

      return data

    }
  })

  return data

}
