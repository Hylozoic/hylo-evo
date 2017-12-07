import React from 'react'
import Modal from 'react-modal'
import Button from 'components/Button'
import { Link } from 'react-router-dom'

import { axolotlPhone } from 'util/assets'
import './DownloadAppModal.scss'

export default function DownloadAppModal () {
  return <Modal
    isOpen
  >
    <div styleName='center'>
      <h1>Download the app to sign up!</h1>
      <Link to={'/blah'}>
        <Button>Go to the App Store</Button>
      </Link>
      <img styleName='axolotl-phone-image' src={axolotlPhone} />
    </div>
  </Modal>
}
