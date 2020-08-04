import { filestackKey, isTest } from 'config'
import * as filestack from 'filestack-js'

const filePicker = filestack.init(isTest ? 'dummykey' : filestackKey)

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

// Legacy -- Use if not using FilestackUploader (FilestackReact) component
export const filestackUploader = function ({
  accept = FILESTACK_ACCEPTED_MIME_TYPES,
  fromSources = FILESTACK_FROM_SOURCES,
  maxFiles = 1,
  onFileUploadFinished,
  onFileUploadFailed,
  onCancel,
  ...rest
}) {
  filePicker.picker({
    accept,
    fromSources,
    maxFiles,
    onFileUploadFinished: file => {
      const url = file.mimetype.split('/')[0] === 'image'
        ? 'https://cdn.filestackcontent.com/rotate=deg:exif/' + file.handle
        : file.url
      onFileUploadFinished({ ...file, url })
    },
    onFileUploadFailed,
    onCancel,
    ...rest
  }).open()
}
