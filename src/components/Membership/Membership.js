import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Group'
import getRolesForGroup from 'store/selectors/getRolesForGroup'
import { groupUrl } from 'util/navigation'
import BadgeEmoji from 'components/BadgeEmoji'
import Button from 'components/Button'
import RoundImage from 'components/RoundImage'
import './Membership.scss'

export default function Membership ({ membership, index, archive, rowStyle }) {
  const { group, person } = membership
  const { t } = useTranslation()

  // Pass in person.id here since the person loaded through the membership won't have membershipCommonRoles associated
  const roles = useSelector(state => getRolesForGroup(state, { person: person.id, groupId: group.id }))

  const leave = () => {
    if (window.confirm(t('Are you sure you want to leave {{groupName}}?', { groupName: group.name }))) {
      archive(group)
    }
  }

  return (
    <div styleName={cx('membership', { even: index % 2 === 0, odd: index % 2 !== 0, rowStyle })}>
      <Button styleName='group' color='green-white'>
        <Link to={groupUrl(group.slug)}>
          <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} small />
          {group.name}
        </Link>

        <div styleName='roles'>
          {roles.map(role => (
            <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={membership.id} />
          ))}
        </div>
      </Button>
      {archive && <span onClick={leave} styleName='leave-button'>{t('Leave')}</span>}
    </div>
  )
}
