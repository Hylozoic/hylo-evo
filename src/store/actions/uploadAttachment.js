import { uploadFile, ACCEPTED_MIME_TYPES } from 'client/filepicker'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export const ID_FOR_NEW = 'new'

export default function uploadAttachment (type, id, result) {
  const { url, filename } = result

  if (!url) return {}

  return {
    type: UPLOAD_ATTACHMENT,
    payload: {
      api: {
        method: 'post',
        path: '/noo/upload',
        params: {
          type,
          id,
          url,
          filename
        }
      }
    },
    meta: {
      type,
      id
    }
  }
}

export function uploadAttachmentUsingPicker ({
  type, // this is the type of thing that the upload is for, e.g. post
  id = ID_FOR_NEW, // this is the id of the thing that the upload is for
  attachmentType, // this is the attachment type used to identify a related attachment manager
  accept
}) {
  const payload = new Promise((resolve, reject) => {
    const acceptedMimeTypes = attachmentType
      ? ACCEPTED_MIME_TYPES[attachmentType]
      : accept

    uploadFile({
      success: result => resolve(uploadAttachment(type, id, result).payload),
      cancel: () => resolve(),
      failure: err => reject(err),
      accept: acceptedMimeTypes
    })
  })

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: { type, id, attachmentType }
  }
}
