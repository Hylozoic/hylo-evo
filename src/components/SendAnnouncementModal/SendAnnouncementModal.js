import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal ({
  closeModal,
  save,
  groupCount,
  myModeratedGroups,
  groups
}) {
  const groupIds = groups.map(c => c.id)
  const groupModIds = myModeratedGroups.map(c => c.id)
  const canModerateAllGroups = groupIds.every(val => groupModIds.indexOf(val) >= 0)

  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      {groupCount === 1 && canModerateAllGroups &&
        <p styleName='modal-paragraph'>This means that all members of this group will receive an instant email and push notification about this Post. (This feature is available to moderators only.)</p>
      }
      {groupCount > 1 && canModerateAllGroups &&
        <p styleName='modal-paragraph'>This means that all members of the {groupCount} groups selected will receive instant email and push notifications about this Post. (This feature is available to moderators only.)</p>
      }

      {!canModerateAllGroups &&
        <span>
          <p styleName='modal-paragraph'>This means that all members of the {groupCount} groups selected will receive an instant email and push notification about this Post.</p>
          <p styleName='modal-paragraph'>This will only be sent as an Announcement to the groups where you are a Moderator. For other groups it will be shared as a regular Post.</p>
        </span>
      }
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
