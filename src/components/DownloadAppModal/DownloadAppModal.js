import React from 'react'
import './DownloadAppModal.scss'
import Button from '../Button'
import { axolotlPhone } from 'utils/assets'

export default function DownloadAppModal ({url, header = 'Download the app to use Hylo on mobile!'}) {
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>{header}</h1>
      <a href={url}>
        <Button>Go to the App Store</Button>
        <img styleName='axolotl-phone-image' src={axolotlPhone} />
      </a>
    </div>
  </div>
}
