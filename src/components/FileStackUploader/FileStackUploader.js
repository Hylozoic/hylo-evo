import React from 'react'
import * as PropTypes from 'prop-types'
import ReactFilestack from 'filestack-react'
import { filestackKey, isTest } from 'config'
import { ALL_ACCEPTED_MIME_TYPES } from 'client/filepicker'

export default function FilestackUploader ({
  type,
  id,
  uploadAttachment,
  onUploadAttachmentSuccess,
  onUploadAttachmentError,
  apiKey,
  componentDisplayMode: providedComponentDisplayMode,
  actionOptions: providedActionOptions,
  customRender
}) {
  const actionOptions = {
    accept: ALL_ACCEPTED_MIME_TYPES,
    maxFiles: 10,
    ...providedActionOptions
  }
  const componentDisplayMode = {
    //
    ...providedComponentDisplayMode
  }
  const onSuccess = ({ filesUploaded }) => filesUploaded.forEach(uploadedFile =>
    uploadAttachment(type, id, uploadedFile).then(response => {
      if (!response) {
        return onUploadAttachmentError(
          new Error('No response returned from uploader')
        )
      }
      if (response.error) return onUploadAttachmentError(response.error)
      if (response.payload) return onUploadAttachmentSuccess(response.payload)
    })
  )

  return <ReactFilestack
    apikey={apiKey}
    componentDisplayMode={componentDisplayMode}
    actionOptions={actionOptions}
    onSuccess={onSuccess}
    customRender={customRender}
  />
}

FilestackUploader.defaultProps = {
  onUploadAttachmentError: () => {},
  apiKey: isTest ? 'dummykey' : filestackKey,
  componentDisplayMode: {},
  actionOptions: {}
}

FilestackUploader.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  uploadAttachment: PropTypes.func.isRequired,
  onUploadAttachmentSuccess: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
  componentDisplayMode: PropTypes.object.isRequired,
  actionOptions: PropTypes.object.isRequired,
  customRender: PropTypes.func,
  onSuccess: PropTypes.func
}
