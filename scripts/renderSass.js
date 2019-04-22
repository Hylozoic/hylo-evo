const sassExtract = require('sass-extract')
const glob = require('glob')
const paths = require('../config/paths')

const SASS_GLOBAL_VARIABLES_FILE_PATH = 'src/css/global/_sass_resources.scss'

function getSassGlobalVariables () {
  return sassExtract.render(
    { file: SASS_GLOBAL_VARIABLES_FILE_PATH },
    { plugins: ['minimal'] }
  )
}

// const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
// const postcssNested = require('postcss-nested')
// const postcssModulesResolvePath = require('postcss-modules-resolve-path')
// const postcssScss = require('postcss-scss')
// const postcssMixins = require('postcss-mixins')
// const postcssSass = require('@csstools/postcss-sass')

// const { resolve } = require('path');
const { readFile } = require('fs').promises

var sassGlobalVariables

async function processWithPostCss (filepath = 'src/components/PostEditor/PostEditor.scss') {
  let result
  try {
    const css = await readFile(filepath)
    if (!sassGlobalVariables) {
      sassGlobalVariables = await getSassGlobalVariables()
      // console.log('!!!! --- sassGlobalVariables:', sassGlobalVariables)
    }
    const processor = await postcss([
      require('postcss-modules')({
        plugins: [
          require('postcss-simple-vars')({
            variables: sassGlobalVariables.vars.global
          }),
          require('postcss-mixins')({
            mixinsFiles: paths.appSrc + '/css/global/_postcss_mixins.css'
          }),
          require('precss')({
            paths: [
              paths.appSrc,
              paths.appNodeModules
            ],
            preserveEmpty: true,
            // unresolved: 'ignore',
            // variables: sassGlobalVariables.vars.global
          })    
        ]
      })
    ])
    // console.log('!!! css:', css)
    result = await processor.process(css, {
      // parser: postcssScss,
      // syntax: postcssScss
    })

    console.log('!!! successfully processed:', filepath)
  } catch (error) {
    console.log('!!! ERROR processing file:', filepath, error)
  }
}

glob('src/**/*.scss', function(err, files) {
  files.forEach(filepath => {
    return processWithPostCss(filepath)
  })
})

// .process(css, { from: filepath })    
// fs.writeFile('dest/app.css', finalResult.css, () => true)
// if ( result.map ) {
//   fs.writeFile('dest/app.css.map', result.map, () => true)
// }

// const subdirs = await readdir(dir);
// const files = await Promise.all(subdirs.map(async (subdir) => {
//   const res = resolve(dir, subdir);
//   return (await stat(res)).isDirectory() ? getFiles(res) : res;
// }));
// return Array.prototype.concat(...files);
