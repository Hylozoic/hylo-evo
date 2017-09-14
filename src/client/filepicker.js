import { loadScript } from './util'
import { filepickerKey } from 'config'

const services = [
  'COMPUTER',
  'URL',
  'WEBCAM',
  'FACEBOOK',
  'INSTAGRAM',
  'DROPBOX',
  'GOOGLE_DRIVE',
  'IMAGESEARCH'
]

/*
 * options:
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *   attachmentType: either 'image' or 'file'. Determines what file types are allowed
 */
const uploadCore = function ({ success, failure, attachmentType }) {
  const mimetype = attachmentType === 'image' ? 'image/*' : null
  window.filepicker.setKey(filepickerKey)
  window.filepicker.pick(
    {mimetype, multiple: false, services},
    blob => success(blob.url, blob.filename),
    failure
  )
}

export function pick (opts) {
  Promise.resolve(
    window.filepicker || loadScript('//api.filepicker.io/v2/filepicker.js')
  ).then(() => uploadCore(opts))
}
