import { Page } from "puppeteer"


async function login({ page, username, password }) {

  // sign in
  await page.waitForSelector();
  await page.click()
  await page.keyboard.type(username)
  await page.waitForSelector();
  await page.click()
  await page.keyboard.type(password)
  await page.waitForSelector();
  await page.click();

}


export { login }
