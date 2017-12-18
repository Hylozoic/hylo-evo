import React from 'react'
import './DownloadAppModal.scss'
import Modal from '../Modal'
import Button from '../Button'
import { axolotlPhone } from 'util/assets'

export default function DownloadAppModal () {
  return <Modal>
    <div styleName='modal'>
      <div styleName='modal-container'>
        <h1 styleName='modal-header'>Download the app to sign up!</h1>
        <a href='www.google.com'>
          <Button>Go to the App Store</Button>
          <img styleName='axolotl-phone-image' src={axolotlPhone} />
        </a>
      </div>
    </div>
  </Modal>
}
