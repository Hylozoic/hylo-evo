import React from 'react'
import { useTranslation } from 'react-i18next'
import { groupUrl } from 'util/navigation'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import RoundImage from 'components/RoundImage'
import './Membership.scss'

export default function Membership ({ membership, index, archive }) {
  const { group, hasModeratorRole } = membership
  const { t } = useTranslation()

  const leave = () => {
    if (window.confirm(t('Are you sure you want to leave {{groupName}}?', { groupName: group.name }))) {
      archive(group)
    }
  }

  return (
    <div styleName={`membership ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <div styleName='role'>{hasModeratorRole ? group.moderatorDescriptor : 'Member'}</div> of{/* TODO: Translation */}
      <Button styleName='group' small color={'green-white'}>
        <Link to={groupUrl(group.slug)}>
          <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} small />
          {group.name}
        </Link>
      </Button>
      { archive && <span onClick={leave} styleName='leave-button'>{t('Leave')}</span> }
    </div>
  )
}
