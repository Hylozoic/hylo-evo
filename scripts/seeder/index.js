const { fatalErrorMsg, getValue } = require('./util')

const users = require('./users')
// const networks = require('./networks')
// const communities = require('./communities')
// const posts = require('./posts')

const ADMIN_LOGIN_MESSAGE = `
  This script requires an admin login. Any Hylo developer should have one of
  these: you just need an @hylo.com email. The script delivers your password
  to the server using headless Chrome and then should be promptly GC'd out of
  existence. It doesn't get cached or written anywhere.
`

module.exports = async function seeder () {
  // First, we need an admin login.
  console.log(ADMIN_LOGIN_MESSAGE)
  const email = await getValue('    Hylo email: ')
  const password = await getValue('    Password: ')
  try {
    await users()
  } catch (e) {
    fatalErrorMsg(e)
  }
}
