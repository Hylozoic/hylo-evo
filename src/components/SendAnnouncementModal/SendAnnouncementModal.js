import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal () {
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      <p styleName='modal-paragraph'>Send an email and push notif to the entire community of ___ members along with this announcement.</p>
      <a>
        <Button>Go Back</Button>
        <Button>Send It</Button>
      </a>
    </div>
  </div>
}
