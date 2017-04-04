#!/usr/bin/env node
const program = require('commander')
const replaceStream = require('replacestream')
const fs = require('fs')
const path = require('path')

// this file is for generating components via the cli
// run ./scripts/generate.js ComponentName [options]
// include --help to see help from the cli

program
  .arguments('<name>')
  .option('-r, --route', 'whether component is a route')
  .option('-c, --connected', 'whether component uses connect')
  .action(function (name) {
    console.log(`Creating a ${program.route ? 'route' : ''} component named ${name}`)
    const componentDir = path.join(__dirname, program.route ? '../src/routes' : '../src/components', name)
    const templates = path.join(__dirname, 'templates')
    if (fs.existsSync(componentDir)) {
      console.log('There is already an existing component with that name, canceling.')
      return
    }
    fs.mkdirSync(componentDir)
    fs.createReadStream(path.join(templates, 'Component.js'))
      .pipe(replaceStream('ReplaceComponent', name)) // requires special keyword because react uses keyword 'Component'
      .pipe(fs.createWriteStream(`${componentDir}/${name}.js`))
    console.log(`Created ${name}.js`)

    let indexName
    if (program.connected) {
      fs.createReadStream(path.join(templates, 'Component.connector.js'))
        .pipe(replaceStream('Component', name))
        .pipe(fs.createWriteStream(`${componentDir}/${name}.connector.js`))
      console.log(`Created ${name}.connector.js`)
      indexName = 'index.connected.js'
    } else {
      indexName = 'index.js'
    }
    fs.createReadStream(path.join(templates, indexName))
      .pipe(replaceStream('Component', name))
      .pipe(fs.createWriteStream(`${componentDir}/index.js`))
    console.log('Created index.js')

    fs.createReadStream(path.join(templates, 'Component.test.js'))
      .pipe(replaceStream('Component', name))
      .pipe(fs.createWriteStream(`${componentDir}/${name}.test.js`))
    console.log(`Created ${name}.test.js`)

    fs.createReadStream(path.join(templates, 'component.scss')).pipe(fs.createWriteStream(`${componentDir}/component.scss`))
    console.log('Created component.scss')
    console.log('Success.')
  })
  .parse(process.argv)
