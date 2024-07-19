import { UPLOAD_ATTACHMENT } from 'store/constants'

export default function uploadAttachment (type, id, attachment) {
  const { url, filename, attachmentType } = attachment

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
