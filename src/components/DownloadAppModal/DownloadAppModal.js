import React from 'react'
import Modal from 'react-modal'
import Button from 'components/Button'

import { axolotlPhone } from 'util/assets'
import './DownloadAppModal.scss'

export default function DownloadAppModal ({url}) {
  return <Modal
    isOpen
    contentLabel='Download Mobile App'
  >
    <div styleName='center'>
      <h1>Download the app to sign up!</h1>
      <a href={url}>
        <Button>Go to the App Store</Button>
      </a>
      <img styleName='axolotl-phone-image' src={axolotlPhone} />
    </div>
  </Modal>
}
