import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal ({
  closeModal,
  save,
  communityCount,
  communityMods,
  communities
}) {
  const communityLabel = communityCount > 1 ? `${communityCount} communities` : 'this community'
  const communityIds = communities.map(c => c.id)
  const communityModIds = communityMods.map(c => c.id)
  const canModerateAllCommunities = communityIds.every(val => communityModIds.indexOf(val) >= 0)

  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      <p styleName='modal-paragraph'>Send an email and push notification to the each member of {communityLabel} along with this announcement.</p>

      {!canModerateAllCommunities &&
        <p styleName='modal-paragraph'>This will only be sent as an announcement to the communities where you are are a moderator. For other communities it will be shared as a regular post.</p>
      }
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
