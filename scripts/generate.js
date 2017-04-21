#!/usr/bin/env node
const program = require('commander')

program
  .version('0.0.1')
  .command('component [ComponentName]', 'create a new component')
  .command('store [ComponentName]', 'add a store file for an existing component')
  .command('model [ModelName]', 'coming soon to a cli near you!')
  .parse(process.argv)
