// Populate a development database with faked data using the same GraphQL the client uses.
//
// Motivation: our previous seed script... kind of worked, but quickly became out of date
// and had a number of edge cases where it didn't quite behave like the live data. This
// led to using client data in development, and staging, which isn't ideal from a privacy
// or security standpoint.
//
// The intent here is to provide something which uses the same function calls we use, so
// should continue to be relevant for longer. Likewise, we should not be afraid to throw
// away our previous development db, so that means we need something that is easy to
// recreate at the drop of the hat, and add to as we add more features.

const minimist = require('minimist')
const seed = require('./seed')

// Please don't run this in production. It's not nice.
if (process.env.NODE_ENV === 'production') {
  console.log(' !!! Do NOT run this in production! This will completely trash your prod database. !!!')
  process.exit(1)
}

// Next, let's grab a few command line arguments (mostly a placeholder in case we want
// to get clever later.
const argv = minimist(process.argv, {
  alias: {
    '?': 'help'
  },
  string: [
    'help'
  ]
})

const warning = `
    This is the Hylo seeder. It grows fake databases using Hylo client functions to simulate
    user activity. Please use it with caution, as it will completely destroy your existing
    development data without remorse.`

const action = argv._[2]
switch (action) {
  case 'help':
  case '?':
    console.log(`${warning}

    Usage
      $ yarn run seed
    `)
    break

  default:
    console.log(warning)
    seed()
}
