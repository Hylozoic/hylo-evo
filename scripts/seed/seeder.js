import puppeteer from 'puppeteer'

import admin from './admin'
import seedComments from './comments'
import seedCommunities from './communities'
import { fatalErrorMsg } from './utils'
import seedPosts from './posts'
import users from './users'

const BE_PATIENT = `
  This will take awhile (API requests issued sequentially). If you're not sure
  if everything is still working, you can always check the backend log output
  in its terminal window.
`

export default async function seeder () {
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

    process.stdout.write(`\n  ${BE_PATIENT}`)

    // userBatch is gradually modified: definitely not immutable!
    const userBatch = await users(page)
    await admin(page)
    await seedCommunities(page, userBatch)
    const postBatch = await seedPosts(page, userBatch)
    await seedComments(page, userBatch, postBatch)

    await page.close()
    await browser.close()
  } catch (e) {
    if (page) await page.close()
    if (browser) await browser.close()
    console.log(e)
    fatalErrorMsg(e)
  }
}
