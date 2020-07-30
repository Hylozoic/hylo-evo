import { get } from 'lodash/fp'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export default function getUploadPending ({ pending }, props) {
  const pendingUpload = get(UPLOAD_ATTACHMENT, pending)

  if (!props || !pendingUpload) return Boolean(pendingUpload)

  const { type, id = ID_FOR_NEW, attachmentType } = props

  return pendingUpload.type === type &&
    pendingUpload.id === id &&
    pendingUpload.attachmentType === attachmentType
}
