import { filestackKey, isTest } from 'config'
import * as filestack from 'filestack-js'

const filePicker = filestack.init(isTest ? 'dummykey' : filestackKey)

/*
 * options:
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *   attachmentType: either 'image' or 'file'. Determines what file types are allowed
 */
export const uploadFile = function ({ success, cancel, failure, attachmentType }) {
  let accept, fromSources
  switch (attachmentType) {
    case 'image':
      accept = ['image/*']
      fromSources = [
        'local_file_system',
        'url',
        'webcam',
        'facebook',
        'instagram',
        'dropbox',
        'googledrive',
        'imagesearch'
      ]
      break
    case 'csv':
      accept = ['text/csv']
      fromSources = [
        'local_file_system',
        'url',
        'dropbox',
        'googledrive'
      ]
      break
    default:
      accept = ['video/*', 'audio/*', 'application/*', 'text/*']
      fromSources = [
        'local_file_system',
        'url',
        'webcam',
        'facebook',
        'dropbox',
        'googledrive'
      ]
  }

  filePicker.picker({
    accept,
    fromSources,
    maxFiles: 1, // TODO: allow for more at once in PostEditor
    onFileUploadFinished: file => {
      const url = attachmentType === 'image' ? 'https://cdn.filestackcontent.com/rotate=deg:exif/' + file.handle : file.url
      success(url, file.filename)
    },
    onFileUploadFailed: failure,
    onCancel: cancel
  }).open()
}
