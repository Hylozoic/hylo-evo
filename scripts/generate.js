#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const path = require('path')

// this file is for generating components via the cli

program
  .arguments('<name>')
  .option('-r, --route', 'whether component is a route')
  .action(function (name) {
    console.log(name, program.route)
    console.log(__dirname)
    const dir = path.join(__dirname, program.route ? '../src/routes' : '../src/components')
    if (fs.existsSync(dir)) {
      console.log('There is already an existing component with that name')
      return
    }
    fs.mkdirSync(dir)
    fs.createReadStream('./templates/Component.js').pipe(fs.createWriteStream(`${dir}/${name}.js`))
    fs.createReadStream('./templates/Component.connector.js').pipe(fs.createWriteStream(`${dir}/${name}.connector.js`))
    fs.createReadStream('./templates/Component.test.js').pipe(fs.createWriteStream(`${dir}/${name}.test.js`))
    fs.createReadStream('./templates/component.scss').pipe(fs.createWriteStream(`${dir}/component.scss`))
    fs.createReadStream('./templates/index.js').pipe(fs.createWriteStream(`${dir}/index.js`))
  })
  .parse(process.argv)
