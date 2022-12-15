import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { object, string, array } from 'prop-types'
import { isEmpty } from 'lodash/fp'
import { personUrl, groupUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AboutSection from './AboutSection'
import './GroupSidebar.scss'

class GroupSidebar extends Component {
  static propTypes = {
    slug: string,
    group: object,
    members: array,
    leaders: array
  }

  render () {
    const { group, members, leaders, canModerate } = this.props

    if (!group || isEmpty(members)) return <Loading />

    const { description, memberCount, moderatorDescriptorPlural, purpose, slug } = group

    return <div styleName='group-sidebar'>
      <SettingsLink canModerate={canModerate} group={group} />
      {canModerate && <Link to={groupUrl(slug, 'settings/invite')} styleName='invite-link'>
        <Button styleName='settings-link'><Icon name='Invite' styleName='invite-icon' /> {this.props.t('Invite People')}</Button>
      </Link>}
      <AboutSection name={name} description={description} />
      <MemberSection
        members={members}
        memberCount={memberCount}
        slug={slug}
        canModerate={canModerate} />
      <GroupLeaderSection leaders={leaders} slug={slug} descriptor={moderatorDescriptorPlural} />
    </div>
  }
}

export function SettingsLink ({ canModerate, group }) {
  const { t } = useTranslation()
  if (!canModerate) return null
  return <Link styleName='settings-link' to={groupUrl(group.slug, 'settings')}>
    <Icon name='Settings' styleName='settings-icon' /> {t('Group Settings')}
  </Link>
}

export function MemberSection ({ members, memberCount, slug, canModerate }) {
  const { t } = useTranslation()
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return <div styleName='member-section'>
    <Link to={groupUrl(slug, 'members')} styleName='members-link'>
      <div styleName='header'>{t('Members')}</div>
      <div styleName='images-and-count'>
        <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} styleName='image-row' />
        {showTotal && <span styleName='members-total'>
          {formatTotal(memberCount - members.length)}
        </span>}
      </div>
    </Link>
  </div>
}

export function GroupLeaderSection ({ descriptor, leaders, slug }) {
  const { t } = useTranslation()
  return <div styleName='leader-section'>
    <div styleName='header leader-header'>{t('Group {{descriptor}}', { descriptor })}</div>
    {leaders.map(l => <GroupLeader leader={l} slug={slug} key={l.id} />)}
  </div>
}

export function GroupLeader ({ groupId, leader, slug }) {
  const { name, avatarUrl } = leader
  const badges = leader.groupRoles?.filter(role => role.groupId === groupId) || []
  return (
    <div styleName='leader'>
      <Avatar url={personUrl(leader.id, slug)} avatarUrl={avatarUrl} styleName='leader-image' medium />
      <Link to={personUrl(leader.id, slug)} styleName='leader-name'>{name}</Link>
      <div styleName='badges'>
        {badges.map(badge => (
          <BadgeEmoji key={badge.name} expanded {...badge} id={leader.id} />
        ))}
      </div>
    </div>
  )
}

export default withTranslation()(GroupSidebar)
