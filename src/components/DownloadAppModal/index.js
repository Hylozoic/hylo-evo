import React from 'react'
import ReactDOM from 'react-dom'
import DownloadAppModal from './DownloadAppModal'

const DownloadAppPortal = function (props) {
  return ReactDOM.createPortal(
    <DownloadAppModal {...props} />,
      document.getElementById('root')
    )
}

export default DownloadAppPortal
