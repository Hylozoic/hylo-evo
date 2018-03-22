import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal ({
  closeModal,
  save,
  communityCount,
  myModeratedCommunities,
  communities
}) {
  const communityIds = communities.map(c => c.id)
  const communityModIds = myModeratedCommunities.map(c => c.id)
  const canModerateAllCommunities = communityIds.every(val => communityModIds.indexOf(val) >= 0)

  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      {communityCount === 1 && canModerateAllCommunities &&
        <p styleName='modal-paragraph'>This means that all members of this community will receive an instant email and push notification about this Post. (Community Moderators only)</p>
      }
      {communityCount > 1 && canModerateAllCommunities &&
        <p styleName='modal-paragraph'>This means that all members of the {communityCount} communities selected will receive instant email and push notifications about this Post. (Community Moderators only)</p>
      }

      {!canModerateAllCommunities &&
        <span>
          <p styleName='modal-paragraph'>This means that all members of the {communityCount} communities selected will receive an instant email and push notification about this Post.</p>
          <p styleName='modal-paragraph'>This will only be sent as an Announcement to the communities where you are a Moderator. For other communities it will be shared as a regular Post.</p>
        </span>
      }
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
