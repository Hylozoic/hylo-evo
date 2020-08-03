import React from 'react'
import ReactFilestack from 'filestack-react'
import { filestackKey, isTest } from 'config'
import { ALL_ACCEPTED_MIME_TYPES } from 'client/filepicker'

// import PropTypes from 'prop-types'
// import cx from 'classnames'
// import './FileStackUploader.scss'
// import Icon from 'components/Icon'
// import RoundImage from 'components/RoundImage'

export default function FileStackUploader ({ uploadAttachment }) {
  return <React.Fragment>
    <ReactFilestack
      apikey={isTest ? 'dummykey' : filestackKey}
      actionOptions={{
        accept: ALL_ACCEPTED_MIME_TYPES,
        maxFiles: 10
      }}
      // customRender={PickerComponent}
      onSuccess={({ filesUploaded }) => filesUploaded.forEach(result => uploadAttachment(result))}
    />
  </React.Fragment>
}

// export function PickerComponent ({ onPick }) {
//   return <div>
//     <strong>Attach</strong>
//      <button onClick={onPick}>Pick</button>
//   </div>
// }

// FileStackUploader.propTypes = {
//   type: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   attachmentType: PropTypes.string,
//   uploadAttachment: PropTypes.func.isRequired
// }
