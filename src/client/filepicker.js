import { join } from 'path'
import qs from 'querystring'
import { loadScript } from './util'
import { s3, filepickerKey } from 'config'

// order matters, except for CONVERT, which toggles the crop UI
const services = [
  // 'CONVERT',
  'COMPUTER',
  'URL',
  'WEBCAM',
  'FACEBOOK',
  'INSTAGRAM',
  'DROPBOX',
  'GOOGLE_DRIVE'
]

const makeFilename = function (blob) {
  let extension = ''
  let timestamp = new Date().getTime().toString()

  if (blob.filename) {
    return timestamp + '_' + blob.filename.replace(/[ %+]/g, '')
  }

  switch (blob.mimetype) {
    case 'image/png':
      extension = '.png'
      break
    case 'image/jpeg':
      extension = '.jpg'
      break
    case 'image/gif':
      extension = '.gif'
      break
  }
  return timestamp + extension
}

/*
 * options:
 *   path:     the S3 folder under which the file will be saved
 *   convert:  image conversion settings (see filepicker docs)
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *
 */
const uploadCore = function (opts) {
  let { path, success, failure, convert } = opts
  let { storeUrl, setKey, pick } = window.filepicker

  var convertAndStore = function (blob) {
    // apply additional context-specific conversion settings
    let conversion = {compress: true, quality: 90, ...convert}

    // blob.url will end with "/convert?crop=..."
    // if "CONVERT" is in the list of services
    let url = blob.url + '/convert?' + qs.stringify(conversion)

    storeUrl(
      url,
      {
        access: 'public',
        container: s3.bucket,
        location: 'S3',
        path: join(path, makeFilename(blob))
      },
      stored => success(s3.host + '/' + stored.key),
      failure
    )
  }

  setKey(filepickerKey)

  pick(
    {
      mimetype: 'image/*',
      multiple: false,
      services
    },
    convertAndStore,
    failure
  )
}

export const upload = function (opts) {
  Promise.resolve(
    window.filepicker || loadScript('//api.filepicker.io/v2/filepicker.js')
  ).then(() => uploadCore(opts))
}
