import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'components/Icon'

import classes from './IconSelector.module.scss'

const iconList = [
  'Public',
  'ProfileUrl',
  'Document',
  'SmallEdit',
  'Post',
  'Letter',
  'EmailNotification',
  'Notifications',
  'InAppNotification',
  'PushNotification',
  'Phone',
  'Email',
  'Announcement',
  'Star',
  'Plus',
  'ArrowForward',
  'Reply',
  'Send',
  'Checkmark',
  'Complete',
  'Settings',
  'Download',
  'Empty',
  'Circle',
  'CircleEx',
  'Circle-Plus',
  'AddImage',
  'Clock',
  'StarCircle',
  'Ex',
  'Topics',
  'Smiley',
  'Person',
  'Invite',
  'NewCommunity',
  'Members',
  'Messages',
  'Message',
  'Discussion',
  'SpeechBubble',
  'Replies',
  'Search',
  'Share',
  'ArrowUp',
  'ArrowDown',
  'Location',
  'Trash',
  'Pin',
  'Flag',
  'Paperclip',
  'Stack',
  'Calendar',
  'Event',
  'Funnel',
  'BadgeCheck',
  'Shield',
  'Enter-Door',
  'Lock',
  'Unlock',
  'Eye',
  'Hidden',
  'Copy',
  'Resource',
  'Offer',
  'Hand',
  'Handshake',
  'Buy',
  'Cooperative',
  'Filter',
  'Mentorship',
  'Volunteering',
  'Research',
  'Equipment_sharing',
  'Support',
  'Loans',
  'Ecosystem_service_markets',
  'Markets',
  'Socials',
  'Website',
  'Edit',
  'ProfileTwitter',
  'ProfileLinkedin',
  'ProfileFacebook',
  'Twitter',
  'LinkedIn',
  'Facebook',
  'Google',
  'Instagram',
  'Figma',
  'OpenHands',
  'GoogleDrive',
  'GitHub',
  'Miro',
  'Notion',
  'Gitbook',
  'Slack',
  'Discord',
  'WhatsApp',
  'Telegram',
  'Gallery',
  'Commonwealth',
  'Docs',
  'PDF'
]

export default function IconSelector ({ selectedIcon, updateIcon, selectedIconClass }) {
  const [modalOpen, setModalOpen] = React.useState(false)

  const toggleModalOpen = () => setModalOpen(!modalOpen)
  const { t } = useTranslation()

  return (
    <div className={classes.iconSelectorContainer}>
      <div className={classes.selectedIcon} onClick={toggleModalOpen}>
        {selectedIcon ? <Icon green name={selectedIcon} className={selectedIconClass} /> : <div className={classes.text}>{t('No icon selected')}</div>}
        <Icon name='ArrowDown' />
      </div>
      <div className={cx(classes.iconOptions, { [classes.open]: modalOpen })}>
        {iconList.map((icon) => (
          <Icon key={icon} className={cx(classes.icon, { [classes.green]: icon === selectedIcon })} name={icon} onClick={() => { updateIcon(icon); setModalOpen(false) }} />
        ))}
      </div>
    </div>
  )
}
