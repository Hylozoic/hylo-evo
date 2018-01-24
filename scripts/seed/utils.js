/* global API_URI, GRAPHQL_URI */

import readline from 'readline'
import { Writable } from 'stream'

const iface = (out) => readline.createInterface({
  input: process.stdin,
  output: out || process.stdout,
  terminal: true
})

export function finalWarning (message) {
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

export function getValue (message, muted) {
  return new Promise(resolve => {
    const out = new Writable({
      write: function (chunk, encoding, callback) {
        if (!this.muted) {
          process.stdout.write(chunk, encoding)
        }
        callback()
      }
    })
    if (muted) {
      process.stdout.write(message)
      out.muted = true
    }

    const rl = iface(out)
    rl.question(message, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

export function hitEnter (message) {
  return new Promise(resolve => {
    const rl = iface()
    rl.question(message, () => {
      rl.close()
      resolve()
    })
  })
}

export function fatalErrorMsg ({ message }) {
  return console.error(`
  The seeder encountered an error it didn't know how to handle. Sorry! If you're
  curious, the message was:

    ${message}
`)
}

export function oneTo (n) {
  return Math.floor(Math.random() * n + 1)
}
