import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { patchCssModules } from 'vite-css-modules'
import eslint from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import graphqlLoader from 'vite-plugin-graphql-loader'
// import htmlPurge from 'vite-plugin-html-purgecss'
import svgr from 'vite-plugin-svgr'
import dotenv from 'dotenv'
// import fs from 'fs'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: '.env' })

const proxyTarget = process.env.VITE_API_HOST || 'http://localhost:3001'

export default defineConfig({
  define: {
    'process.env.PUBLIC_URL': JSON.stringify('')
  },
  plugins: [
    patchCssModules(),
    react(),
    eslint({
      exclude: ['/virtual:/', 'node_modules/**'],
      failOnError: false, // Prevents Vite from stopping on lint errors
      failOnWarning: false // Ensures warnings don't block the build either
    }),
    {
      name: 'treat-js-files-as-jsx',
      async transform (code, id) {
        if (!id.match(/src\/.*\.js$/)) return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic'
        })
      }
    },
    createHtmlPlugin({
      entry: 'src/index.jsx',
      template: 'index.html',
      inject: {
        data: {
          title: 'index',
          injectScript: '<script src="./inject.js"></script>'
        }
      }
    }),
    // htmlPurge(),
    svgr(),
    graphqlLoader()
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    },
    include: ['**/*.scss'] // Include all .scss files
  },
  server: {
    // XXX: fix issues finding aliases?
    fs: {
      cachedChecks: false
    },
    port: process.env.PORT || 3000,
    // https: process.env.HTTPS === 'true' ? {
    //   key: fs.readFileSync(path.resolve(__dirname, `./config/ssl/${process.env.LOCAL_CERT}.key`)),
    //   cert: fs.readFileSync(path.resolve(__dirname, `./config/ssl/${process.env.LOCAL_CERT}.crt`)),
    //   ca: fs.readFileSync(path.resolve(__dirname, `./config/ssl/${process.env.LOCAL_CERT}.pem`)),
    // } : false,
    proxy: {
      '/noo': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Browser may send Origin headers even with same-origin requests.
            // To prevent CORS issues, we have to change the Origin to match the target URL.
            if (proxyReq.getHeader('origin')) {
              proxyReq.setHeader('origin', proxyTarget)
            }
          })
          proxy.on('error', (err, req, res) => {
            const host = req.headers && req.headers.host
            console.error(
              `Proxy error: Could not proxy request ${req.url} from ${host} to ${proxyTarget}.`,
              'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information',
              err.code
            )
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end(`Proxy error: Could not proxy request ${req.url} from ${host} to ${proxyTarget} (${err.code}).`)
          })
        }
      }
    }
  },
  resolve: {
    alias: {
      client: path.resolve(__dirname, 'src/client'),
      components: path.resolve(__dirname, 'src/components'),
      config: path.resolve(__dirname, 'src/config'),
      contexts: path.resolve(__dirname, 'src/contexts'),
      css: path.resolve(__dirname, 'src/css'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      '@graphql': path.resolve(__dirname, 'src/graphql'),
      router: path.resolve(__dirname, 'src/router'),
      routes: path.resolve(__dirname, 'src/routes'),
      store: path.resolve(__dirname, 'src/store'),
      util: path.resolve(__dirname, 'src/util')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]_[local]_[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/css/global/sass_resources.scss";'
      }
    }
  }
})
