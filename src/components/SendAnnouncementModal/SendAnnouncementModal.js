import React from 'react'
import { useTranslation } from 'react-i18next'
import './SendAnnouncementModal.scss'
import Button from '../Button'

export default function SendAnnouncementModal ({
  closeModal,
  save,
  groupCount,
  myAdminGroups,
  groups
}) {
  const groupIds = groups.map(c => c.id)
  const groupAdminIds = myAdminGroups.map(c => c.id)
  const canAdminAllGroups = groupIds.every(val => groupAdminIds.indexOf(val) >= 0)
  const { t } = useTranslation()

  return (
    <div styleName='modal'>
      <div styleName='modal-container'>
        <h1 styleName='modal-header'>{t('MAKE AN ANNOUNCEMENT')}</h1>
        {groupCount === 1 && canAdminAllGroups &&
          <p styleName='modal-paragraph'>{t('This means that all members of this group will receive an instant email and push notification about this Post. (This feature is available to moderators only.')}</p>
        }
        {groupCount > 1 && canAdminAllGroups &&
          <p styleName='modal-paragraph'>{t('This means that all members of the {{groupCount}} groups selected will receive instant email and push notifications about this Post. (This feature is available to moderators only.', { groupCount })}</p>
        }

        {!canAdminAllGroups &&
          <span>
            <p styleName='modal-paragraph'>{t('This means that all members of the {{groupCount}} groups selected will receive an instant email and push notification about this Post.', { groupCount })}</p>
            <p styleName='modal-paragraph'>{t('This will only be sent as an Announcement to the groups where you are a Moderator. For other groups it will be shared as a regular Post.')}</p>
          </span>
        }
        <a>
          <Button styleName='close-button' small onClick={closeModal}>{t('Go Back')}</Button>
          <Button styleName='send-button' small onClick={save}>{t('Send It')}</Button>
        </a>
      </div>
    </div>
  )
}
