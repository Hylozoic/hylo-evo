#!/usr/bin/env node
const { updateIndexReducer } = require('./generatorHelpers')
const program = require('commander')
const chalk = require('chalk')
const replaceStream = require('replacestream')
const fs = require('fs')
const path = require('path')

// this file is for generating components via the cli
// run ./scripts/generate.js component ComponentName [options]
// include --help to see help from the cli

program
  .arguments('<ComponentName>')
  .option('-e, --extends', 'whether component should extend React.Component')
  .option('-r, --route', 'whether component is a route')
  .option('-c, --connected', 'whether component uses connect')
  .option('-s, --store', 'whether component needs a store file, must be ran alongside --connected')
  .action(function (ComponentName) {
    if (program.store && !program.connected) {
      console.log(chalk.yellow('Component can\'t be created with a store without being connected, run again with -c'))
      return
    }

    console.log(chalk.cyan(`Creating a ${program.route ? 'route ' : ''}component named ${ComponentName}`))
    const componentDir = path.join(__dirname, program.route ? '../src/routes' : '../src/components', ComponentName)
    const templates = path.join(__dirname, 'templates')
    if (fs.existsSync(componentDir)) {
      console.log(chalk.red('There is already an existing component with that name, canceling.'))
      return
    }
    fs.mkdirSync(componentDir)

    let compName
    if (program.extends) {
      compName = 'Component.class.js'
    } else {
      compName = 'Component.js'
    }
    fs.createReadStream(path.join(templates, compName))
      .pipe(replaceStream('ReplaceComponent', ComponentName)) // requires special keyword because react uses keyword 'Component'
      .pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.js`))
    console.log(chalk.cyan(`Created ${ComponentName}.js`))

    let indexName
    if (program.connected) {
      fs.createReadStream(path.join(templates, program.store ? 'Component.connectorWithStore.js' : 'Component.connector.js'))
        .pipe(replaceStream('Component', ComponentName))
        .pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.connector.js`))
      console.log(chalk.cyan(`Created ${ComponentName}.connector.js`))
      indexName = 'index.connected.js'
    } else {
      indexName = 'index.js'
    }
    fs.createReadStream(path.join(templates, indexName))
      .pipe(replaceStream('Component', ComponentName))
      .pipe(fs.createWriteStream(`${componentDir}/index.js`))
    console.log(chalk.cyan('Created index.js'))

    fs.createReadStream(path.join(templates, 'Component.test.js'))
      .pipe(replaceStream('Component', ComponentName))
      .pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.test.js`))
    console.log(chalk.cyan(`Created ${ComponentName}.test.js`))

    fs.createReadStream(path.join(templates, 'Component.scss')).pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.scss`))
    console.log(chalk.cyan(`Created ${ComponentName}.scss`))

    if (program.store) {
      fs.createReadStream(path.join(templates, 'Component.store.js'))
        .pipe(replaceStream('Component', ComponentName))
        .pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.store.js`))
      console.log(chalk.cyan(`Created ${ComponentName}.store.js`))
      updateIndexReducer(ComponentName, program.route).then(() => {
        console.log(chalk.green('Success.'))
      })
    } else {
      console.log(chalk.green('Success.'))
    }
  })
  .parse(process.argv)
