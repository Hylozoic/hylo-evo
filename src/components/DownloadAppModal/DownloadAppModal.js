import React from 'react'
import Modal from 'react-modal'
import Button from 'components/Button'

import { axolotlPhone } from 'util/assets'
import './DownloadAppModal.scss'

export default function DownloadAppModal ({url, header}) {
  return <Modal
    isOpen
    contentLabel='Download Mobile App'
    style={modalStyles}
  >
    <div styleName='center'>
      <h1 styleName='header'>{header}</h1>
      <a href={url}>
        <Button>Go to the App Store</Button>
      </a>
      <img styleName='axolotl-phone-image' src={axolotlPhone} />
    </div>
  </Modal>
}

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(103, 117, 136, 0.75)'
  },
  content: {
    borderRadius: '10px'
  }
}
