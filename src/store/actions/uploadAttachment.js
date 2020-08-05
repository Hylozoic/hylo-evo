import {
  filestackPick,
  FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE,
  mimetypeToAttachmentType
} from 'client/filestack'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export const ID_FOR_NEW = 'new'

export default function uploadAttachment (type, id, filestackFile) {
  const { url, filename, mimetype } = filestackFile
  const attachmentType = mimetypeToAttachmentType(mimetype)

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
      id,
      attachmentType
    }
  }
}

// Legacy -- limited to a single file selection
export function uploadAttachmentUsingFilestackLibrary ({
  type, // this is the type of thing that the upload is for, e.g. post
  id = ID_FOR_NEW, // this is the id of the thing that the upload is for
  attachmentType, // this is the attachment type used to identify a related attachment manager
  accept: providedAccept
}) {
  const payload = new Promise((resolve, reject) => {
    const accept = attachmentType
      ? FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE[attachmentType]
      : providedAccept
    const onFileUploadFinished = result =>
      resolve(uploadAttachment(type, id, result).payload)

    filestackPick({
      accept,
      onFileUploadFinished,
      onFileUploadFailed: err => reject(err),
      onCancel: () => resolve()
    })
  })

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: {
      type,
      id,
      attachmentType
    }
  }
}
