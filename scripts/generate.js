#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const replaceStream = require('replacestream')
const fs = require('fs')
const path = require('path')

// this file is for generating components via the cli
// run ./scripts/generate.js ComponentName [options]
// include --help to see help from the cli

program
  .arguments('<name>')
  .option('-e, --extends', 'whether component should extend React.Component')
  .option('-r, --route', 'whether component is a route')
  .option('-c, --connected', 'whether component uses connect')
  .action(function (name) {
    console.log(chalk.cyan(`Creating a ${program.route ? 'route ' : ''}component named ${name}`))
    const componentDir = path.join(__dirname, program.route ? '../src/routes' : '../src/components', name)
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
      .pipe(replaceStream('ReplaceComponent', name)) // requires special keyword because react uses keyword 'Component'
      .pipe(fs.createWriteStream(`${componentDir}/${name}.js`))
    console.log(chalk.cyan(`Created ${name}.js`))

    let indexName
    if (program.connected) {
      fs.createReadStream(path.join(templates, 'Component.connector.js'))
        .pipe(replaceStream('Component', name))
        .pipe(fs.createWriteStream(`${componentDir}/${name}.connector.js`))
      console.log(chalk.cyan(`Created ${name}.connector.js`))
      indexName = 'index.connected.js'
    } else {
      indexName = 'index.js'
    }
    fs.createReadStream(path.join(templates, indexName))
      .pipe(replaceStream('Component', name))
      .pipe(fs.createWriteStream(`${componentDir}/index.js`))
    console.log(chalk.cyan('Created index.js'))

    fs.createReadStream(path.join(templates, 'Component.test.js'))
      .pipe(replaceStream('Component', name))
      .pipe(fs.createWriteStream(`${componentDir}/${name}.test.js`))
    console.log(chalk.cyan(`Created ${name}.test.js`))

    fs.createReadStream(path.join(templates, 'Component.scss')).pipe(fs.createWriteStream(`${componentDir}/${name}.scss`))
    console.log(chalk.cyan(`Created ${name}.scss`))
    console.log(chalk.green('Success.'))
  })
  .parse(process.argv)
