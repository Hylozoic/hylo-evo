import { filestackKey, isTest } from 'config'
import * as filestack from 'filestack-js'

const filePicker = filestack.init(isTest ? 'dummykey' : filestackKey)

const fromSources = [
  'local_file_system',
  'url',
  'webcam',
  'facebook',
  'instagram',
  'dropbox',
  'googledrive',
  'imagesearch'
]

/*
 * options:
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *   attachmentType: either 'image' or 'file'. Determines what file types are allowed
 */
export const uploadFile = function ({ success, cancel, failure, attachmentType }) {
  const acceptedTypes = {
    image: ['image/*'],
    file: ['video/*', 'audio/*', 'application/*', 'text/*']
  }
  const accept = attachmentType
    ? acceptedTypes[attachmentType]
    : [...acceptedTypes.image, ...acceptedTypes.file]
    
  filePicker.picker({
    accept,
    fromSources,
    maxFiles: 1, // TODO: allow for more at once in PostEditor
    onFileUploadFinished: file => {
      const url = 'https://cdn.filestackcontent.com/rotate=deg:exif/' + file.handle
      success(url, file.filename)
    },
    onFileUploadFailed: failure,
    onCancel: cancel
  }).open()
}
