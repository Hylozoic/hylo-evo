const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

module.exports = {
  updateIndexReducer: function (ComponentName, isRoute) {
    return new Promise((resolve, reject) => {
      const indexReducerPath = path.join(__dirname, '../../src/store/reducers/index.js')
      const localStorePath = isRoute ? `routes/${ComponentName}/${ComponentName}.store` : `components/${ComponentName}/${ComponentName}.store`
      const importMarker = '// generator-marker-local-store-import'
      const reducerMarker = '// generator-marker-local-store-reducer'
      let reducer = ''
      fs.createReadStream(indexReducerPath)
        .on('data', chunk => { reducer = chunk })
        .on('end', () => {
          reducer = reducer.toString()
            .replace(importMarker, `${importMarker}\nimport ${ComponentName} from '${localStorePath}'`)
            .replace(reducerMarker, `${reducerMarker}\n  ${ComponentName},`)
          fs.writeFile(indexReducerPath, reducer, err => {
            if (err) {
              reject(err)
              return
            }
            console.log(chalk.cyan(`Modified src/store/reducers/index.js to include the new ${ComponentName} reducer`))
            resolve()
          })
        })
        .on('error', reject)
    })
  }
}
