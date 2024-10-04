#!/usr/bin/env node
const { updateIndexReducer } = require('./generatorHelpers')
const program = require('commander')
const chalk = require('chalk')
const replaceStream = require('replacestream')
const fs = require('fs')
const path = require('path')

// this file is for generating components via the cli
// run ./scripts/generate.js store ComponentName [options]
// include --help to see help from the cli

program
  .arguments('<ComponentName>')
  .action(function (ComponentName) {
    console.log(chalk.cyan(`Looking for a component named ${ComponentName}`))
    const componentDir = path.join(__dirname, '../src/components', ComponentName)
    const routesDir = path.join(__dirname, '../src/routes', ComponentName)
    const templates = path.join(__dirname, 'templates')
    const isComp = fs.existsSync(componentDir)
    const isRoute = fs.existsSync(routesDir)
    if (!isComp && !isRoute) {
      console.log(chalk.red('There is no component or route with that name, canceling.'))
      return
    }
    const connectorPath = path.join(isComp ? componentDir : routesDir, `${ComponentName}.connector.js`)
    if (!fs.existsSync(connectorPath)) {
      console.log(chalk.yellow('No connector file found. Creating one...'))
      fs.createReadStream(path.join(templates, 'Component.connector.js'))
        .pipe(replaceStream('Component', ComponentName))
        .pipe(fs.createWriteStream(`${isComp ? componentDir : routesDir}/${ComponentName}.connector.js`))
      console.log(chalk.cyan(`Created ${ComponentName}.connector.js`))

      fs.createReadStream(path.join(templates, 'index.connected.js'))
        .pipe(replaceStream('Component', ComponentName))
        .pipe(fs.createWriteStream(`${isComp ? componentDir : routesDir}/index.js`))
      console.log(chalk.cyan('Replaced index.js'))
    }
    fs.createReadStream(path.join(templates, 'Component.store.js'))
      .pipe(replaceStream('Component', ComponentName))
      .pipe(fs.createWriteStream(`${componentDir}/${ComponentName}.store.js`))
    console.log(chalk.cyan(`Created ${ComponentName}.store.js`))

    updateIndexReducer(ComponentName, isRoute).then(() => {
      console.log(chalk.green('Success.'))
      const reminders = `
        The next steps are:
        - edit your reducer
        - define your actions and import them to your ${ComponentName}.connector.js file and add them to mapDispatchToProps
        - define your selectors and import them to your ${ComponentName}.connector.js file and add them to mapStateToProps
      `
      console.log(chalk.cyan(reminders))
      process.exit()
    })
  })
  .parse(process.argv)
