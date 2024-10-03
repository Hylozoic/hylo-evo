import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import classes from './SendAnnouncementModal.module.scss'
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
    <div className={classes.modal}>
      <div className={classes.modalContainer}>
        <h1 className={classes.modalHeader}>{t('MAKE AN ANNOUNCEMENT')}</h1>
        {groupCount === 1 && canAdminAllGroups &&
          <p className={classes.modalParagraph}>{t('This means that all members of this group will receive an instant email and push notification about this Post. (This feature is available to moderators only.)')}</p>
        }
        {groupCount > 1 && canAdminAllGroups &&
          <p className={classes.modalParagraph}>{t('This means that all members of the {{groupCount}} groups selected will receive instant email and push notifications about this Post. (This feature is available to moderators only.)', { groupCount })}</p>
        }

        {!canAdminAllGroups &&
          <span>
            <p className={classes.modalParagraph}>{t('This means that all members of the {{groupCount}} groups selected will receive an instant email and push notification about this Post.', { groupCount })}</p>
            <p className={classes.modalParagraph}>{t('This will only be sent as an Announcement to the groups where you are a Moderator. For other groups it will be shared as a regular Post.')}</p>
          </span>
        }
        <div>
          <Button className={cx(classes.closeButton, classes.small)} onClick={closeModal}>{t('Go Back')}</Button>
          <Button className={cx(classes.sendButton, classes.small)} onClick={save}>{t('Send It')}</Button>
        </div>
      </div>
    </div>
  )
}
