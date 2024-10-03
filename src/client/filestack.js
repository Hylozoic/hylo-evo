import { filestackKey, isTest } from 'config/index'
import * as Filestack from 'filestack-js'

const filestack = Filestack.init(isTest ? 'dummykey' : filestackKey)

const FILESTACK_FROM_SOURCES = {
  csv: [
    'local_file_system',
    'url',
    'googledrive',
    'dropbox'
  ],
  image: [
    'local_file_system',
    'url',
    'webcam',
    'instagram',
    'facebook',
    'imagesearch',
    'googledrive',
    'dropbox'
  ],
  file: [
    'local_file_system',
    'url',
    'googledrive',
    'dropbox'
  ]
}

export const FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE = {
  csv: ['text/csv'],
  image: ['image/*'],
  file: ['video/*', 'audio/*', 'application/*', 'text/*']
}

export const FILESTACK_ACCEPTED_MIME_TYPES = [
  ...FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE.csv,
  ...FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE.image,
  ...FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE.file
]

export const ACCEPTED_ATTACHMENT_TYPES = ['csv', 'image', 'file']

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
  attachmentType = 'image',
  maxFiles = 1,
  onFileUploadFinished = () => {},
  onUploadDone,
  t,
  ...rest
}) {
  return filestack.picker({
    accept: acceptFromAttachmentType(attachmentType),
    customText: {
      'Select Files to Upload': attachmentType === 'image' ? t('Select Images to Upload (max 50 MB each)') : t('Select Files to Upload (max 50 MB each)')
    },
    fromSources: FILESTACK_FROM_SOURCES[attachmentType],
    maxFiles,
    maxSize: 52428800,
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
