import { getValue } from './utils'

const ADMIN_LOGIN_MESSAGE = `
  This script requires an admin login. Any Hylo developer should have one of
  these: you just need an @hylo.com email. The script delivers your password
  to the server using headless Chrome and then should be promptly GC'd out of
  existence. It doesn't get cached or written anywhere.

  (The admin login is completely separate to Hylo user accounts, so we can do
  it without a single user in the database which is handy.)
`

export default async function admin (page) {
  console.log(`\n${ADMIN_LOGIN_MESSAGE}`)
  const email = await getValue('    Hylo email: ')
  const password = await getValue('    Password: ', true)
  process.stdout.write('\n\n  Authenticating you with Google...')

  // Google auth
  await page.goto('http://localhost:3001/noo/admin/login')
  await page.waitForNavigation()
  await page.keyboard.type(email)
  await page.click('#identifierNext')

  // If you're having difficulties logging in, try increasing this from 2s
  await page.waitFor(2 * 1000)

  await page.keyboard.type(password)
  await page.click('#passwordNext')
  await page.waitForNavigation()
  process.stdout.write(' ✓')
}
