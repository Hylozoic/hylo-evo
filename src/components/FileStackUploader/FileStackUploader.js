import React from 'react'
import * as PropTypes from 'prop-types'
import ReactFilestack from 'filestack-react'
import { filestackKey, isTest } from 'config'
import { ALL_ACCEPTED_MIME_TYPES } from 'client/filepicker'

// import cx from 'classnames'
// import './FilestackUploader.scss'
// import Icon from 'components/Icon'

export default function FilestackUploader ({
  type,
  id,
  uploadAttachment,
  onUploadAttachmentSuccess,
  onUploadAttachmentError,
  apiKey,
  componentDisplayMode: providedComponentDisplayMode,
  actionOptions: providedActionOptions
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
      if (!response) return onUploadAttachmentError(
        new Error('No response returned from uploader')
      )
      if (response.error) return onUploadAttachmentError(response.error)
      if (response.payload) return onUploadAttachmentSuccess(response.payload)
    })
  )

  return <ReactFilestack
    apikey={apiKey}
    componentDisplayMode={componentDisplayMode}
    actionOptions={actionOptions}
    onSuccess={onSuccess}
  />
}

FilestackUploader.defaultProps = {
  onUploadAttachmentError: '',
  apiKey: isTest ? 'dummykey' : filestackKey,
  componentDisplayMode: {},
  actionOptions: {}
}


FilestackUploader.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  uploadAttachment: PropTypes.func.isRequired,
  onUploadAttachmentSuccess: PropTypes.func.isRequired,
  apiKey: PropTypes.func.isRequired,
  componentDisplayMode: PropTypes.object.isRequired,
  actionOptions: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
}

// customRender={PickerComponent}
// export function PickerComponent ({ onPick }) {
//   return <div>
//     <strong>Attach</strong>
//      <button onClick={onPick}>Pick</button>
//   </div>
// }

// FilestackUploader.propTypes = {
//   type: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   attachmentType: PropTypes.string,
//   uploadAttachment: PropTypes.func.isRequired
// }
