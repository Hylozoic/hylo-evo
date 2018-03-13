import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'
import { pluralize } from 'util/index'

export default function SendAnnouncementModal ({closeModal, save, communityMembersCount}) {
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      <p styleName='modal-paragraph'>Send an email and push notif to the entire community of {pluralize(communityMembersCount, 'member')} along with this announcement.</p>
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
