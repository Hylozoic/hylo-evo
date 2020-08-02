import { get } from 'lodash/fp'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export default function getUploadPending ({ pending }, { type, id = ID_FOR_NEW, attachmentType } = {}) {
  const pendingUpload = get(UPLOAD_ATTACHMENT, pending)

  if (!pendingUpload) return Boolean(pendingUpload)

  return pendingUpload.type === type &&
    pendingUpload.id === id &&
    pendingUpload.attachmentType === attachmentType
}
