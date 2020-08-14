import { filestackKey, isTest } from 'config'
import * as Filestack from 'filestack-js'

const filestack = Filestack.init(isTest ? 'dummykey' : filestackKey)

const FILESTACK_FROM_SOURCES = [
  'local_file_system',
  'url',
  'webcam',
  'facebook',
  'instagram',
  'dropbox',
  'googledrive',
  'imagesearch'
]

export const FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE = {
  image: ['image/*'],
  file: ['video/*', 'audio/*', 'application/*', 'text/*']
}

export const FILESTACK_ACCEPTED_MIME_TYPES = [
  ...FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE.image,
  ...FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE.file
]

export const ACCEPTED_ATTACHMENT_TYPES = ['image', 'file']

export function getRootMimeType (mimetype = '') {
  return mimetype.split('/')[0]
}

export function mimetypeToAttachmentType (mimetype) {
  const rootMimetype = getRootMimeType(mimetype)

  return ACCEPTED_ATTACHMENT_TYPES.includes(rootMimetype)
    ? rootMimetype
    : 'file'
}

export function acceptFromAttachmentType (attachmentType) {
  return attachmentType && ACCEPTED_ATTACHMENT_TYPES.includes(attachmentType)
    ? FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE[attachmentType]
    : FILESTACK_ACCEPTED_MIME_TYPES
}

export function uploadedFileToAttachment ({ url, filename, mimetype }) {
  return {
    url,
    filename,
    attachmentType: mimetypeToAttachmentType(mimetype)
  }
}

export function transformFile (file) {
  // Apply rotation from EXIF metadata
  const url = getRootMimeType(file.mimetype) === 'image'
    ? 'https://cdn.filestackcontent.com/rotate=deg:exif/' + file.handle
    : file.url

  return { ...file, url }
}

export function filestackPicker ({
  accept = FILESTACK_ACCEPTED_MIME_TYPES,
  fromSources = FILESTACK_FROM_SOURCES,
  maxFiles = 1,
  onFileUploadFinished = () => {},
  onUploadDone,
  ...rest
}) {
  return filestack.picker({
    accept,
    fromSources,
    maxFiles,
    onFileUploadFinished: fileUploaded =>
      onFileUploadFinished(transformFile(fileUploaded)),
    onUploadDone: ({ filesUploaded, ...rest }) => {
      return onUploadDone({
        filesUploaded: filesUploaded.map(file => transformFile(file)),
        ...rest
      })
    },
    ...rest
  })
}
