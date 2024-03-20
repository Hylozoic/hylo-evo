import LRU from 'lru-cache'
import mime from 'mime'
import request from 'request'
import streamifier from 'streamifier'
import { gzip } from 'zlib'
import { parse } from 'url'

const cache = LRU(50)

// flag-shared
const staticPages = [
  '',
  '/about',
  '/agreements',
  '/participate',
  '/terms',
  '/privacy',
  '/murmurations.json',
  // old ones below, can be removed when new site goes live
  '/help',
  '/help/markdown',
  '/about/careers',
  '/about/contact',
  '/about/team',
  '/evolve',
  '/invite-expired',
  '/subscribe',
  '/styleguide',
  '/team',
  '/newapp'
]

export const IOS_SITE_ASSOCIATION_FILE = 'apple-app-site-association'

export function transformPathname (pathname) {
  // remove trailing slash
  pathname = pathname.replace(/\/$/, '')

  // a path without an extension should be served by index.html in
  // the folder of the same name, unless it's the IOS_SITE_ASSOCIATION_FILE
  // which is needed for site verification for iOS app deep linking.
  if (pathname === `/${IOS_SITE_ASSOCIATION_FILE}`) {
    pathname += `.json`
  } else if (!pathname.match(/\.\w{2,4}$/)) {
    pathname += '/index.html'
  }

  return process.env.PROXY_HOST.replace(/\/$/, '') + pathname
}

export function getAndStore (url) {
  const chunks = []
  return new Promise((resolve, reject) => {
    request.get(url)
      .on('error', reject)
      .on('response', upstreamRes => {
        const gzipped = upstreamRes.headers['content-encoding'] === 'gzip'
        upstreamRes.on('data', d => chunks.push(d))
        upstreamRes.on('end', () => {
          const doc = Buffer.concat(chunks)
          const save = value => cache.set(url, value) && resolve(value)
          if (gzipped) {
            save(doc)
          } else {
            gzip(doc, (err, buf) => err ? reject(err) : save(buf))
          }
        })
      })
  })
}

export function handlePage (req, res) {
  if (process.env.DISABLE_PROXY) {
    return res.status(503).send('Service Unavailable')
  }

  const pathname = parse(req.url).pathname
  const newUrl = transformPathname(pathname)
  const cachedValue = cache.get(newUrl)

  console.log(`[proxy] ${pathname} -> ${newUrl} ${cachedValue ? '☺' : '↑'}`)

  const sendCachedData = data => {
    var mimeType = mime.getType(newUrl)
    res.set('Content-Type', mimeType)
    res.set('Content-Encoding', 'gzip')
    streamifier.createReadStream(data).pipe(res)
  }

  if (cachedValue) {
    sendCachedData(cachedValue)
  } else {
    getAndStore(newUrl)
      .then(() => sendCachedData(cache.get(newUrl)))
      .catch(err => res.status(500).send(err.message))
  }
}

export const handleStaticPages = server => {
  staticPages.forEach(page => {
    if (page === '') page = '/'
    server.get(page, handlePage)
  })

  server.use((req, res, next) => {
    // the static site must keep its images, CSS, etc. under the /static path so that,
    // or the root directory, so we know to proxy them.
    if (!req.originalUrl.startsWith('/static') && !/^\/[^/]+\.(js|css)$/.test(req.originalUrl)) return next()
    return handlePage(req, res)
  })
}

export const preloadCache = () => {
  console.log('preloading proxy cache')
  staticPages.forEach(page => {
    if (page === '') page = '/'
    const url = transformPathname(page)
    getAndStore(url)
  })
}
