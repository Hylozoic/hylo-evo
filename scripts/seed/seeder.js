import puppeteer from 'puppeteer'

import { fatalErrorMsg, getValue } from './util'
import users from './users'

// const networks = require('./networks')
// const communities = require('./communities')
// const posts = require('./posts')

const ADMIN_LOGIN_MESSAGE = `
  This script requires an admin login. Any Hylo developer should have one of
  these: you just need an @hylo.com email. The script delivers your password
  to the server using headless Chrome and then should be promptly GC'd out of
  existence. It doesn't get cached or written anywhere.

  (The admin login is completely separate to Hylo user accounts, so we can do
  it without a single user in the database which is handy.)
`
const BE_PATIENT = `
  This will take awhile (API requests issued sequentially). If you're not sure
  if everything is still working, you can always check the backend log output
  in its terminal window.
`

export default async function seeder () {
  // First, we need an admin login.
  // console.log(ADMIN_LOGIN_MESSAGE)
  // const email = await getValue('    Hylo email: ')
  // const password = await getValue('    Password: ', true)
  // process.stdout.write('\n\n  Authenticating you with Google...')
  //
  let browser
  let page

  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: false
    })
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3264.0 Safari/537.36')

    // Google auth
    // await page.goto('http://localhost:3001/noo/admin/login')
    // await page.waitForNavigation()
    // await page.keyboard.type(email)
    // await page.click('#identifierNext')
    //
    // If you're having difficulties logging in, try increasing this from 2s
    // await page.waitFor(2 * 1000)
    //
    // await page.keyboard.type(password)
    // await page.click('#passwordNext')
    // await page.waitForNavigation()
    //
    // Great, now we should be authenticated. We can start sending POST requests
    // to the GraphQL endpoint.
    // process.stdout.write(' ✓')

    process.stdout.write(`\n  ${BE_PATIENT}`)
    await users(page)

    await page.close()
    await browser.close()
  } catch (e) {
    if (page) await page.close()
    if (browser) await browser.close()
    fatalErrorMsg(e)
  }
}
