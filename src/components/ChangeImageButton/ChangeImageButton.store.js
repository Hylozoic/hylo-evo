import { pick } from 'client/filepicker'
import {
  UPLOAD_IMAGE
} from 'store/constants'

export function uploadImage (opts) {
  let { type, id } = opts
  let payload = new Promise((resolve, reject) => {
    pick({
      success: url => resolve({
        api: {
          method: 'post',
          path: '/noo/upload',
          params: {url, id, type}
        }
      }),
      failure: err => {
        if (err.code === 101) return resolve({})
        reject(err)
      }
    })
  })

  return {type: UPLOAD_IMAGE, payload, meta: {type, id}}
}
