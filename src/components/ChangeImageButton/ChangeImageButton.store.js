import { pick } from 'client/filepicker'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export function upload (opts) {
  let {
    type, // this is the type of thing that the upload is for, e.g. post
    id, // this is the id of the thing that the upload is for
    attachmentType // this is the type of the upload itself, e.g. image or file
  } = opts
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

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: {type, id, attachmentType}
  }
}
