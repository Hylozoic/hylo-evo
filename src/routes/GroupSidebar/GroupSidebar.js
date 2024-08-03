import { isEmpty } from 'lodash/fp'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { object, string, array } from 'prop-types'
import { personUrl, groupUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import BadgeEmoji from 'components/BadgeEmoji'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AboutSection from './AboutSection'
import { RESP_ADD_MEMBERS, RESP_ADMINISTRATION } from 'store/constants'
import getRolesForGroup from 'store/selectors/getRolesForGroup'

import './GroupSidebar.scss'

class GroupSidebar extends Component {
  static propTypes = {
    slug: string,
    group: object,
    members: array,
    stewards: array
  }

  render () {
    const { group, members, stewards, myResponsibilities } = this.props

    if (!group || isEmpty(members)) return <Loading />

    const { description, memberCount, stewardDescriptorPlural, purpose, slug } = group

    return (
      <div styleName='group-sidebar'>
        <AboutSection description={description} purpose={purpose} />
        <SettingsLink canAdmin={myResponsibilities.includes(RESP_ADMINISTRATION)} group={group} />
        <MemberSection
          members={members}
          memberCount={memberCount}
          slug={slug}
          canInvite={myResponsibilities.includes(RESP_ADD_MEMBERS)}
        />
        <GroupStewardsSection stewards={stewards} slug={slug} descriptor={stewardDescriptorPlural} groupId={group.id} />
      </div>
    )
  }
}

export function SettingsLink ({ canAdmin, group }) {
  const { t } = useTranslation()
  if (!canAdmin) return null
  return (
    <Link styleName='settings-link' to={groupUrl(group.slug, 'settings')}>
      <Icon name='Settings' styleName='settings-icon' /> {t('Group Settings')}
    </Link>
  )
}

export function MemberSection ({ members, memberCount, slug, canInvite }) {
  const { t } = useTranslation()
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return (
    <div styleName='member-section'>
      <Link to={groupUrl(slug, 'members')} styleName='members-link'>
        <div styleName='header'>{t('Members')}</div>
        <div styleName='images-and-count'>
          <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
          {showTotal &&
            <span styleName='members-total'>
              {formatTotal(memberCount - members.length)}
            </span>}
        </div>
      </Link>
      {canInvite &&
        <Link to={groupUrl(slug, 'settings/invite')} styleName='invite-link'>
          <Button styleName='settings-link'><Icon name='Invite' styleName='invite-icon' /> {t('Invite People')}</Button>
        </Link>}
    </div>
  )
}

export function GroupStewardsSection ({ descriptor, stewards, groupId, slug }) {
  const { t } = useTranslation()
  return (
    <div styleName='leader-section'>
      <div styleName='header leader-header'>{t('Group {{locationDescriptor}}', { locationDescriptor: descriptor })}</div>
      {stewards.map(s => <GroupSteward steward={s} slug={slug} key={s.id} groupId={groupId} />)}
    </div>
  )
}

export function GroupSteward ({ groupId, steward, slug }) {
  const { name, avatarUrl } = steward
  const roles = useSelector(state => getRolesForGroup(state, { person: steward, groupId }))
  return (
    <div styleName='leader'>
      <Avatar url={personUrl(steward.id, slug)} avatarUrl={avatarUrl} styleName='leader-image' medium />
      <Link to={personUrl(steward.id, slug)} styleName='leader-name'>{name}</Link>
      <div styleName='badges'>
        {roles.map(role => (
          <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={steward.id} />
        ))}
      </div>
    </div>
  )
}

export default withTranslation()(GroupSidebar)
