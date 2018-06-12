import React from 'react'
import './DownloadAppModal.scss'
import Button from '../Button'
import { axolotlPhone } from 'util/assets'

export default function DownloadAppModal ({url}) {
  const deepLinkOrigin = 'HyloApp://home'
  const deepLinkPath = deepLinkOrigin + window.location.pathname
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <p styleName='modal-message'>Click to view in Hylo mobile.</p>
      <p styleName='modal-message'>If you see an error, click the download link to start using our mobile app.</p>

      <a href={deepLinkPath}>
        <Button styleName='deep-link-button'>View in Hylo mobile</Button>
      </a>
      <a href={url}>
        <Button>Download Hylo mobile</Button>
        <img styleName='axolotl-phone-image' src={axolotlPhone} />
      </a>
    </div>
  </div>
}
