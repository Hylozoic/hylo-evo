import { uploadFile } from 'client/filepicker'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export function upload (opts) {
  let {
    type, // this is the type of thing that the upload is for, e.g. post
    id, // this is the id of the thing that the upload is for
    attachmentType // this is the type of the upload itself, e.g. image or file
  } = opts
  let payload = new Promise((resolve, reject) => {
    uploadFile({
      success: (url, filename) => resolve({
        api: {
          method: 'post',
          path: '/noo/upload',
          params: { url, id, type, filename }
        }
      }),
      cancel: () => resolve({}),
      failure: err => reject(err),
      attachmentType
    })
  })

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: { type, id, attachmentType }
  }
}
