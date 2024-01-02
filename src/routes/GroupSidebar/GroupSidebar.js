import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { object, string, array } from 'prop-types'
import { isEmpty } from 'lodash/fp'
import { personUrl, groupUrl } from 'util/navigation'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import Avatar from 'components/Avatar'
import BadgeEmoji from 'components/BadgeEmoji'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AboutSection from './AboutSection'
import './GroupSidebar.scss'
import { RESP_ADD_MEMBERS } from 'store/constants'

class GroupSidebar extends Component {
  static propTypes = {
    slug: string,
    group: object,
    members: array,
    leaders: array,
    currentUser: object
  }

  render () {
    const { group, members, leaders, canModerate, currentUser } = this.props

    if (!group || isEmpty(members)) return <Loading />

    const { description, memberCount, moderatorDescriptorPlural, purpose, slug } = group
    const responsibilities = getResponsibilitiesForGroup({ currentUser, groupId: group.id }).map(r => r.title)

    return (
      <div styleName='group-sidebar'>
        <AboutSection description={description} purpose={purpose} />
        <SettingsLink canModerate={canModerate || responsibilities.length > 0} group={group} />
        <MemberSection
          members={members}
          memberCount={memberCount}
          slug={slug}
          canModerate={canModerate || responsibilities.includes(RESP_ADD_MEMBERS)}
        />
        <GroupLeaderSection leaders={leaders} slug={slug} descriptor={moderatorDescriptorPlural} groupId={group.id} />
      </div>
    )
  }
}

export function SettingsLink ({ canModerate, group }) {
  const { t } = useTranslation()
  if (!canModerate) return null
  return (
    <Link styleName='settings-link' to={groupUrl(group.slug, 'settings')}>
      <Icon name='Settings' styleName='settings-icon' /> {t('Group Settings')}
    </Link>
  )
}

export function MemberSection ({ members, memberCount, slug, canModerate }) {
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
      {canModerate &&
        <Link to={groupUrl(slug, 'settings/invite')} styleName='invite-link'>
          <Button styleName='settings-link'><Icon name='Invite' styleName='invite-icon' /> {t('Invite People')}</Button>
        </Link>}
    </div>
  )
}

export function GroupLeaderSection ({ descriptor, leaders, groupId, slug }) {
  const { t } = useTranslation()
  return (
    <div styleName='leader-section'>
      <div styleName='header leader-header'>{t('Group {{locationDescriptor}}', { locationDescriptor: descriptor })}</div>
      {leaders.map(l => <GroupLeader leader={l} slug={slug} key={l.id} groupId={groupId} />)}
    </div>
  )
}

export function GroupLeader ({ groupId, leader, slug }) {
  const { name, avatarUrl } = leader
  const badges = (leader.commonRoles.items.concat(leader.groupRoles?.items.filter(role => role.groupId === groupId))) || []
  return (
    <div styleName='leader'>
      <Avatar url={personUrl(leader.id, slug)} avatarUrl={avatarUrl} styleName='leader-image' medium />
      <Link to={personUrl(leader.id, slug)} styleName='leader-name'>{name}</Link>
      <div styleName='badges'>
        {badges.map(badge => (
          <BadgeEmoji key={badge.name} expanded {...badge} responsibilities={badge.responsibilities.items || badge.responsibilities} id={leader.id} />
        ))}
      </div>
    </div>
  )
}

export default withTranslation()(GroupSidebar)
