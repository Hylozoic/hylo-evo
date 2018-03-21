import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal ({closeModal, save, communityCount}) {
  const communityLabel = communityCount > 1 ? `${communityCount} communities` : 'this community'
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      <p styleName='modal-paragraph'>Send an email and push notification to the each member of {communityLabel} along with this announcement.</p>
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
