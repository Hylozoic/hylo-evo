const readline = require('readline')

const iface = () => readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function finalWarning (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(
      message,
      answer => {
        if (answer !== 'yes') {
          console.log('\nExiting.')
          process.exit()
        }
        console.log('\n  Ok, you asked for it...')
        rl.close()
        resolve()
      })
  })
}

function getValue (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(message, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

function hitEnter (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(message, () => {
      rl.close()
      resolve()
    })
  })
}

function fatalErrorMsg ({ message }) {
  return console.error(`
  The seeder encountered an error it didn't know how to handle. Sorry! If you're
  curious, the message was:

    ${message}
`)
}

module.exports = {
  getValue,
  fatalErrorMsg,
  finalWarning,
  hitEnter
}
