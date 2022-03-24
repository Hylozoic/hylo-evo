import React from 'react'
import './DownloadAppModal.scss'
import Button from '../Button'
import { axolotlPhone } from 'util/assets'

export default function DownloadAppModal ({ url, returnToPath }) {
  const deepLinkOrigin = 'hyloapp://home'
  const deepLinkPath = deepLinkOrigin + returnToPath
  const appStoreName = url.indexOf('android') === -1 ? 'Apple App Store' : 'Google Play Store'

  return (
    <div styleName='modal'>
      <div styleName='modal-container'>
        <a href={deepLinkPath}>
          <Button styleName='deep-link-button'>View in Hylo app</Button>
        </a>
        <p styleName='modal-message'>First-time user, please download the Hylo app from the <a href={url}>{appStoreName}</a>.</p>
        <img styleName='axolotl-phone-image' src={axolotlPhone} />
      </div>
    </div>
  )
}
