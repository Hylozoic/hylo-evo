import { pick } from 'client/filepicker'
import { UPLOAD_IMAGE } from 'store/constants'

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
        // code 101 = user canceled the filepicker UI.
        // we have to resolve or reject so that we don't stay in pending state,
        // but we also don't want to create an action with an error, since there
        // wasn't any real error, so we just resolve with an empty payload.
        if (err.code === 101) return resolve({})

        reject(err)
      }
    })
  })

  return {type: UPLOAD_IMAGE, payload, meta: {type, id}}
}
